import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "ایمیل معتبر وارد کنید." }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
      return NextResponse.json(
        { error: "ارسال ایمیل هنوز پیکربندی نشده است. ابتدا RESEND_API_KEY و EMAIL_FROM را تنظیم کنید." },
        { status: 500 }
      );
    }

    const recent = await prisma.emailOtp.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (recent && recent.createdAt > new Date(Date.now() - 60 * 1000)) {
      return NextResponse.json(
        { error: "کد تأیید قبلی هنوز معتبر است. لطفاً یک دقیقه دیگر دوباره تلاش کنید." },
        { status: 429 }
      );
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.emailOtp.deleteMany({ where: { email } });

    await prisma.emailOtp.create({
      data: { email, code, expiresAt },
    });

    const { error } = await resend!.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "کد ورود به فروشگاه کودک",
      html: `
        <div dir="rtl" style="font-family: Tahoma, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #faf9f7; border-radius: 16px;">
          <h2 style="color: #d97757; margin: 0 0 12px;">فروشگاه کودک</h2>
          <p style="color: #333; line-height: 1.9; margin: 0 0 16px;">سلام، کد ورود شما:</p>
          <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px; text-align: center; color: #111827; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin: 0 0 16px;">${code}</p>
          <p style="color: #666; font-size: 13px; line-height: 1.9; margin: 0;">این کد تا <strong>۱۰ دقیقه</strong> معتبر است. اگر درخواست ورود نداده‌اید، این ایمیل را نادیده بگیرید.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "ارسال ایمیل ناموفق بود. لطفاً دوباره تلاش کنید." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send OTP:", error);
    return NextResponse.json({ error: "خطایی رخ داد. لطفاً دوباره تلاش کنید." }, { status: 500 });
  }
}
