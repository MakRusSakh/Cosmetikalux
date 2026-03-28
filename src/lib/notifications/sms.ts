// SMS.ru API client
const SMS_API = 'https://sms.ru/sms/send'

export async function sendSMS(phone: string, message: string): Promise<boolean> {
  const apiKey = process.env.SMS_RU_API_KEY
  if (!apiKey) {
    console.log(`[SMS mock] to ${phone}: ${message}`)
    return true
  }

  try {
    const res = await fetch(
      `${SMS_API}?api_id=${apiKey}&to=${phone}&msg=${encodeURIComponent(message)}&json=1`
    )
    const data = await res.json()
    return data.status === 'OK'
  } catch {
    return false
  }
}

export async function sendVerificationCode(phone: string): Promise<string> {
  const code = Math.random().toString().slice(2, 8)
  await sendSMS(phone, `CosmetikaLux: ваш код подтверждения ${code}`)
  return code
}

export async function sendOrderStatus(
  phone: string,
  orderNumber: string,
  status: string
) {
  const statusMap: Record<string, string> = {
    CONFIRMED: 'подтверждён',
    PROCESSING: 'в обработке',
    SHIPPED: 'отправлен',
    DELIVERED: 'доставлен',
    CANCELLED: 'отменён',
  }
  await sendSMS(
    phone,
    `CosmetikaLux: заказ ${orderNumber} ${statusMap[status] || status}`
  )
}
