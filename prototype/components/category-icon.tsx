import {
  Smartphone,
  Armchair,
  Shirt,
  BookOpen,
  Blocks,
  Bike,
  Sprout,
  Car,
  Music,
  Palette,
  Package,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/types";

export const categoryIcons: Record<Category, LucideIcon> = {
  electronics: Smartphone,
  furniture: Armchair,
  clothing: Shirt,
  books: BookOpen,
  toys: Blocks,
  sports: Bike,
  home: Sprout,
  vehicles: Car,
  music: Music,
  art: Palette,
  other: Package,
};
