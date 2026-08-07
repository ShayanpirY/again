import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  }
}
loadEnv();

const rand = mulberry32(42);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const pickN = (arr, n) => {
  const copy = [...arr];
  const out = [];
  while (out.length < n && copy.length) {
    out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0]);
  }
  return out;
};

const CATEGORIES = [
  { name: "نوزاد", slug: "نوزاد", emoji: "🍼" },
  { name: "نوپا", slug: "نوپا", emoji: "🧸" },
  { name: "دخترانه", slug: "دخترانه", emoji: "🎀" },
  { name: "پسرانه", slug: "پسرانه", emoji: "🚗" },
  { name: "تیشرت و بلوز", slug: "تیشرت-و-بلوز", emoji: "👕" },
  { name: "شلوار", slug: "شلوار", emoji: "👖" },
  { name: "کاپشن و پالتو", slug: "کاپشن-و-پالتو", emoji: "🧥" },
  { name: "لباس خواب", slug: "لباس-خواب", emoji: "🛏️" },
  { name: "ست تولد", slug: "ست-تولد", emoji: "🎂" },
];

const TITLES = {
  "نوزاد": [
    "سرهمی پنبه‌ای نوزاد طرح پلنگ",
    "ست سه‌تکه نوزاد آستین بلند",
    "لباس نوزاد جین‌بافت",
    "بلوز نوزاد یقه گرد",
    "شلوار ساق نوزاد نخی",
    "ست شال و کلاه نوزاد",
  ],
  "نوپا": [
    "ست لباس نوپا بافتنی",
    "شلوار جین نوپا",
    "بلوز نوپا طرح اتومبیل",
    "لباس راحتی نوپا سرهمی",
    "تیشرت نوپا راه‌راه",
  ],
  "دخترانه": [
    "پیراهن دخترانه توری",
    "دامن دخترانه پلیسه",
    "ست بلوز و سارافون دخترانه",
    "کاپشن دخترانه صورتی",
    "لباس مجلسی دخترانه",
  ],
  "پسرانه": [
    "ست پیراهن و شلوار پسرانه",
    "تیشرت پسرانه طرح فضا",
    "شلوار لی پسرانه",
    "ژاکت پسرانه راه‌راه",
    "ست ورزشی پسرانه",
  ],
  "تیشرت و بلوز": [
    "تیشرت پنبه‌ای طرح دار",
    "بلوز کشباف آستین بلند",
    "تیشرت آستین کوتاه رنگارنگ",
    "پلیور یقه گرد",
    "هودی با کلاه",
  ],
  "شلوار": [
    "شلوار کتان کش",
    "شلوار ساق طوسی",
    "شلوار جین مام‌استایل",
    "شلوار پارچه‌ای چین‌دار",
    "شلوار گرم زمستانی",
  ],
  "کاپشن و پالتو": [
    "کاپشن پر قو نوزاد",
    "پالتو پاییزی دخترانه",
    "کاپشن پسرانه اسپرت",
    "لباس بارانی طرح دار",
    "کت زمستانه با کلاه",
  ],
  "لباس خواب": [
    "پیژامه نوزاد طرح خرس",
    "لباس خواب پنبه‌ای دخترانه",
    "ست پیژامه پسرانه",
    "لباس خواب نوپا نخی",
    "روب‌دوشی نرم زمستانی",
  ],
  "ست تولد": [
    "ست تولد یک سالگی با کیک",
    "پک تولد دخترانه تاج‌دار",
    "ست جشن پسرانه شماره‌دار",
    "لباس تولد نوزاد صورتی",
    "ست فوت و تولد با بادکنک",
  ],
};

const BRANDS = ["بیبی لند", "نازکوت", "کیدز ورس", "تینا کیدز", "مای بیبی", "لینا", "بمبی", "سوپر استار"];
const AGE_GROUPS = ["newborn", "baby", "girl", "boy", "pre-teen"];
const SEASONS = ["بهار", "تابستان", "پاییز", "زمستان"];
const FABRICS = ["پنبه", "پلی‌استر", "نخی", "پشم", "الیاف مصنوعی", "مخلوط"];
const COLORS = [
  "#000000", // مشکی
  "#FFFFFF", // سفید
  "#FF0000", // قرمز
  "#0000FF", // آبی
  "#008000", // سبز
  "#FFFF00", // زرد
  "#FFA500", // نارنجی
  "#800080", // بنفش
  "#FFC0CB", // صورتی
  "#808080", // طوسی
  "#F5F5DC", // کرم
];

const NAMES_TO_HEX = {
  "مشکی": "#000000",
  "سفید": "#FFFFFF",
  "قرمز": "#FF0000",
  "آبی": "#0000FF",
  "سبز": "#008000",
  "زرد": "#FFFF00",
  "نارنجی": "#FFA500",
  "بنفش": "#800080",
  "صورتی": "#FFC0CB",
  "قهوه‌ای": "#A52A2A",
  "طوسی": "#808080",
  "خاکستری": "#808080",
  "کرم": "#F5F5DC",
  "یاسی": "#E6E6FA",
  "فیروزه‌ای": "#40E0D0",
  "سورمه‌ای": "#000080",
  "زرشکی": "#800000",
  "نعنایی": "#98FF98",
  "طلایی": "#FFD700",
};
const SIZES = [
  "۰-۳ ماه",
  "۳-۶ ماه",
  "۶-۱۲ ماه",
  "۱-۲ سال",
  "۲-۴ سال",
  "۴-۶ سال",
  "۶-۸ سال",
  "۸-۱۰ سال",
  "سایز ۱",
  "سایز ۲",
  "سایز ۳",
  "سایز ۴",
];

const DESCRIPTIONS = [
  "پارچه نرم و لطیف، مناسب پوست حساس کودک.",
  "دوخت باکیفیت و رنگ ثابت، مناسب فصل {season}.",
  "راحتی و سبکی در کنار ظاهر زیبا برای کودکان.",
  "جنس مرغوب و مقاوم، قابل استفاده روزانه.",
  "طراحی شیک و رنگ‌بندی متنوع برای سلیقه‌های مختلف.",
];

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function svgPlaceholder(emoji, color) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='400' height='400' fill='${color}'/><text x='200' y='230' font-size='120' text-anchor='middle'>${emoji}</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

const PASTELS = ["#fde2e4", "#e2f0cb", "#c9e4de", "#f6e1b6", "#d0e2ff", "#e8d5f5", "#fce8d6"];
const IMAGE_SHADES = ["#ffe8e8", "#e8f0ff", "#fff0e0", "#e8ffe8", "#f5e8ff"];

async function normalizeColors(client) {
  const prodRes = await client.query('SELECT id, colors FROM "Product"');
  let productsFixed = 0;
  for (const row of prodRes.rows) {
    const colors = row.colors;
    if (!Array.isArray(colors) || colors.length === 0) continue;
    const mapped = colors.map((c) => NAMES_TO_HEX[c] || c);
    if (mapped.some((c, i) => c !== colors[i])) {
      await client.query('UPDATE "Product" SET colors = $1 WHERE id = $2', [mapped, row.id]);
      productsFixed += 1;
    }
  }

  const varRes = await client.query('SELECT id, color FROM "Variant" WHERE color IS NOT NULL');
  let variantsFixed = 0;
  for (const row of varRes.rows) {
    const hex = NAMES_TO_HEX[row.color];
    if (hex) {
      await client.query('UPDATE "Variant" SET color = $1 WHERE id = $2', [hex, row.id]);
      variantsFixed += 1;
    }
  }
  return { productsFixed, variantsFixed };
}

async function expandImages(client) {
  const res = await client.query('SELECT id, images FROM "Product"');
  let expanded = 0;
  for (const row of res.rows) {
    const images = row.images;
    if (!Array.isArray(images) || images.length !== 1) continue;
    const img = images[0];
    if (typeof img !== "string" || !img.startsWith("data:image/svg+xml;base64,")) continue;
    const svg = Buffer.from(img.split(",")[1], "base64").toString("utf8");
    const m = svg.match(/<text[^>]*>([^<]*)<\/text>/);
    if (!m) continue;
    const extra = IMAGE_SHADES.slice(0, 2).map((c) => svgPlaceholder(m[1], c));
    await client.query('UPDATE "Product" SET images = $1 WHERE id = $2', [[...images, ...extra], row.id]);
    expanded += 1;
  }
  return expanded;
}

function buildCatalog() {
  const products = [];
  for (const cat of CATEGORIES) {
    for (const title of TITLES[cat.name] || []) {
      const season = pick(SEASONS);
      const ageGroup = pick(AGE_GROUPS);
      const brand = pick(BRANDS);
      const fabric = pick(FABRICS);
      const colors = pickN(COLORS, 1 + Math.floor(rand() * 3));
      const sizes = pickN(SIZES, 2 + Math.floor(rand() * 2));
      const basePrice = 120000 + Math.floor(rand() * 500000);
      const isSale = rand() < 0.3;
      const isNew = rand() < 0.35;
      const stock = rand() < 0.15 ? 0 : 2 + Math.floor(rand() * 40);
      products.push({
        title,
        categoryName: cat.name,
        emoji: cat.emoji,
        color: pick(PASTELS),
        price: isSale ? Math.round((basePrice * 0.7) / 1000) * 1000 : basePrice,
        originalPrice: isSale ? basePrice : null,
        description: pick(DESCRIPTIONS).replace("{season}", season),
        brand,
        ageGroup,
        season,
        fabric,
        colors,
        sizes,
        isSale,
        isNew,
        stock,
      });
    }
  }
  return products;
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set. Check .env");
    process.exit(1);
  }

  const pool = new pg.Pool({ connectionString: url });
  const client = await pool.connect();
  try {
    const categoryIds = {};
    for (const cat of CATEGORIES) {
      const existing = await client.query('SELECT id FROM "Category" WHERE slug = $1', [cat.slug]);
      if (existing.rowCount > 0) {
        categoryIds[cat.name] = existing.rows[0].id;
      } else {
        const now = new Date();
        const id = randomUUID();
        await client.query(
          'INSERT INTO "Category" (id, name, slug, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5)',
          [id, cat.name, cat.slug, now, now]
        );
        categoryIds[cat.name] = id;
      }
    }

    const existingTitles = new Set();
    const res = await client.query('SELECT title FROM "Product"');
    for (const row of res.rows) existingTitles.add(row.title);

    const { productsFixed, variantsFixed } = await normalizeColors(client);
    const expandedImages = await expandImages(client);

    const catalog = buildCatalog();
    let created = 0;
    for (const p of catalog) {
      if (existingTitles.has(p.title)) continue;

      const now = new Date();
      const id = randomUUID();
      const images = [svgPlaceholder(p.emoji, p.color), ...IMAGE_SHADES.slice(0, 2).map((c) => svgPlaceholder(p.emoji, c))];
      const image = images[0];
      await client.query(
        `INSERT INTO "Product"
          (id, title, price, description, images, sizes, "categoryId", "isActive", "isSale", "isNew", "createdAt", "updatedAt", colors, stock, brand, "ageGroup", season, fabric)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
        [
          id,
          p.title,
          p.price,
          p.description,
          images,
          p.sizes,
          categoryIds[p.categoryName],
          true,
          p.isSale,
          p.isNew,
          now,
          now,
          p.colors,
          p.stock,
          p.brand,
          p.ageGroup,
          p.season,
          p.fabric,
        ]
      );

      const firstSize = p.sizes[0];
      for (const color of p.colors.slice(0, 2)) {
        await client.query(
          `INSERT INTO "Variant" (id, "productId", color, size, stock, sku, price, image, "createdAt", "updatedAt")
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [
            randomUUID(),
            id,
            color,
            firstSize,
            Math.max(0, p.stock - 1),
            `SKU-${randomUUID().slice(0, 6).toUpperCase()}`,
            p.price,
            image,
            now,
            now,
          ]
        );
      }

      created += 1;
    }

    const total = await client.query('SELECT count(*)::int AS count FROM "Product"');
    console.log(`Seeded ${created} new product(s). Total products: ${total.rows[0].count}`);
    console.log(`Normalized colors: ${productsFixed} product(s), ${variantsFixed} variant(s). Expanded images: ${expandedImages} product(s).`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
