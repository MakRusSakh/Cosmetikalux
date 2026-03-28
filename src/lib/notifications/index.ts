export { sendSMS, sendVerificationCode, sendOrderStatus } from './sms'
export { sendOrderConfirmation, sendWelcome } from './email'

// Единый фасад для уведомлений при создании заказа
export async function notifyOrderCreated(
  phone: string,
  email: string | undefined,
  orderNumber: string,
  total: number
) {
  const { sendOrderStatus } = await import('./sms')
  const { sendOrderConfirmation } = await import('./email')

  await sendOrderStatus(phone, orderNumber, 'CONFIRMED')
  if (email) await sendOrderConfirmation(email, orderNumber, total)
}
