import { requireRole } from "@/lib/core/server";

export default async function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireRole("customer");

    return <>{children}</>;
}