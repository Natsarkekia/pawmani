import { cookies } from "next/headers";
import { createT, type Locale } from "./index";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const v = store.get("lang")?.value;
  return v === "en" || v === "ka" ? v : "ka";
}

export async function getT() {
  const locale = await getLocale();
  return { t: createT(locale), locale };
}
