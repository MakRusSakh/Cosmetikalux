const RESEND_API = 'https://api.resend.com/emails'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

async function sendEmail(options: EmailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.log(`[Email mock] to ${options.to}: ${options.subject}`)
    return true
  }

  try {
    const res = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'CosmetikaLux <noreply@cosmetikalux.ru>',
        ...options,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function sendOrderConfirmation(
  email: string,
  orderNumber: string,
  total: number
) {
  await sendEmail({
    to: email,
    subject: `Заказ ${orderNumber} оформлен — CosmetikaLux`,
    html: `<h2>Спасибо за заказ!</h2>
<p>Номер заказа: <strong>${orderNumber}</strong></p>
<p>Сумма: ${total.toLocaleString('ru-RU')} ₽</p>
<p>Мы уведомим вас о статусе доставки.</p>`,
  })
}

export async function sendWelcome(email: string, name: string) {
  await sendEmail({
    to: email,
    subject: 'Добро пожаловать в CosmetikaLux!',
    html: `<h2>Здравствуйте, ${name}!</h2>
<p>Рады приветствовать вас. Используйте промокод <strong>ПРИВЕТ10</strong> для скидки 10% на первый заказ.</p>`,
  })
}
