import type { Profile } from "./types"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

export function normalizeProfile(
  response: unknown,
  fallback: Profile
): Profile {
  if (!isRecord(response)) return fallback

  return {
    name:
      typeof response.name === "string" && response.name.trim()
        ? response.name
        : fallback.name,
    email:
      typeof response.email === "string" && response.email.trim()
        ? response.email
        : fallback.email,
    image: typeof response.image === "string" ? response.image : fallback.image,
    phone: typeof response.phone === "string" ? response.phone : "",
    address: typeof response.address === "string" ? response.address : "",
  }
}
