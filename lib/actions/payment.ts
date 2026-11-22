
import { API_BASE_URL } from "../api/constants/api"

// Save booking before Stripe Checkout
export const createPendingBooking = async (booking: {
    equipmentId: string
    equipmentName: string
    userId: string
    userEmail: string
    startDate: string
    endDate: string
    quantity: number
    contactNumber: string
    deliveryAddress: string
    notes: string
    rentalType: string
    baseRate: number
    escrowFee: number
    totalAmount: number
}) => {
    const response = await fetch(`${API_BASE_URL}/bookings/pending`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking),
    })

    if (!response.ok) {
        throw new Error('Failed to create booking')
    }

    return response.json()
}

// Verify Stripe payment

export const paymentVerify = async (sessionId: string) => {
    const response = await fetch(`${API_BASE_URL}/payments/checkout-verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
        cache: 'no-store',
    })

    const data = await response.json()

    if (!response.ok) {
        console.error('Payment verification failed:', data)
        throw new Error(data.message || 'Payment verification failed')
    }

    return data
}

// Fetch bookings for a specific customer
export { getUserBookings } from "../api/bookings"

