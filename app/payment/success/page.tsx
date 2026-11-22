
import { paymentVerify } from '@/lib/actions/payment'
import { stripe } from '@/lib/stripe'
import Link from 'next/link'

export default async function PaymentSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ session_id?: string }>
}) {
    const { session_id } = await searchParams

    if (!session_id) {
        throw new Error('Please provide a valid session_id.')
    }

    const session = await stripe.checkout.sessions.retrieve(session_id)

    // Check whether payment was completed successfully
    if (session.status === 'complete' && session.payment_status === 'paid') {

        // Verify payment and update MongoDB
        const result = await paymentVerify(session_id)

        if (!result.success) {
            throw new Error('Payment verification failed.')
        }
    }

    return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600">
            ✓
        </div>

        <h1 className="text-3xl font-bold">
            Payment Successful!
        </h1>

        <p className="mt-3 text-muted-foreground">
            Your equipment booking has been confirmed.
        </p>

        <Link
            href="/dashboard/customer/rentals"
            className="mt-6 rounded-lg bg-primary px-6 py-3 text-primary-foreground"
        >
            View My Rentals
        </Link>
    </section>
)
}
