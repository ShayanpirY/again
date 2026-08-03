"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface SizeGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const sizeChart = [
  { size: "سایز ۱", age: "۰-۶ ماه", height: "۵۶-۶۲ سانت", chest: "۴۰-۴۲ سانت" },
  { size: "سایز ۲", age: "۶-۱۲ ماه", height: "۶۲-۶۸ سانت", chest: "۴۳-۴۵ سانت" },
  { size: "سایز ۳", age: "۱-۲ سال", height: "۶۸-۷۴ سانت", chest: "۴۶-۴۸ سانت" },
  { size: "سایز ۴", age: "۲-۳ سال", height: "۷۴-۸۰ سانت", chest: "۴۹-۵۱ سانت" },
  { size: "سایز ۵", age: "۳-۴ سال", height: "۸۰-۸۶ سانت", chest: "۵۲-۵۴ سانت" },
  { size: "سایز ۶", age: "۴-۵ سال", height: "۸۶-۹۲ سانت", chest: "۵۵-۵۷ سانت" },
  { size: "سایز ۷", age: "۵-۶ سال", height: "۹۲-۹۸ سانت", chest: "۵۸-۶۰ سانت" },
  { size: "سایز ۸", age: "۶-۷ سال", height: "۹۸-۱۰۴ سانت", chest: "۶۱-۶۳ سانت" },
];

export function SizeGuideModal({ open, onOpenChange }: SizeGuideModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl font-vazirmatn" dir="rtl">
        <DialogHeader className="border-b border-neutral-200 pb-4">
          <DialogTitle className="text-xl font-bold text-neutral-900">راهنمای سایز</DialogTitle>
          <DialogDescription className="text-neutral-600">
            برای انتخاب سایز مناسب، از جدول زیر استفاده کنید.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-right py-3 px-4 font-semibold text-neutral-900">سایز</th>
                <th className="text-right py-3 px-4 font-semibold text-neutral-900">گروه سنی</th>
                <th className="text-right py-3 px-4 font-semibold text-neutral-900">قد</th>
                <th className="text-right py-3 px-4 font-semibold text-neutral-900">دور سینه</th>
              </tr>
            </thead>
            <tbody>
              {sizeChart.map((row) => (
                <tr key={row.size} className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-neutral-900">{row.size}</td>
                  <td className="py-3 px-4 text-neutral-600">{row.age}</td>
                  <td className="py-3 px-4 text-neutral-600">{row.height}</td>
                  <td className="py-3 px-4 text-neutral-600">{row.chest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-neutral-50 p-4 rounded-sm mt-4">
          <p className="text-xs text-neutral-600 leading-relaxed">
            <span className="font-semibold">نکته:</span> اندازه‌گیری‌ها تقریبی هستند و ممکن است بسته به برند و مدل محصول تا ۱-۲ سانتیمتر تفاوت داشته باشند. در صورت عدم اطمینان، سایز بزرگتر را انتخاب کنید.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
