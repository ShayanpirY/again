import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const THUMB_WIDTH = 360;
const THUMB_HEIGHT = 640;

function getConfig() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;

  if (!cloud_name || !api_key || !api_secret) {
    throw new Error("Cloudinary is not configured.");
  }

  return { cloud_name, api_key, api_secret };
}

function buildThumbnail(publicId: string, isVideo: boolean): string {
  const { cloud_name } = getConfig();
  const type = isVideo ? "video" : "image";
  const transform = isVideo
    ? `so_0.5,w_${THUMB_WIDTH},h_${THUMB_HEIGHT},c_fill,f_jpg,q_auto`
    : `w_${THUMB_WIDTH},h_${THUMB_HEIGHT},c_fill,f_webp,q_auto`;
  return `https://res.cloudinary.com/${cloud_name}/${type}/upload/${transform}/${publicId}`;
}

function uploadBuffer(buffer: Buffer, isVideo: boolean) {
  return new Promise<{ url: string; thumbnail: string; publicId: string }>(
    (resolve, reject) => {
      const { cloud_name, api_key, api_secret } = getConfig();
      cloudinary.config({ cloud_name, api_key, api_secret });

      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "stories",
          resource_type: isVideo ? "video" : "image",
          use_filename: false,
        },
        (error, result) => {
          if (error || !result?.secure_url) {
            reject(error ?? new Error("Cloudinary upload failed."));
            return;
          }
          resolve({
            url: result.secure_url,
            thumbnail: buildThumbnail(result.public_id, isVideo),
            publicId: result.public_id,
          });
        }
      );

      stream.write(buffer);
      stream.end();
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof (file as File).arrayBuffer !== "function") {
      return NextResponse.json(
        { error: "فایلی ارسال نشده است." },
        { status: 400 }
      );
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

    const buffer = Buffer.from(await f.arrayBuffer());
    const result = await uploadBuffer(buffer, isVideo);

    return NextResponse.json({
      url: result.url,
      thumbnail: result.thumbnail,
      publicId: result.publicId,
    });
  } catch (error) {
    console.error("Upload error:", error);
    const message =
      error instanceof Error && error.message === "Cloudinary is not configured."
        ? "سرویس آپلود فایل پیکربندی نشده است."
        : "خطا در بارگذاری فایل. لطفاً دوباره تلاش کنید.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
