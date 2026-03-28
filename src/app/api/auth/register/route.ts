import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const schema = z.object({
  name: z.string().min(1, 'Имя обязательно'),
  phone: z.string().min(10, 'Некорректный телефон'),
  password: z.string().min(6, 'Пароль минимум 6 символов'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = schema.parse(body)
    const _hashedPassword = await bcrypt.hash(data.password, 12)

    // TODO: сохранить пользователя в БД (Prisma)
    // await prisma.user.create({ data: { name: data.name, phone: data.phone, password: hashedPassword } })

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
