import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export default stripe

export const createCheckoutSession = async (params: {
  priceId?: string
  customAmount?: number
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) => {
  const lineItems = params.priceId 
    ? [{ price: params.priceId, quantity: 1 }]
    : [{ price_data: {
        currency: 'usd',
        product_data: {
          name: 'MHealthTimes Package',
          description: params.metadata?.packageName || 'Article submission package'
        },
        unit_amount: (params.customAmount || 0) * 100 // Convert to cents
      }, quantity: 1 }];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata,
  })

  return session
}

export const STRIPE_PRICES = {
  INTERVIEW_15_MIN: process.env.STRIPE_PRICE_15_MIN!,
  INTERVIEW_30_MIN: process.env.STRIPE_PRICE_30_MIN!,
}
