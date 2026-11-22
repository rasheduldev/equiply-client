import type { FormEvent } from "react"

import type { Profile, ProfileField } from "../_lib/types"
import { ProfileActions } from "./profile-actions"
import { ProfileAlert } from "./profile-alert"
import { ProfileIncompleteNotice } from "./profile-incomplete-notice"
import {
  ProfileField as FormField,
  ProfileImageField,
  ProfileInput,
} from "./profile-field"

type ProfileFormProps = {
  profile: Profile
  saving: boolean
  error: string | null
  success: string | null
  onChange: (field: ProfileField, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function ProfileForm({
  profile,
  saving,
  error,
  success,
  onChange,
  onSubmit,
}: ProfileFormProps) {
  const isIncomplete = !profile.phone.trim() || !profile.address.trim()

  return (
    <form onSubmit={onSubmit} aria-busy={saving} className="mt-8 space-y-6">
      {error && <ProfileAlert variant="error">{error}</ProfileAlert>}
      {success && <ProfileAlert variant="success">{success}</ProfileAlert>}
      {isIncomplete && <ProfileIncompleteNotice />}

      <div className="grid gap-5 md:grid-cols-2">
        <FormField id="profile-name" label="Full Name">
          <ProfileInput
            id="profile-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={profile.name}
            onChange={(event) => onChange("name", event.target.value)}
            disabled={saving}
            placeholder="Your full name"
          />
        </FormField>

        <FormField id="profile-email" label="Email (Verified)">
          <ProfileInput
            id="profile-email"
            name="email"
            type="email"
            autoComplete="email"
            value={profile.email}
            readOnly
            aria-readonly="true"
            title="Email cannot be changed"
            className="cursor-not-allowed bg-slate-100 text-slate-500 focus:border-slate-200 focus:bg-slate-100 focus:ring-0 dark:bg-white/5 dark:text-white/45 dark:focus:border-white/10 dark:focus:bg-white/5"
          />
        </FormField>

        <FormField id="profile-phone" label="Phone Number">
          <ProfileInput
            id="profile-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={profile.phone}
            onChange={(event) => onChange("phone", event.target.value)}
            disabled={saving}
            placeholder="+1 (512) 000-0000"
          />
        </FormField>

        <ProfileImageField
          id="profile-image"
          value={profile.image}
          onChange={(value) => onChange("image", value)}
          disabled={saving}
        />

        <FormField
          id="profile-address"
          label="Default Site / Billing Address"
          className="md:col-span-2"
        >
          <ProfileInput
            id="profile-address"
            name="address"
            type="text"
            autoComplete="street-address"
            value={profile.address}
            onChange={(event) => onChange("address", event.target.value)}
            disabled={saving}
            placeholder="Street address, city, state, ZIP"
          />
        </FormField>
      </div>

      <ProfileActions saving={saving} />
    </form>
  )
}
