import { NextResponse } from 'next/server'

// TODO: подключить Prisma + авторизацию

export async function GET() {
  return NextResponse.json([])
}

export async function POST() {
  return NextResponse.json({ success: true })
}

export async function DELETE() {
  return NextResponse.json({ success: true })
}
