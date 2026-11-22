
import { API_BASE_URL } from "../api/constants/api"

// Fetch bookings for a specific customer
export const getUserBookings = async (userId: string) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/bookings/user/${userId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            }
        )

        if (!response.ok) {
            throw new Error('Failed to fetch your bookings.')
        }

        const data = await response.json()

        return data

    } catch (error) {
        console.error('Error fetching user bookings:', error)
        throw error
    }
}
