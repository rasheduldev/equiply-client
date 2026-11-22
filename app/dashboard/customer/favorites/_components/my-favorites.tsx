"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import { getUserFavorites, removeFavorite } from "@/lib/actions/favorites"
import { authClient } from "@/lib/auth-client"

import { parseFavoritesResponse } from "../_lib/favorites-utils"
import type { FavoriteItem } from "../_lib/types"
import { FavoritesAuthRequired } from "./favorites-auth-required"
import { FavoritesEmptyState } from "./favorites-empty-state"
import { FavoritesErrorBanner } from "./favorites-error-banner"
import { FavoritesTable } from "./favorites-table"

export function MyFavorites() {
  const { data: session, isPending: authPending } = authClient.useSession()
  const userId = session?.user?.id

  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [removingId, setRemovingId] = useState<string | null>(null)

  useEffect(() => {
    if (authPending || !userId) return

    let isMounted = true

    const fetchFavorites = async () => {
      try {
        setLoading(true)
        setError(null)

        const response: unknown = await getUserFavorites(userId)
        if (!isMounted) return

        setFavorites(parseFavoritesResponse(response))
      } catch (err: unknown) {
        if (!isMounted) return

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load your favorite equipment. Please try again."
        )
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void fetchFavorites()

    return () => {
      isMounted = false
    }
  }, [authPending, userId, retryCount])

  if (!authPending && !userId) {
    return <FavoritesAuthRequired />
  }

  const handleRetry = () => {
    setRetryCount((count) => count + 1)
  }

  const handleRemove = async (favorite: FavoriteItem) => {
    if (removingId) return

    setRemovingId(favorite._id)

    try {
      await removeFavorite(favorite._id)

      setFavorites((current) =>
        current.filter((item) => item._id !== favorite._id)
      )

      toast.success("Removed from favorites", {
        description: favorite.equipment?.name
          ? `${favorite.equipment.name} was removed from your saved equipment.`
          : "The favorite was removed successfully.",
      })
    } catch (err: unknown) {
      toast.error("Couldn't remove favorite", {
        description:
          err instanceof Error ? err.message : "Please try again in a moment.",
      })
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 dark:border-white/10 dark:bg-brand-navy-soft">
        <h1 className="mb-6 text-xl font-bold tracking-tight text-brand-navy sm:text-2xl dark:text-white">
          Saved Favorite Equipment {loading ? "" : `(${favorites.length})`}
        </h1>

        {error && (
          <FavoritesErrorBanner message={error} onRetry={handleRetry} />
        )}

        {loading ? (
          <FavoritesTable
            favorites={[]}
            loading
            removingId={null}
            onRemove={handleRemove}
          />
        ) : favorites.length === 0 ? (
          error ? null : (
            <FavoritesEmptyState />
          )
        ) : (
          <FavoritesTable
            favorites={favorites}
            removingId={removingId}
            onRemove={handleRemove}
          />
        )}
      </div>
    </div>
  )
}
