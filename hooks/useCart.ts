"use client";

import {
  addToCart,
  decrementFromCart,
  getCartProducts,
} from "@/actions/cart-actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type AddMutation = {
  productId: string;
  variantId: string;
  quantity: number;
};

export type DecrementMutation = {
  cartItemId: string;
  quantity: number;
};

export const useGetCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCartProducts,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, variantId, quantity }: AddMutation) =>
      addToCart(productId, variantId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useDecrementFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartItemId, quantity }: DecrementMutation) =>
      decrementFromCart(cartItemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
