export type Profile = {
  name: string
  email: string
  image: string
  phone: string
  address: string
}

export type ProfileUpdate = Omit<Profile, "email">

export type ProfileField = keyof ProfileUpdate
