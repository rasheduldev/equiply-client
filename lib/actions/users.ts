
import { API_BASE_URL } from '../api/constants/api'

// Get user profile
export const getUserProfile = async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        cache: 'no-store',
    })

    if (!response.ok) {
        throw new Error('Failed to fetch user profile')
    }

    return response.json()
}

// Update user profile
export const updateUserProfile = async (
    userId: string,
    updatedData: {
        name: string
        image: string
        phone: string
        address: string
    }
) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    })

    if (!response.ok) {
        throw new Error('Failed to update user profile')
    }

    return response.json()
}
