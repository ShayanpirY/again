"use client";

import { useState, useEffect, useRef } from "react";
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
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";

const standardSizes = [
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

type ProductRow = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  sizes?: string[];
  colors?: string[];
  image: string;
};

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

interface ApiProduct {
  id: string;
  title: string;
  price: number;
  stock: number;
  category?: ApiCategory;
  sizes?: string[];
  colors?: string[];
  images?: string[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string>("");
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const additionalImageInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
  });
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      const productsList = Array.isArray(data) ? data : (data.products || []);
      const mapped = productsList.map((p: ApiProduct) => ({
        id: p.id,
        name: p.title,
        price: p.price,
        stock: p.stock,
        category: p.category?.name || "",
        sizes: p.sizes || [],
        colors: p.colors || [],
        image: (p.images && p.images[0]) || "",
      }));
      setProducts(mapped);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data: ApiCategory[] = (await res.json()) as ApiCategory[];
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchProducts();
      await fetchCategories();
    };

    load();
    return () => {};
  }, []);

  const openAddDialog = () => {
    setEditingProduct(null);
    setSelectedSizes([]);
    setSelectedColors([]);
    setMainImagePreview("");
    setAdditionalImagePreviews([]);
    setFormData({ name: "", price: "", stock: "", category: "", description: "" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: ProductRow) => {
    setEditingProduct(product);
    setSelectedSizes(product.sizes || []);
    setSelectedColors(product.colors || []);
    setMainImagePreview(product.image || "");
    setAdditionalImagePreviews([]);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      description: "",
    });
    setIsDialogOpen(true);
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdditionalImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.name.trim()) {
      alert("نام محصول الزامی است.");
      return;
    }
    if (!formData.price || parseInt(formData.price) <= 0) {
      alert("قیمت باید بزرگ‌تر از صفر باشد.");
      return;
    }
    if (!formData.category) {
      alert("دسته‌بندی الزامی است.");
      return;
    }
    if (!mainImagePreview && !editingProduct) {
      alert("تصویر اصلی الزامی است.");
      return;
    }

    setSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      price: parseInt(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      category: formData.category,
      description: formData.description.trim(),
      images: additionalImagePreviews.length > 0 ? additionalImagePreviews : (mainImagePreview ? [mainImagePreview] : []),
      sizes: selectedSizes,
      colors: selectedColors,
    };

    try {
      let res: Response;
      if (editingProduct) {
        res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const result = await res.json();

      if (!res.ok) {
        const errorMessage = result?.error || "خطا در ثبت محصول";
        console.error("Submit failed:", res.status, result);
        alert(errorMessage);
        return;
      }

      setFormData({ name: "", price: "", stock: "", category: "", description: "" });
      setSelectedSizes([]);
      setSelectedColors([]);
      setMainImagePreview("");
      setAdditionalImagePreviews([]);
      setIsDialogOpen(false);
      await fetchProducts();
    } catch (error) {
      console.error("Submit error:", error);
      alert("خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.");
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteDialog = (id: string) => {
    setDeletingProductId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingProductId) return;

    try {
      const res = await fetch(`/api/admin/products/${deletingProductId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      setIsDeleteDialogOpen(false);
      setDeletingProductId(null);
      await fetchProducts();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">محصولات</h1>
          <p className="text-sm text-neutral-600 mt-1">مدیریت محصولات فروشگاه</p>
        </div>
        <Button onClick={openAddDialog} className="bg-neutral-900 text-white hover:bg-neutral-800">
          <Plus className="h-4 w-4 ml-2" />
          افزودن محصول جدید
        </Button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">تصویر</TableHead>
              <TableHead className="text-right">نام محصول</TableHead>
              <TableHead className="text-right">قیمت</TableHead>
              <TableHead className="text-right">موجودی</TableHead>
              <TableHead className="text-right">دسته‌بندی</TableHead>
              <TableHead className="text-right">رنگ‌ها</TableHead>
              <TableHead className="text-right">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-neutral-600 py-8">
                  در حال بارگذاری...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-neutral-600 py-8">
                  هیچ محصولی یافت نشد.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-neutral-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-neutral-900">{product.name}</TableCell>
                  <TableCell className="text-neutral-700">{product.price.toLocaleString("fa-IR")} تومان</TableCell>
                  <TableCell className="text-neutral-700">{product.stock.toLocaleString("fa-IR")}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                      {product.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(product.colors || []).map((color) => (
                        <span
                          key={color}
                          className="w-5 h-5 rounded-full border border-neutral-200"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-neutral-600 hover:text-neutral-900"
                        onClick={() => openEditDialog(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                        onClick={() => openDeleteDialog(product.id)}
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

      {/* Add/Edit Product Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[75vh] my-auto flex flex-col justify-between sm:max-w-[600px]" dir="rtl">
          <DialogHeader className="p-6 pb-2 border-b shrink-0">
            <DialogTitle className="text-xl font-bold text-neutral-900">
              {editingProduct ? "ویرایش محصول" : "افزودن محصول جدید"}
            </DialogTitle>
            <DialogDescription className="text-neutral-600">
              اطلاعات محصول را وارد کنید.
            </DialogDescription>
          </DialogHeader>

          <form id="product-form" onSubmit={handleSubmit}>
            <div className="max-h-[55vh] overflow-y-auto p-6 pr-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-neutral-900">نام محصول</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="نام محصول را وارد کنید"
                  className="border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium text-neutral-900">قیمت (تومان)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="۰"
                    className="border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium text-neutral-900">دسته‌بندی</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 px-3 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                    required
                  >
                    <option value="">انتخاب کنید</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-sm font-medium text-neutral-900">موجودی</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="۰"
                    className="border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-neutral-900">رنگ‌ها</Label>
                <div className="flex flex-wrap gap-2">
                  {["#FFB6C1", "#E6E6FA", "#FFFFFF", "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFA500"].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setSelectedColors((prev) =>
                          prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
                        );
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        selectedColors.includes(color)
                          ? "border-neutral-900 scale-110"
                          : "border-neutral-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-neutral-900">سایزها</Label>
                <div className="flex flex-wrap gap-2">
                  {standardSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-1.5 text-xs font-medium border rounded-md transition-colors ${
                        selectedSizes.includes(size)
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-300 text-neutral-700 hover:border-neutral-900 hover:text-neutral-900"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="main-image" className="text-sm font-medium text-neutral-900">تصویر اصلی</Label>
                <div
                  onClick={() => mainImageInputRef.current?.click()}
                  className="border-2 border-dashed border-neutral-300 rounded-lg p-4 text-center cursor-pointer hover:border-neutral-400 transition-colors"
                >
                  {mainImagePreview ? (
                    <div className="relative w-full max-h-40 rounded-md overflow-hidden">
                      <img src={mainImagePreview} alt="Preview" className="w-full max-h-40 object-contain" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 text-neutral-400 mx-auto" />
                      <p className="text-sm text-neutral-600">برای آپلود تصویر کلیک کنید</p>
                    </div>
                  )}
                  <input
                    ref={mainImageInputRef}
                    id="main-image"
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    className="hidden"
                    required={!editingProduct}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional-images" className="text-sm font-medium text-neutral-900">تصاویر اضافی</Label>
                <div
                  onClick={() => additionalImageInputRef.current?.click()}
                  className="border-2 border-dashed border-neutral-300 rounded-lg p-4 text-center cursor-pointer hover:border-neutral-400 transition-colors"
                >
                  {additionalImagePreviews.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2">
                      {additionalImagePreviews.map((img, index) => (
                        <div key={index} className="relative w-full aspect-square rounded-md overflow-hidden">
                          <img src={img} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeAdditionalImage(index);
                            }}
                            className="absolute top-1 left-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 text-neutral-400 mx-auto" />
                      <p className="text-sm text-neutral-600">برای آپلود تصاویر اضافی کلیک کنید</p>
                    </div>
                  )}
                  <input
                    ref={additionalImageInputRef}
                    id="additional-images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-neutral-900">توضیحات</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="توضیحات محصول..."
                  className="w-full min-h-[100px] px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 resize-none"
                />
              </div>
            </div>
          </form>

          <Button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit()}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg mt-4 shrink-0 mx-6 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "در حال ثبت..." : editingProduct ? "ذخیره تغییرات" : "ثبت محصول"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-neutral-900">حذف محصول</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-600">
              آیا از حذف این محصول اطمینان دارید؟ این عمل قابل بازگشت نیست.
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
