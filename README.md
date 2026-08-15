This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## احراز هویت (ورود و ثبت‌نام)

فروشگاه با **Auth.js (NextAuth v5)** احراز هویت می‌شود؛ ورود با **حساب گوگل** یا **کد تأیید ایمیل (OTP با Resend)** امکان‌پذیر است.

### تنظیم متغیرهای محیطی

مقادیر را در فایل `.env` وارد کنید (مقدارها را خودتان از سرویس‌ها بگیرید):

```env
AUTH_SECRET=...            # بسازید با: npx auth secret
AUTH_URL=http://localhost:3000
AUTH_GOOGLE_ID=...         # از Google Cloud Console (OAuth Client)
AUTH_GOOGLE_SECRET=...
RESEND_API_KEY=...         # از https://resend.com
EMAIL_FROM="Kodak <onboarding@resend.dev>"
DATABASE_URL=...           # از قبل موجود است
```

بعد از اضافه کردن متغیرها، سرویس dev را دوباره راه‌اندازی کنید.

### نقش‌ها

- نقش همه کاربران به‌صورت پیش‌فرض `USER` است.
- هیچ صفحه یا API عمومی‌ای برای ادمین شدن وجود ندارد؛ نقش `ADMIN` فقط دستی در دیتابیس تعیین می‌شود.

بعد از اولین ورود با ایمیل ادمین موردنظر، در دیتابیس (یا با `psql` / Prisma Studio) اجرا کنید:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

نقش در هر درخواست از دیتابیس خوانده می‌شود، بنابراین بعد از این تغییر با یک بار رفرش صفحه (یا `signOut` و ورود دوباره برای اطمینان کامل) لینک «پنل مدیریت» در هدر ظاهر می‌شود.

