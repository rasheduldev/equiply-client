import { redirect } from "next/navigation"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const callbackUrl =
    (typeof params.callbackUrl === "string" && params.callbackUrl) ||
    (typeof params.redirect === "string" && params.redirect) ||
    (typeof params.redirectTo === "string" && params.redirectTo) ||
    "/"

  redirect(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`)
}
