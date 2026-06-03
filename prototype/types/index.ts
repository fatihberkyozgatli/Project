export type Condition = "new" | "like_new" | "good" | "fair" | "poor";

export const CONDITION_LABELS: Record<Condition, string> = {
  new: "New",
  like_new: "Like New",
  good: "Good",
  fair: "Fair",
  poor: "Poor",
};

export type Category =
  | "electronics"
  | "furniture"
  | "clothing"
  | "books"
  | "toys"
  | "sports"
  | "home"
  | "vehicles"
  | "music"
  | "art"
  | "other";

export const CATEGORY_LABELS: Record<Category, string> = {
  electronics: "Electronics",
  furniture: "Furniture",
  clothing: "Clothing & Accessories",
  books: "Books & Education",
  toys: "Toys & Games",
  sports: "Sports & Outdoors",
  home: "Home & Garden",
  vehicles: "Vehicles & Parts",
  music: "Musical Instruments",
  art: "Art & Collectibles",
  other: "Other",
};

export type ListingStatus =
  | "active"
  | "interested"
  | "reserved"
  | "pending_meetup"
  | "completed"
  | "cancelled";

export type TransactionStatus =
  | "payment_held"
  | "buyer_confirmed"
  | "seller_confirmed"
  | "completed"
  | "cancelled"
  | "disputed";

export type VerificationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "suspended";

export type NonprofitCategory =
  | "education"
  | "environment"
  | "health"
  | "animals"
  | "community"
  | "arts";

export interface User {
  id: string;
  name: string;
  city: string;
  bio?: string;
  avatarColor: string;
  initials: string;
  verifiedEmail: boolean;
  verifiedPhone: boolean;
  completedTransactions: number;
  donatedCents: number;
  rating: number;
  ratingCount: number;
  joinedAt: string;
}

export interface Nonprofit {
  id: string;
  name: string;
  ein: string;
  mission: string;
  about: string;
  website: string;
  category: NonprofitCategory;
  city: string;
  state: string;
  logoColor: string;
  initials: string;
  verification: VerificationStatus;
  sponsored: boolean;
  raisedCents: number;
  supporters: number;
}

export interface Listing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  category: Category;
  imageColor: string;
  city: string;
  pickupArea: string;
  condition: Condition;
  priceCents: number;
  nonprofitId: string;
  status: ListingStatus;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string | "system";
  content: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  messages: Message[];
  lastActivity: string;
}

export interface Transaction {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  nonprofitId: string;
  amountCents: number;
  status: TransactionStatus;
  buyerCode: string;
  sellerCode: string;
  buyerConfirmed: boolean;
  sellerConfirmed: boolean;
  createdAt: string;
}

export type ReportTarget =
  | "listing"
  | "user"
  | "chat"
  | "nonprofit"
  | "transaction";

export interface Report {
  id: string;
  target: ReportTarget;
  targetLabel: string;
  reason: string;
  reporterId: string;
  status: "open" | "resolved" | "dismissed";
  createdAt: string;
}

export interface AppNotification {
  id: string;
  kind: "interest" | "payment" | "confirmation" | "cancellation" | "message";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href: string;
}
