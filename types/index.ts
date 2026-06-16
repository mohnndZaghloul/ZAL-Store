import { UserRole } from "@/generated/prisma/enums";

export type Product_TP = {
  id: string;
  title: string;
  description: string;
  price: number;
  size: string;
  color: string;
  images: string[];
  tags: string[];
  createAt: Date;
  actions?: string;
  categories?: {
    id: string;
    name: string;
  }[];
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
  price?: string[];
  description?: string[];
  tags?: string[];
  images?: string[];
  general?: string[];
};
