import { API_BASE_URL } from "@/lib/api/constants/api"

// Customer details for rentals live in the users collection.
export async function getAllUsers(): Promise<unknown> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch users")
  }

  return response.json()
}
