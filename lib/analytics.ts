"use server";

import { authFetch } from "@/lib/core/server";

export const getAdminAnalytics = async () => {
    const res = await authFetch("/admin/analytics");

    if (!res.ok) {
        throw new Error("Failed to fetch admin analytics");
    }

    return res.json();
};

export const getOwnerAnalytics = async () => {
    const res = await authFetch("/owner/analytics");

    if (!res.ok) {
        throw new Error("Failed to fetch owner analytics");
    }

    return res.json();
};