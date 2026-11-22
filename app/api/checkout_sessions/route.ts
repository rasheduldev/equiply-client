
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { getSession } from '@/lib/core/server'

export async function POST(request: Request) {
    try {
        const userSession = await getSession()

        if (!userSession?.user) {
            return NextResponse.json(
                { error: 'Please log in before making a payment.' },
                { status: 401 }
            )
        }

        const { bookingId, totalAmount } = await request.json()

        if (!bookingId || !totalAmount || Number(totalAmount) <= 0) {
            return NextResponse.json(
                { error: 'Invalid booking information.' },
                { status: 400 }
            )
        }

        const headersList = await headers()
        const origin = headersList.get('origin')

        if (!origin) {
            throw new Error('Origin header is missing.')
        }

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'bdt',
                        product_data: {
                            name: 'Equipment Rental',
                        },
                        unit_amount: Math.round(Number(totalAmount) * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            customer_email: userSession.user.email,
            metadata: {
                userId: userSession.user.id,
                bookingId: bookingId,
            },
            success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            integration_identifier: 'equiply_web_001',
        })

        return NextResponse.json({
    success: true,
    url: session.url
})

    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))

        console.error('Stripe checkout error:', error)

        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}
