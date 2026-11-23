
"use server";

import { authFetch, protectedMutation } from "@/lib/core/server";

// users

export const getAdminUsers = async () => {
    const res = await authFetch("/admin/users");

    if (!res.ok) {
        throw new Error("Failed to fetch users");
    }

    return res.json();
};

export const updateUserRole = async (id: string, role: string) => {
    const res = await protectedMutation(
        `/admin/users/${id}/role`,
        "PATCH",
        { role }
    );

    if (!res.ok) {
        throw new Error("Failed to update user role");
    }

    return res.json();
};

// equipment

export const getAdminEquipments = async () => {
    const res = await authFetch("/admin/equipments");

    if (!res.ok) {
        throw new Error("Failed to fetch equipment");
    }

    return res.json();
};

export const updateEquipmentStatus = async (
    id: string,
    status: string
) => {
    const res = await protectedMutation(
        `/admin/equipments/${id}/status`,
        "PATCH",
        { status }
    );

    if (!res.ok) {
        throw new Error("Failed to update equipment status");
    }

    return res.json();
};

export const updateAdminEquipment = async (
    id: string,
    data: Record<string, unknown>
) => {
    const res = await protectedMutation(
        `/admin/equipments/${id}`,
        "PATCH",
        data
    );

    if (!res.ok) {
        throw new Error("Failed to update equipment");
    }

    return res.json();
};

export const deleteAdminEquipment = async (id: string) => {
    const res = await protectedMutation(
        `/admin/equipments/${id}`,
        "DELETE"
    );

    if (!res.ok) {
        throw new Error("Failed to delete equipment");
    }

    return res.json();
};

// rentals

export const getAdminRentals = async () => {
    const res = await authFetch("/admin/rentals");

    if (!res.ok) {
        throw new Error("Failed to fetch rentals");
    }

    return res.json();
};
