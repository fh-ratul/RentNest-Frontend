import { LucideIcon } from "lucide-react";

export type IRentalStatus = "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED";
export type IPaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export type IProperty = {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  status: "AVAILABLE" | "RENTED" | "INACTIVE";
  categoryId: string;
  category?: { id: string; name: string };
  landlordId: string;
  createdAt: string;
  updatedAt: string;
};

export type IPayment = {
  id: string;
  amount: string;
  provider: string;
  stripeSessionId: string | null;
  transactionId: string | null;
  status: IPaymentStatus;
  paidAt: string | null;
  createdAt: string;
  rentalRequestId: string;
  rentalRequest?: { property: IProperty };
};

export type IReview = {
  id: string;
  rating: number;
  comment: string | null;
};

export type IRentalRequest = {
  id: string;
  status: IRentalStatus;
  moveInDate: string;
  message: string | null;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  propertyId: string;
  property: IProperty;
  payment: IPayment | null;
  review: IReview | null;
};

export type IGetMeResponse = {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    name: string;
    email: string;
    role: "TENANT" | "LANDLORD" | "ADMIN";
    activeStatus: string;
    createdAt: string;
  };
};

export type NavbarProps = {
  user: IGetMeResponse;
};

export type ICategory = {
  id: string;
  name: string;
};
export type IPropertyDetail = IProperty & {
  landlord: { id: string; name: string; email: string };
  category: ICategory;
  reviews: { id: string; rating: number; comment: string | null; tenant: { id: string; name: string } }[];
};
export type ISidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type ILandlordRentalRequest = IRentalRequest & {
  tenant: { id: string; name: string; email: string };
};

export type IAdminUser = {
  id: string;
  name: string;
  email: string;
  role: "TENANT" | "LANDLORD" | "ADMIN";
  activeStatus: "ACTIVE" | "BLOCKED";
  createdAt: string;
};

export type IAdminProperty = IProperty & {
  landlord: { id: string; name: string; email: string };
};

export type IAdminRentalRequest = {
  id: string;
  status: IRentalStatus;
  moveInDate: string;
  createdAt: string;
  property: { id: string; title: string; city: string };
  tenant: { id: string; name: string; email: string };
  payment: IPayment | null;
};
