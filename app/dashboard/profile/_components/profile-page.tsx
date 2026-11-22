"use client"

import { useEffect, useState, type FormEvent } from "react"
import { usePathname } from "next/navigation"

import { getUserProfile, updateUserProfile } from "@/lib/actions/users"
import { authClient } from "@/lib/auth-client"

import { normalizeProfile } from "../_lib/profile-utils"
import type { Profile, ProfileField } from "../_lib/types"
import { ProfileForm } from "./profile-form"
import { ProfileHeader } from "./profile-header"
import {
  ProfileAuthRequired,
  ProfileErrorState,
  ProfileLoadingState,
} from "./profile-states"

const emptyProfile: Profile = {
  name: "",
  email: "",
  image: "",
  phone: "",
  address: "",
}

export function ProfilePage() {
  const pathname = usePathname()
  const { data: session, isPending: authPending } = authClient.useSession()

  const userId = session?.user?.id
  const sessionName = session?.user?.name ?? ""
  const sessionEmail = session?.user?.email ?? ""
  const sessionImage = session?.user?.image ?? ""

  const [profile, setProfile] = useState<Profile>(emptyProfile)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (authPending || !userId) return

    let isMounted = true

    const loadProfile = async () => {
      try {
        setLoading(true)
        setLoadError(null)

        const response: unknown = await getUserProfile(userId)
        if (!isMounted) return

        setProfile(
          normalizeProfile(response, {
            name: sessionName,
            email: sessionEmail,
            image: sessionImage,
            phone: "",
            address: "",
          })
        )
      } catch (err: unknown) {
        if (!isMounted) return

        setLoadError(
          err instanceof Error
            ? err.message
            : "Failed to load your profile. Please try again."
        )
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadProfile()

    return () => {
      isMounted = false
    }
  }, [authPending, userId, sessionName, sessionEmail, sessionImage, retryCount])

  if (!authPending && !userId) {
    return <ProfileAuthRequired callbackUrl={pathname} />
  }

  if (authPending || loading) {
    return <ProfileLoadingState />
  }

  if (loadError) {
    return (
      <ProfileErrorState
        message={loadError}
        onRetry={() => setRetryCount((count) => count + 1)}
      />
    )
  }

  const handleChange = (field: ProfileField, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }))
    setSaveError(null)
    setSuccess(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!userId || saving) return

    const updatedData = {
      name: profile.name.trim(),
      image: profile.image.trim(),
      phone: profile.phone.trim(),
      address: profile.address.trim(),
    }

    if (!updatedData.name) {
      setSaveError("Please enter your full name.")
      setSuccess(null)
      return
    }

    setSaving(true)
    setSaveError(null)
    setSuccess(null)

    try {
      await updateUserProfile(userId, updatedData)

      setProfile((current) => ({ ...current, ...updatedData }))
      setSuccess("Your profile changes were saved successfully.")
    } catch (err: unknown) {
      setSaveError(
        err instanceof Error
          ? err.message
          : "We couldn't save your profile changes. Please try again."
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 lg:p-10 dark:border-white/10 dark:bg-brand-navy-soft">
        <ProfileHeader />
        <ProfileForm
          profile={profile}
          saving={saving}
          error={saveError}
          success={success}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
