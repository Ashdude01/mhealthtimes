import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, STRIPE_PRICES } from '../../lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { interviewType, articleId, packageName, amount, interviewDate, interviewTime } = body

    // Create a custom price for the package
    const session = await createCheckoutSession({
      customAmount: amount,
      successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}&articleId=${articleId}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/submit-article`,
      metadata: {
        articleId,
        interviewType,
        packageName,
        amount: amount.toString(),
        interviewDate: interviewDate || '',
        interviewTime: interviewTime || ''
      }
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    )
  }
}
