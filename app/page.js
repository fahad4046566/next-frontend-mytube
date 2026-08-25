import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// Root – token hai to dashboard, warna login.
export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");
  redirect(token ? "/dashboard" : "/login");
}
