import { NextResponse } from 'next/server'
import { z } from 'zod'

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1),
})

const addressSchema = z.object({
  city: z.string(),
  street: z.string(),
  apartment: z.string().optional(),
  zip: z.string(),
})

const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  contactName: z.string().min(2),
  contactPhone: z.string().min(10),
  contactEmail: z.string().email().optional(),
  deliveryMethod: z.enum(['PICKUP', 'COURIER', 'PVZ']),
  deliveryAddress: addressSchema.optional(),
  paymentMethod: z.enum(['CARD', 'SBP', 'CASH']),
  comment: z.string().optional(),
})

export type OrderInput = z.infer<typeof orderSchema>

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()
    const parsed = orderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { deliveryMethod, deliveryAddress } = parsed.data

    if (deliveryMethod !== 'PICKUP' && !deliveryAddress) {
      return NextResponse.json(
        { error: 'Адрес доставки обязателен для курьера и ПВЗ' },
        { status: 400 },
      )
    }

    const orderNumber = 'CL-' + Date.now().toString(36).toUpperCase()

    // TODO: сохранение в БД через Prisma (когда подключена)

    return NextResponse.json(
      { orderNumber, status: 'NEW', createdAt: new Date().toISOString() },
      { status: 201 },
    )
  } catch {
    return NextResponse.json(
      { error: 'Некорректный JSON' },
      { status: 400 },
    )
  }
}
