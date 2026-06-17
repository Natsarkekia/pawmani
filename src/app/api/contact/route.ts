import { NextResponse } from "next/server";
import { Resend } from "resend";
import { auth } from "@/lib/auth";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Sign in to send a message" }, { status: 401 });
  }

  const { name, topic, message } = await req.json();

  if (!name || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "Pawmani Contact <onboarding@resend.dev>",
    to: "kashibadzeg777@gmail.com",
    replyTo: session.user.email,
    subject: `[Pawmani] ${topic || "Contact"} — ${name}`,
    text: `Name: ${name}\nEmail: ${session.user.email}\nTopic: ${topic || "—"}\n\n${message}`,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
