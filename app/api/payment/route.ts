import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, STRIPE_PRICES } from '../../lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { interviewType, articleId, packageName, amount, interviewDate, interviewTime } = body

    // Get base URL with fallback
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    // Create a custom price for the package
    const session = await createCheckoutSession({
      customAmount: amount,
      successUrl: `${baseUrl}/thank-you?session_id={CHECKOUT_SESSION_ID}&articleId=${articleId}`,
      cancelUrl: `${baseUrl}/submit-article`,
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
    
    // Check if it's a JSON parsing error
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid request data format' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    )
  }
}
