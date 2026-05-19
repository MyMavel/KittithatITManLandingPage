import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validation";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return NextResponse.json({ fieldErrors }, { status: 400 });
  }

  const { name, email, company, message } = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("customers").insert({
    name,
    email,
    company: company ? company : null,
    message: message ? message : null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
