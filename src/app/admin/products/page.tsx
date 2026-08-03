"use client";

import { useState } from "react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

const initialProducts = [
  {
    id: "1",
    title: "ست لباس نوزاد سوزن‌دوزی",
    price: 850000,
    category: "نوزاد",
    sizes: ["سایز ۱", "سایز ۲", "سایز ۳"],
    images: ["https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop"],
  },
  {
    id: "2",
    title: "پیراهن دخترانه طرح گل",
    price: 620000,
    category: "دختر",
    sizes: ["سایز ۲", "سایز ۳", "سایز ۴"],
    images: ["https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?q=80&w=600&auto=format&fit=crop"],
  },
  {
    id: "3",
    title: "تی‌شرت پسرانه طرح ماشین",
    price: 340000,
    category: "پسر",
    sizes: ["سایز ۲", "سایز ۳", "سایز ۴"],
    images: ["https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=600&auto=format&fit=crop"],
  },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<typeof initialProducts[0] | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    sizes: "",
    images: "",
    description: "",
  });

  const openAddDialog = () => {
    setEditingProduct(null);
    setFormData({ title: "", price: "", category: "", sizes: "", images: "", description: "" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: typeof initialProducts[0]) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price.toString(),
      category: product.category,
      sizes: product.sizes.join(", "),
      images: product.images.join(", "),
      description: "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      id: editingProduct?.id || Date.now().toString(),
      title: formData.title,
      price: parseInt(formData.price),
      category: formData.category,
      sizes: formData.sizes.split(",").map((s) => s.trim()),
      images: formData.images.split(",").map((s) => s.trim()),
    };

    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? productData : p)));
    } else {
      setProducts([...products, productData]);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
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
              <TableHead className="text-right">دسته‌بندی</TableHead>
              <TableHead className="text-right">سایزها</TableHead>
              <TableHead className="text-right">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="relative w-12 h-12 rounded-md overflow-hidden bg-neutral-100">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium text-neutral-900">{product.title}</TableCell>
                <TableCell className="text-neutral-700">{product.price.toLocaleString("fa-IR")} تومان</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                    {product.category}
                  </span>
                </TableCell>
                <TableCell className="text-neutral-600">{product.sizes.join("، ")}</TableCell>
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
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Product Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-neutral-900">
              {editingProduct ? "ویرایش محصول" : "افزودن محصول جدید"}
            </DialogTitle>
            <DialogDescription className="text-neutral-600">
              اطلاعات محصول را وارد کنید.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-neutral-900">نام محصول</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="نوزاد، کودک، دختر، پسر، نوجوان"
                  className="border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sizes" className="text-sm font-medium text-neutral-900">سایزها (جدا شده با ویرگول)</Label>
              <Input
                id="sizes"
                value={formData.sizes}
                onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                placeholder="سایز ۱، سایز ۲، سایز ۳"
                className="border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="images" className="text-sm font-medium text-neutral-900">آدرس تصویر (جدا شده با ویرگول)</Label>
              <Input
                id="images"
                value={formData.images}
                onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
              />
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

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-neutral-300 text-neutral-700 hover:bg-neutral-50">
                لغو
              </Button>
              <Button type="submit" className="bg-neutral-900 text-white hover:bg-neutral-800">
                {editingProduct ? "ذخیره تغییرات" : "افزودن محصول"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
