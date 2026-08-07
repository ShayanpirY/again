const productsLink = (params: Record<string, string>): string => {
  const search = new URLSearchParams(params).toString();
  return `/products?${search}`;
};

const category = (slug: string) => productsLink({ category: slug });
const age = (value: string) => productsLink({ age: value });
const sort = (value: string) => productsLink({ sort: value });
const season = (value: string) => productsLink({ season: value });
const fabric = (value: string) => productsLink({ fabric: value });

const REAL_CATEGORIES = {
  newborn: "نوزاد",
  tshirt: "تیشرت-و-بلوز",
  pants: "شلوار",
  jacket: "کاپشن-و-پالتو",
  sleepsuit: "لباس-خواب",
  set: "ست-تولد",
};

const UNSTOCKED_CATEGORIES = {
  sneakers: "کفش-کتانی",
  booties: "پاپوش",
  hat: "کلاه",
  socks: "جوراب",
  bag: "کیف",
  boots: "پوتین",
  gloves: "دستکش",
  gifts: "هدایا",
  accessory: "اکسسوری",
  swimwear: "لباس-استخر",
  sportswear: "لباس-ورزشی",
};

const collections = {
  newest: sort("newest"),
  bestSelling: sort("best-selling"),
  organic: fabric("پنبه"),
  spring: season("بهار"),
  summer: season("تابستان"),
  autumn: season("پاییز"),
  winter: season("زمستان"),
};

export const megaMenuData = {
  newborn: {
    clothing: [
      { name: "لباس نوزاد", href: category(REAL_CATEGORIES.newborn) },
      { name: "سرهمی نوزاد", href: category(REAL_CATEGORIES.newborn) },
      { name: "لباس خواب", href: category(REAL_CATEGORIES.sleepsuit) },
      { name: "ست نوزاد", href: category(REAL_CATEGORIES.set) },
      { name: "پوشاک نوزاد", href: category(REAL_CATEGORIES.newborn) },
    ],
    shoesAccessories: [
      { name: "پوتین نوزاد", href: category(UNSTOCKED_CATEGORIES.boots) },
      { name: "جوراب نوزاد", href: category(UNSTOCKED_CATEGORIES.socks) },
      { name: "کلاه نوزاد", href: category(UNSTOCKED_CATEGORIES.hat) },
      { name: "دستکش نوزاد", href: category(UNSTOCKED_CATEGORIES.gloves) },
      { name: "هدایا", href: category(UNSTOCKED_CATEGORIES.gifts) },
    ],
    collections: [
      { name: "جدیدترین‌ها", href: collections.newest },
      { name: "پرفروش‌ترین‌ها", href: collections.bestSelling },
      { name: "پوشاک ارگانیک", href: collections.organic },
      { name: "کالکشن بهار", href: collections.spring },
    ],
    banner: {
      image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop",
      title: "کالکشن نوزاد",
      subtitle: "نرمی و آرامش برای کوچک‌ترین‌ها",
      href: age("newborn"),
    },
  },
  baby: {
    clothing: [
      { name: "تی‌شرت", href: category(REAL_CATEGORIES.tshirt) },
      { name: "پولوشرت", href: category(REAL_CATEGORIES.tshirt) },
      { name: "پیراهن", href: category(REAL_CATEGORIES.tshirt) },
      { name: "شلوار", href: category(REAL_CATEGORIES.pants) },
      { name: "کاپشن و ژاکت", href: category(REAL_CATEGORIES.jacket) },
    ],
    shoesAccessories: [
      { name: "کفش کتانی", href: category(UNSTOCKED_CATEGORIES.sneakers) },
      { name: "پاپوش", href: category(UNSTOCKED_CATEGORIES.booties) },
      { name: "کلاه و شال", href: category(UNSTOCKED_CATEGORIES.hat) },
      { name: "جوراب", href: category(UNSTOCKED_CATEGORIES.socks) },
      { name: "کیف و کوله", href: category(UNSTOCKED_CATEGORIES.bag) },
    ],
    collections: [
      { name: "جدیدترین‌ها", href: collections.newest },
      { name: "پرفروش‌ترین‌ها", href: collections.bestSelling },
      { name: "پوشاک ارگانیک", href: collections.organic },
      { name: "کالکشن تابستان", href: collections.summer },
    ],
    banner: {
      image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=600&auto=format&fit=crop",
      title: "کالکشن کودک",
      subtitle: "سبک و راحتی برای کوچک‌های شاد",
      href: age("baby"),
    },
  },
  girl: {
    clothing: [
      { name: "پیراهن دخترانه", href: category(REAL_CATEGORIES.tshirt) },
      { name: "بلوز دخترانه", href: category(REAL_CATEGORIES.tshirt) },
      { name: "دامن دخترانه", href: category(REAL_CATEGORIES.tshirt) },
      { name: "ست دخترانه", href: category(REAL_CATEGORIES.set) },
      { name: "لباس استخر", href: category(UNSTOCKED_CATEGORIES.swimwear) },
    ],
    shoesAccessories: [
      { name: "کفش دخترانه", href: category(UNSTOCKED_CATEGORIES.sneakers) },
      { name: "پاپوش", href: category(UNSTOCKED_CATEGORIES.booties) },
      { name: "کلاه و شال", href: category(UNSTOCKED_CATEGORIES.hat) },
      { name: "جوراب", href: category(UNSTOCKED_CATEGORIES.socks) },
      { name: "اکسسوری", href: category(UNSTOCKED_CATEGORIES.accessory) },
    ],
    collections: [
      { name: "جدیدترین‌ها", href: collections.newest },
      { name: "پرفروش‌ترین‌ها", href: collections.bestSelling },
      { name: "پوشاک ارگانیک", href: collections.organic },
      { name: "کالکشن تابستان", href: collections.summer },
    ],
    banner: {
      image: "https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?q=80&w=600&auto=format&fit=crop",
      title: "کالکشن دخترانه",
      subtitle: "ظرافت و شادابی برای دختران",
      href: age("girl"),
    },
  },
  boy: {
    clothing: [
      { name: "تی‌شرت پسرانه", href: category(REAL_CATEGORIES.tshirt) },
      { name: "پولوشرت", href: category(REAL_CATEGORIES.tshirt) },
      { name: "شلوار پسرانه", href: category(REAL_CATEGORIES.pants) },
      { name: "ست پسرانه", href: category(REAL_CATEGORIES.set) },
      { name: "لباس استخر", href: category(UNSTOCKED_CATEGORIES.swimwear) },
    ],
    shoesAccessories: [
      { name: "کفش پسرانه", href: category(UNSTOCKED_CATEGORIES.sneakers) },
      { name: "پاپوش", href: category(UNSTOCKED_CATEGORIES.booties) },
      { name: "کلاه و شال", href: category(UNSTOCKED_CATEGORIES.hat) },
      { name: "جوراب", href: category(UNSTOCKED_CATEGORIES.socks) },
      { name: "کیف و کوله", href: category(UNSTOCKED_CATEGORIES.bag) },
    ],
    collections: [
      { name: "جدیدترین‌ها", href: collections.newest },
      { name: "پرفروش‌ترین‌ها", href: collections.bestSelling },
      { name: "پوشاک ارگانیک", href: collections.organic },
      { name: "کالکشن پاییز", href: collections.autumn },
    ],
    banner: {
      image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=600&auto=format&fit=crop",
      title: "کالکشن پسرانه",
      subtitle: "انرژی و شادابی برای پسران",
      href: age("boy"),
    },
  },
  "pre-teen": {
    clothing: [
      { name: "تی‌شرت نوجوان", href: category(REAL_CATEGORIES.tshirt) },
      { name: "پولوشرت", href: category(REAL_CATEGORIES.tshirt) },
      { name: "شلوار نوجوان", href: category(REAL_CATEGORIES.pants) },
      { name: "پیراهن نوجوان", href: category(REAL_CATEGORIES.tshirt) },
      { name: "لباس ورزشی", href: category(UNSTOCKED_CATEGORIES.sportswear) },
    ],
    shoesAccessories: [
      { name: "کفش نوجوان", href: category(UNSTOCKED_CATEGORIES.sneakers) },
      { name: "پاپوش", href: category(UNSTOCKED_CATEGORIES.booties) },
      { name: "کلاه و شال", href: category(UNSTOCKED_CATEGORIES.hat) },
      { name: "جوراب", href: category(UNSTOCKED_CATEGORIES.socks) },
      { name: "اکسسوری", href: category(UNSTOCKED_CATEGORIES.accessory) },
    ],
    collections: [
      { name: "جدیدترین‌ها", href: collections.newest },
      { name: "پرفروش‌ترین‌ها", href: collections.bestSelling },
      { name: "پوشاک ارگانیک", href: collections.organic },
      { name: "کالکشن زمستان", href: collections.winter },
    ],
    banner: {
      image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=600&auto=format&fit=crop",
      title: "کالکشن نوجوان",
      subtitle: "استایل خاص برای نوجوانان",
      href: age("pre-teen"),
    },
  },
};
