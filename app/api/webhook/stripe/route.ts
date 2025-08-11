import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '../../../lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        
        // Extract metadata
        const articleId = session.metadata?.articleId
        const packageName = session.metadata?.packageName
        const interviewDate = session.metadata?.interviewDate
        const interviewTime = session.metadata?.interviewTime
        
        if (articleId) {
          // Update article payment status to 'paid'
          const { error: articleError } = await supabase
            .from('articles')
            .update({ 
              payment_status: 'paid',
              updated_at: new Date().toISOString()
            })
            .eq('id', articleId)

          if (articleError) {
            console.error('Error updating article payment status:', articleError)
          } else {
            console.log(`Payment status updated to 'paid' for article ${articleId}`)
          }

          // If interview package was selected, create/update interview record
          if (packageName && packageName !== 'basic' && interviewDate && interviewTime) {
            const { error: interviewError } = await supabase
              .from('interviews')
              .upsert({
                article_id: articleId,
                scheduled_date: interviewDate,
                scheduled_time: interviewTime,
                package_name: packageName,
                payment_status: 'paid',
                status: 'scheduled'
              })

            if (interviewError) {
              console.error('Error creating interview record:', interviewError)
            } else {
              console.log(`Interview record created/updated for article ${articleId}`)
            }
          }
        }
        break

      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object)
        break

      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
