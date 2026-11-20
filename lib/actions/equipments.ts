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