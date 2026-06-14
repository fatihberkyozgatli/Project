import type { ListingStatus, TransactionStatus } from "@/types";

type BadgeVariant =
  | "charity"
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "error"
  | "coral";

export const listingStatus: Record<
  ListingStatus,
  { label: string; variant: BadgeVariant }
> = {
  active: { label: "Active", variant: "brand" },
  interested: { label: "Interested buyer", variant: "coral" },
  reserved: { label: "Reserved", variant: "warning" },
  pending_meetup: { label: "Pending meetup", variant: "warning" },
  completed: { label: "Donated", variant: "success" },
  cancelled: { label: "Cancelled", variant: "neutral" },
};

export const transactionStatus: Record<
  TransactionStatus,
  { label: string; variant: BadgeVariant }
> = {
  payment_held: { label: "Payment held", variant: "brand" },
  buyer_confirmed: { label: "Buyer confirmed", variant: "warning" },
  seller_confirmed: { label: "Seller confirmed", variant: "warning" },
  completed: { label: "Donation completed", variant: "success" },
  cancelled: { label: "Cancelled — refunded", variant: "neutral" },
  disputed: { label: "Disputed", variant: "error" },
};
