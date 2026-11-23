
import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { API_BASE_URL } from "../api/constants/api";

export const getSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return session;
};

export const getToken = async () => {
    const session = await getSession();

    if (!session?.session?.token) {
        redirect("/unauthorized");
    }

    return session.session.token;
};

export const authFetch = async (api: string) => {
    const token = await getToken();

    const res = await fetch(`${API_BASE_URL}${api}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    if (res.status === 401 || res.status === 403) {
        redirect("/unauthorized");
    }

    return res;
};

export const protectedMutation = async (
    api: string,
    method: string,
    data?: unknown
) => {
    const token = await getToken();

    const res = await fetch(`${API_BASE_URL}${api}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: data !== undefined ? JSON.stringify(data) : undefined,
        cache: "no-store",
    });

    if (res.status === 401 || res.status === 403) {
        redirect("/unauthorized");
    }

    return res;
};

export const requireRole = async (role: string) => {
    const session = await getSession();

    if (!session || session.user.role !== role) {
        redirect("/unauthorized");
    }

    return session;
};
