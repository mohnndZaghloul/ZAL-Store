import { OrderStatus, PaymentMethod, UserRole } from "@/generated/prisma/enums";

export type Product_TP = {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPercent: number | null;
  images: string[];
  tags: string[];
  createAt: Date;
  UpdateAt: Date;
  createdById: string | null;
  variants?: stock_TP[];
  actions?: string;
  categories?: {
    id: string;
    name: string;
  }[];
};
export type Variant_TP = {
  id: string;
  size: string;
  color: string;
  stock: number;
  priceModifier: number;
  productId: string;
  product: Product_TP;
};
export type OrderItem_TP = {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  priceAtPurchase: number;
  variant: Variant_TP;
};
export type Orders_TP = {
  id: string;
  userId: string | null;
  customerName: string;
  customerPhone: string;
  address: string;
  city: string;
  shippingFee: number;
  paymentMethod: PaymentMethod;
  discountCodeId: string | null;
  discountAmount: number;
  amount: number;
  currency: string;
  status: OrderStatus;
  paymobOrderId: string | null;
  paymobTransactionId: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem_TP[];
};
export type FilterData_TP = {
  products: Product_TP[];
  total: number;
  totalPages: number;
};

export type stock_TP = {
  id?: string;
  size: string;
  color: string;
  stock: number;
};

export type FormInput_TP = {
  name?: string;
  label?: string;
  placeholder?: string;
  value?: string | string[];
  className?: string;
  minlength?: number;
  maxlength?: number;
  step?: string;
  type?: string;
  error?: string;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement, HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>,
  ) => void;
  textarea?: boolean;
  accept?: string;
  multiple?: boolean;
};

export type ProductFormErrors = {
  title?: string[];
  description?: string[];
  price?: string[];
  discountPercent?: string[];
  variants?: string[];
  categories?: string[];
  images?: string[];
  general?: string[];
};

export type ProductActionState = {
  errors?: ProductFormErrors;
  inputs?: Record<string, unknown>;
};

export type Category_TP = { id: string; name: string };

export type CartProduct_TP = {
  id: string;
  quantity: number;
  createdAt: Date;
  userId: string;
  productId: string;
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    rating: number;
    images: string[];
    tags: string[];
    createAt: Date;
    UpdateAt: Date;
    createdById: string | null;
  };
};

export type FavProduct_TP = {
  createdAt: Date;
  userId: string;
  productId: string;
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    rating: number;
    images: string[];
    tags: string[];
    createAt: Date;
    UpdateAt: Date;
    createdById: string | null;
  };
};

export type ProductFormActionState_TP = {
  errors: {
    title?: string[];
    price?: string[];
    description?: string[];
    tags?: string[];
    images?: string[];
    general?: string[];
  };
  inputs: {
    title: string;
    price: string;
    description: string;
    tags: string;
    images: string[];
  };
  success?: boolean;
};

export { UserRole as Role_TP };

export type User_TP = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  image?: string | null | undefined;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  role?: UserRole;
  actions?: string;
};

export type CheckoutItem_TP = {
  cartItemId?: string;
  variantId: string;
  productId: string;
  title: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  stock: number;
};
