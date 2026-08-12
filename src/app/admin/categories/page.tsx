"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Pencil, Trash2 } from "lucide-react";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
};

interface ApiCategory {
  id: string;
  name: string;
  slug: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/categories");
      const data: ApiCategory[] = (await res.json()) as ApiCategory[];
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u0600-\u06FF-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // پیشنهادهای به‌روز شده منطبق بر مگامنو و بخش‌های جدید سایت
  const suggestedCategories = [
    { name: "تازه متولد شده", slug: "newborn" },
    { name: "نوزاد", slug: "baby" },
    { name: "کودک", slug: "kids" },
    { name: "نوجوان", slug: "preteen" },
    { name: "دخترانه", slug: "girl" },
    { name: "پسرانه", slug: "boy" },
    { name: "لوازم ضروری", slug: "essentials" },
    { name: "حراج ویژه", slug: "sale" },
  ];

  useEffect(() => {
    const load = async () => {
      await fetchCategories();
    };

    load();
    return () => {};
  }, []);

  const openAddDialog = () => {
    setEditingCategory(null);
    setFormData({ name: "", slug: "" });
    setIsDialogOpen(true);
  };

  const applySuggestion = (name: string, slug: string) => {
    setFormData({ name, slug: generateSlug(slug) });
  };

  const openEditDialog = (category: CategoryRow) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    try {
      if (editingCategory) {
        await fetch(`/api/admin/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      setFormData({ name: "", slug: "" });
      setIsDialogOpen(false);
      await fetchCategories();
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const openDeleteDialog = (id: string) => {
    setDeletingCategoryId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingCategoryId) return;

    try {
      await fetch(`/api/admin/categories/${deletingCategoryId}`, {
        method: "DELETE",
      });

      setIsDeleteDialogOpen(false);
      setDeletingCategoryId(null);
      await fetchCategories();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">دسته‌بندی‌ها</h1>
          <p className="text-sm text-neutral-600 mt-1">مدیریت دسته‌بندی‌های فروشگاه</p>
        </div>
        <Button onClick={openAddDialog} className="bg-neutral-900 text-white hover:bg-neutral-800">
          <Plus className="h-4 w-4 ml-2" />
          افزودن دسته‌بندی
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">نام</TableHead>
              <TableHead className="text-right">اسلاگ (Slug)</TableHead>
              <TableHead className="text-right">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-neutral-600 py-8">
                  در حال بارگذاری...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-neutral-600 py-8">
                  هیچ دسته‌بندی‌ای یافت نشد.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium text-neutral-900">{category.name}</TableCell>
                  <TableCell className="text-neutral-700">{category.slug}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-neutral-600 hover:text-neutral-900"
                        onClick={() => openEditDialog(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                        onClick={() => openDeleteDialog(category.id)}
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
        <DialogContent className="max-h-[75vh] my-auto flex flex-col justify-between sm:max-w-[500px]" dir="rtl">
          <DialogHeader className="p-6 pb-2 border-b shrink-0">
            <DialogTitle className="text-xl font-bold text-neutral-900">
              {editingCategory ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی جدید"}
            </DialogTitle>
            <DialogDescription className="text-neutral-600">
              اطلاعات دسته‌بندی را وارد کنید.
            </DialogDescription>
          </DialogHeader>

          <form id="category-form" onSubmit={handleSubmit}>
            <div className="max-h-[55vh] overflow-y-auto p-6 pr-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-neutral-900">نام دسته‌بندی</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="نام دسته‌بندی"
                  className="border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" className="text-sm font-medium text-neutral-900">اسلاگ (Slug)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="مثلاً: newborn یا خالی بگذارید تا خودکار ساخته شود"
                  className="border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
                />
                <div className="flex flex-wrap gap-2 pt-2">
                  {suggestedCategories.map((item) => (
                    <Button
                      key={item.slug}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => applySuggestion(item.name, item.slug)}
                    >
                      {item.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </form>

          <Button type="submit" form="category-form" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg mt-4 shrink-0 mx-6 mb-6">
            {editingCategory ? "ذخیره تغییرات" : "افزودن دسته‌بندی"}
          </Button>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-neutral-900">حذف دسته‌بندی</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-600">
              آیا از حذف این دسته‌بندی اطمینان دارید؟ این عمل قابل بازگشت نیست.
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