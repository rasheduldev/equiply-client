export type EquipmentReference = {
  _id?: string
  name?: string
}

export type BookingItem = {
  _id?: string
  id?: string
  equipmentId?: string | EquipmentReference
  equipmentName?: string
  equipment?: {
    name?: string
    title?: string
  }
  startDate?: string | null
  endDate?: string | null
  bookingDate?: string | null
  createdAt?: string | null
  totalAmount?: number | string | null
  totalPrice?: number | string | null
  paymentStatus?: string | null
  payment?: string | null
  status?: string | null
  bookingStatus?: string | null
  quantity?: number
}

export type BadgeConfig = {
  label: string
  className: string
}
