import Link from "next/link";
import { categoryIcons } from "@/components/category-icon";
import { CATEGORY_LABELS, type Category } from "@/types";

const order: Category[] = [
  "electronics",
  "furniture",
  "clothing",
  "books",
  "sports",
  "home",
  "music",
  "toys",
  "art",
];

export function CategoryChips() {
  return (
    <div className="-mx-4 flex gap-2.5 overflow-x-auto px-4 py-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0 [&::-webkit-scrollbar]:hidden">
      {order.map((c) => {
        const Icon = categoryIcons[c];
        return (
          <Link
            key={c}
            href="/browse"
            className="group flex shrink-0 items-center gap-2 rounded-full border border-sand-200 bg-white px-4 py-2 text-sm font-semibold text-sand-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand hover:text-brand hover:shadow-md"
          >
            <Icon
              className="h-4 w-4 text-sand-400 transition-colors group-hover:text-brand"
              aria-hidden="true"
            />
            {CATEGORY_LABELS[c]}
          </Link>
        );
      })}
    </div>
  );
}
