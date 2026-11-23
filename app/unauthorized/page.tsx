
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
            <ShieldAlert className="mb-4 h-16 w-16 text-destructive" />

            <h1 className="text-3xl font-bold">
                Access Denied
            </h1>

            <p className="mt-3 max-w-md text-muted-foreground">
                Sorry, you do not have permission to access this page.
            </p>

            <Link
                href="/"
                className="mt-6 rounded-md bg-primary px-5 py-2.5 text-primary-foreground hover:opacity-90"
            >
                Back to Home
            </Link>
        </div>
    );
}
