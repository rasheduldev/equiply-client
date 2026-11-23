import { requireRole } from "@/lib/core/server";

export default async function OwnerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireRole("owner");

    return <>{children}</>;
}