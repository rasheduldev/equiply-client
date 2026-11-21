import { EquipmentData} from "@/app/dashboard/owner/add-equipment/_lib/equipment-form";
import { API_BASE_URL } from "../api/constants/api";

export const createEquipment = async (data: EquipmentData) => {
    const res = await fetch(`${API_BASE_URL}/equipments`, {
        method: "POST",
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return res.json();
}

export const deleteEquipment = async (equipmentId: string) => {
  const res = await fetch(`${API_BASE_URL}/equipments/${equipmentId}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    throw new Error("Failed to delete equipment")
  }

  return res.json()
}