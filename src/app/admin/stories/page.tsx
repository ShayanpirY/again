"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Play, UploadCloud, FileVideo2, Image as ImageIcon } from "lucide-react";

const BADGE_OPTIONS = ["حراجی", "جدید", "پرفروش", "کالکشن", "ست تولد", "شگفت‌انگیز"];

type StoryRow = {
  id: string;
  title: string;
  mediaUrl: string;
  badge: string | null;
  productId: string;
  isActive: boolean;
  order: number;
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
    isActive: boolean;
  };
};

type ProductOption = {
  id: string;
  title: string;
  price: number;
  images: string[];
  isActive?: boolean;
};

const formDefaults = {
  title: "",
  mediaUrl: "",
  badge: "",
  productId: "",
  order: "0",
};

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<StoryRow[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<StoryRow | null>(null);
  const [deletingStoryId, setDeletingStoryId] = useState<string | null>(null);
  const [formData, setFormData] = useState(formDefaults);
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [formError, setFormError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVideoUrl = (url: string) =>
    /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url);

  const uploadFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setUploadError("فقط فایل تصویر یا ویدیو مجاز است.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setUploadError("حجم فایل نباید بیشتر از ۵۰ مگابایت باشد.");
      return;
    }

    const body = new FormData();
    body.append("file", file);

    setUploading(true);
    setUploadProgress(0);
    setUploadError("");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setUploadProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText) as { url: string };
          setFormData((prev) => ({ ...prev, mediaUrl: data.url }));
          setPreviewUrl(data.url);
          setUploadProgress(100);
        } catch (error) {
          console.error("Upload response parse error:", error);
          setUploadError("خطا در بارگذاری فایل. لطفاً دوباره تلاش کنید.");
        }
      } else {
        try {
          const data = JSON.parse(xhr.responseText) as { error?: string };
          setUploadError(data.error || "خطا در بارگذاری فایل.");
        } catch {
          setUploadError("خطا در بارگذاری فایل.");
        }
      }
      setUploading(false);
    };

    xhr.onerror = () => {
      console.error("Upload network error");
      setUploadError("خطا در بارگذاری فایل. لطفاً دوباره تلاش کنید.");
      setUploading(false);
    };

    xhr.send(body);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/stories", { cache: "no-store" });
      const raw: unknown = await res.json();
      const data: StoryRow[] = Array.isArray(raw) ? raw : [];
      setStories(data);
    } catch (error) {
      console.error("Failed to fetch stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products", { cache: "no-store" });
      const raw: unknown = await res.json();
      const data: ProductOption[] = Array.isArray(raw) ? raw : [];
      const active = data.filter((p) => p.isActive !== false);
      setProducts(active);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchStories(), fetchProducts()]);
    };
    load();
    return () => {};
  }, []);

  const openAddDialog = () => {
    setEditingStory(null);
    setFormData(formDefaults);
    setPreviewUrl("");
    setUploadError("");
    setUploadProgress(0);
    setFormError("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (story: StoryRow) => {
    setEditingStory(story);
    setFormData({
      title: story.title,
      mediaUrl: story.mediaUrl,
      badge: story.badge || "",
      productId: story.productId,
      order: String(story.order),
    });
    setPreviewUrl(story.mediaUrl);
    setUploadError("");
    setUploadProgress(0);
    setFormError("");
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setFormError("عنوان استوری الزامی است.");
      return;
    }
    if (!formData.mediaUrl.trim()) {
      setFormError("لطفاً مدیا را آپلود کنید یا لینک مدیا را وارد کنید.");
      return;
    }
    if (!formData.productId) {
      setFormError("انتخاب محصول الزامی است.");
      return;
    }

    setFormError("");

    try {
      setSubmitting(true);
      const payload = {
        title: formData.title,
        mediaUrl: formData.mediaUrl,
        badge: formData.badge || null,
        productId: formData.productId,
        order: Number(formData.order) || 0,
      };

      let res: Response;

      if (editingStory) {
        res = await fetch(`/api/admin/stories/${editingStory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/stories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        let apiError = "خطا در ذخیره استوری. لطفاً دوباره تلاش کنید.";
        try {
          const data = (await res.json()) as { error?: string };
          if (data.error) apiError = data.error;
        } catch {
          // ignore malformed response body
        }
        setFormError(apiError);
        return;
      }

      setFormData(formDefaults);
      setPreviewUrl("");
      setUploadError("");
      setFormError("");
      setIsDialogOpen(false);
      await fetchStories();
    } catch (error) {
      console.error("Submit error:", error);
      setFormError("خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (story: StoryRow) => {
    try {
      await fetch(`/api/admin/stories/${story.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !story.isActive }),
      });
      await fetchStories();
    } catch (error) {
      console.error("Toggle error:", error);
    }
  };

  const openDeleteDialog = (id: string) => {
    setDeletingStoryId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingStoryId) return;

    try {
      await fetch(`/api/admin/stories/${deletingStoryId}`, {
        method: "DELETE",
      });

      setIsDeleteDialogOpen(false);
      setDeletingStoryId(null);
      await fetchStories();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">مدیریت استوری‌ها</h1>
          <p className="text-sm text-neutral-600 mt-1">
            استوری‌های صفحه اصلی (ویدیو یا عکس عمودی) را مدیریت کنید
          </p>
        </div>
        <Button onClick={openAddDialog} className="bg-neutral-900 text-white hover:bg-neutral-800">
          <Plus className="h-4 w-4 ml-2" />
          افزودن استوری
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right w-20">پیش‌نمایش</TableHead>
              <TableHead className="text-right">عنوان استوری</TableHead>
              <TableHead className="text-right">برچسب</TableHead>
              <TableHead className="text-right">محصول مرتبط</TableHead>
              <TableHead className="text-right">وضعیت</TableHead>
              <TableHead className="text-right">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-neutral-600 py-8">
                  در حال بارگذاری...
                </TableCell>
              </TableRow>
            ) : stories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-neutral-600 py-8">
                  هیچ استوری‌ای یافت نشد.
                </TableCell>
              </TableRow>
            ) : (
              (Array.isArray(stories) ? stories : []).map((story) => (
                <TableRow key={story.id}>
                  <TableCell>
                    <div className="h-16 w-10 overflow-hidden rounded-md bg-neutral-100 ring-1 ring-neutral-200">
                      <img
                        src={story.mediaUrl}
                        alt={story.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-neutral-900">
                    <div className="flex items-center gap-2">
                      <Play className="h-3.5 w-3.5 text-neutral-400" />
                      {story.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    {story.badge ? (
                      <Badge variant="secondary" className="bg-rose-50 text-rose-600">
                        {story.badge}
                      </Badge>
                    ) : (
                      <span className="text-neutral-400 text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-neutral-700">
                    <div className="max-w-[220px]">
                      <p className="truncate text-sm">{story.product.title}</p>
                      <p className="text-xs text-neutral-500">
                        {story.product.price.toLocaleString("fa-IR")} تومان
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => toggleActive(story)}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                        story.isActive
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                      }`}
                      aria-label={story.isActive ? "غیرفعال کردن استوری" : "فعال کردن استوری"}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          story.isActive ? "bg-emerald-500" : "bg-neutral-400"
                        }`}
                      />
                      {story.isActive ? "فعال" : "غیرفعال"}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-neutral-600 hover:text-neutral-900"
                        onClick={() => openEditDialog(story)}
                        aria-label="ویرایش استوری"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                        onClick={() => openDeleteDialog(story.id)}
                        aria-label="حذف استوری"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[80vh] my-auto flex flex-col justify-between sm:max-w-[520px]" dir="rtl">
          <DialogHeader className="p-6 pb-2 border-b shrink-0">
            <DialogTitle className="text-xl font-bold text-neutral-900">
              {editingStory ? "ویرایش استوری" : "افزودن استوری جدید"}
            </DialogTitle>
            <DialogDescription className="text-neutral-600">
              اطلاعات استوری را وارد کنید. مدیا باید عمودی (نسبت ۹:۱۶) باشد.
            </DialogDescription>
          </DialogHeader>

          <form id="story-form" onSubmit={handleSubmit}>
            {formError && (
              <div className="mx-6 mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-700">
                {formError}
              </div>
            )}
            <div className="max-h-[55vh] overflow-y-auto p-6 pr-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-neutral-900">
                  عنوان استوری
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثلاً: حراجی تابستانه"
                  className="border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mediaUrl" className="text-sm font-medium text-neutral-900">
                  لینک مدیا (ویدیو یا عکس عمودی)
                </Label>

                {/* Drop zone + file input */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors ${
                    isDragOver
                      ? "border-blue-500 bg-blue-50"
                      : "border-neutral-300 bg-neutral-50 hover:border-neutral-400 hover:bg-neutral-100"
                  }`}
                >
                  {uploading ? (
                    <>
                      <UploadCloud className="h-8 w-8 text-blue-600 animate-bounce" />
                      <p className="text-sm font-medium text-neutral-700">در حال بارگذاری...</p>
                      <div className="w-full max-w-[220px] h-2 rounded-full bg-neutral-200 overflow-hidden">
                        <div
                          className="h-full bg-blue-600 transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-neutral-500">{uploadProgress}٪</p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-8 w-8 text-neutral-400" />
                      <p className="text-sm font-medium text-neutral-700">
                        فایل را اینجا رها کنید یا کلیک کنید
                      </p>
                      <p className="text-xs text-neutral-500">
                        ویدیو (mp4, webm) یا تصویر عمودی (jpg, png) — حداکثر ۵۰ مگابایت
                      </p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*,image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {uploadError && (
                  <p className="text-xs font-medium text-red-600">{uploadError}</p>
                )}

                <Input
                  id="mediaUrl"
                  value={formData.mediaUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, mediaUrl: e.target.value });
                    setPreviewUrl(e.target.value.trim());
                  }}
                  dir="ltr"
                  placeholder="https://example.com/story.mp4 یا https://example.com/image.jpg"
                  className="border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900 text-left"
                  required
                />

                {/* Preview */}
                {previewUrl && (
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex h-40 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-neutral-200">
                      {isVideoUrl(previewUrl) ? (
                        <video
                          src={previewUrl}
                          controls
                          playsInline
                          className="h-full w-full object-cover"
                        >
                          <source src={previewUrl} />
                        </video>
                      ) : (
                        <img
                          src={previewUrl}
                          alt="پیش‌نمایش استوری"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                          }}
                          onLoad={(e) => {
                            (e.currentTarget as HTMLImageElement).style.visibility = "visible";
                          }}
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {isVideoUrl(previewUrl) ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600">
                          <FileVideo2 className="h-4 w-4 text-blue-600" />
                          ویدیو عمودی
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600">
                          <ImageIcon className="h-4 w-4 text-blue-600" />
                          تصویر عمودی
                        </span>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <UploadCloud className="h-3.5 w-3.5 ml-1.5" />
                        تعویض مدیا
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="productId" className="text-sm font-medium text-neutral-900">
                  محصول مرتبط
                </Label>
                <select
                  id="productId"
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full h-10 px-3 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                  required
                >
                  <option value="">انتخاب محصول...</option>
                  {(Array.isArray(products) ? products : []).map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.title} — {product.price.toLocaleString("fa-IR")} تومان
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="badge" className="text-sm font-medium text-neutral-900">
                  برچسب (اختیاری)
                </Label>
                <select
                  id="badge"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full h-10 px-3 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                >
                  <option value="">بدون برچسب</option>
                  {BADGE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order" className="text-sm font-medium text-neutral-900">
                  ترتیب نمایش
                </Label>
                <Input
                  id="order"
                  type="number"
                  min={0}
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  className="border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
                />
              </div>
            </div>
          </form>

          <Button
            type="submit"
            form="story-form"
            disabled={submitting || uploading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg mt-4 shrink-0 mx-6 mb-6 disabled:opacity-60"
          >
            {submitting
              ? "در حال ثبت..."
              : editingStory
                ? "ذخیره تغییرات"
                : "افزودن استوری"}
          </Button>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-neutral-900">حذف استوری</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-600">
              آیا از حذف این استوری اطمینان دارید؟ این عمل قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-neutral-300 text-neutral-700 hover:bg-neutral-50">
              لغو
            </AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" onClick={confirmDelete}>
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
