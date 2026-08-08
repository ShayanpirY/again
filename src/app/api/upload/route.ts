import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof (file as File).arrayBuffer !== "function") {
      return NextResponse.json({ error: "فایلی ارسال نشده است." }, { status: 400 });
    }

    const f = file as File;
    const isImage = f.type.startsWith("image/");
    const isVideo = f.type.startsWith("video/");

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "فقط فایل تصویر یا ویدیو مجاز است." },
        { status: 400 }
      );
    }

    if (f.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "حجم فایل نباید بیشتر از ۵۰ مگابایت باشد." },
        { status: 400 }
      );
    }

    const ext = path.extname(f.name).toLowerCase() || (isImage ? ".jpg" : ".mp4");
    const filename = `${randomUUID()}${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads", "stories");

    await mkdir(dir, { recursive: true });
    const buffer = Buffer.from(await f.arrayBuffer());
    await writeFile(path.join(dir, filename), buffer);

    return NextResponse.json({ url: `/uploads/stories/${filename}` });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "خطا در بارگذاری فایل. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}
