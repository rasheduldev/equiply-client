export type AdminRole = "customer" | "owner" | "admin"

export type AdminUser = {
  id: string
  name: string
  email: string
  image: string
  role: AdminRole
  createdAt: string
}

export type AdminEquipment = {
  id: string
  name: string
  ownerName: string
  ownerEmail: string
  category: string
  rentalPrice: number | null
  rentalType: string
  status: string
  location: string
  availableQuantity: number
  condition: string
  brand: string
  model: string
  description: string
  imageUrl: string
  createdAt: string
}

export type AdminRental = {
  id: string
  customerName: string
  customerEmail: string
  ownerName: string
  equipmentName: string
  startDate: string
  endDate: string
  quantity: number
  amount: number | string | null
  paymentStatus: string
  bookingStatus: string
  createdAt: string
}

export type EquipmentEditValues = {
  name: string
  category: string
  location: string
  rentalPrice: number
  rentalType: string
  availableQuantity: number
  brand: string
  model: string
  condition: string
  description: string
}
