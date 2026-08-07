import { SearchX, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductEmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
  resetLabel?: string;
}

export function ProductEmptyState({
  title = "هیچ محصولی یافت نشد",
  description = "محصولی با فیلترهای انتخاب‌شده مطابقت نداشت. لطفاً فیلترها را بازنشانی کنید.",
  onReset,
  resetLabel = "بازنشانی فیلترها",
}: ProductEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
        <SearchX className="h-8 w-8 text-neutral-400" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-neutral-900">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-neutral-600">{description}</p>
      {onReset && (
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="h-4 w-4 ml-2" />
          {resetLabel}
        </Button>
      )}
    </div>
  );
}
