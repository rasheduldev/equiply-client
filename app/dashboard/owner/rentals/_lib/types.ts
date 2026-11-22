export type RentalUser = {
  _id?: string
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
  phone?: string | null
}

export type RentalEquipment = {
  _id?: string
  id?: string
  name?: string | null
  imageUrl?: string | null
  ownerId?: string | null
}

export type RentalBooking = {
  _id?: string
  id?: string
  equipmentId?: string | null
  equipmentName?: string | null
  userId?: string | null
  userEmail?: string | null
  startDate?: string | null
  endDate?: string | null
  quantity?: number | string | null
  totalAmount?: number | string | null
  paymentStatus?: string | null
  bookingStatus?: string | null
  createdAt?: string | null
}

export type RentalRow = {
  id: string
  customerName: string
  customerEmail: string
  customerImage: string
  equipmentName: string
  equipmentImage: string
  startDate: string
  endDate: string
  quantity: number
  amount: number | string | null
  paymentStatus: string
  bookingStatus: string
}

export type BadgeConfig = {
  label: string
  className: string
}
