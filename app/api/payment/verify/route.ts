import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Determine payment status
    let status: 'pending' | 'paid' | 'failed' = 'pending'
    
    if (session.payment_status === 'paid') {
      status = 'paid'
    } else if (session.payment_status === 'unpaid' || session.status === 'expired') {
      status = 'failed'
    }

    return NextResponse.json({
      status,
      sessionId: session.id,
      paymentStatus: session.payment_status,
      sessionStatus: session.status,
      amount: session.amount_total,
      currency: session.currency
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
