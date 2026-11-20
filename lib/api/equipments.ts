import { API_BASE_URL } from "./constants/api";

export const getEquipments = async () =>{
    const res = await fetch(`${API_BASE_URL}/equipments`);
    return res.json();
}