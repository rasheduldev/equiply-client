
import { API_BASE_URL } from '../api/constants/api'

// Add equipment to favorites
export const addToFavorites = async (
    userId: string,
    equipmentId: string
) => {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, equipmentId }),
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Failed to add favorite')
    }

    return data
}

// Get customer's favorites
export const getUserFavorites = async (userId: string) => {
    const response = await fetch(
        `${API_BASE_URL}/favorites/${userId}`,
        { cache: 'no-store' }
    )

    if (!response.ok) {
        throw new Error('Failed to fetch favorites')
    }

    return response.json()
}

// Remove a favorite
export const removeFavorite = async (favoriteId: string) => {
    const response = await fetch(
        `${API_BASE_URL}/favorites/${favoriteId}`,
        { method: 'DELETE' }
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Failed to remove favorite')
    }

    return data
}
