import React from "react";
import Cart from "@/components/Cart";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart | GetToHunt - Review Your Items",
  description: "Review your selected footwear items, manage quantities, and proceed to secure checkout on GetToHunt.",
  keywords: ["GetToHunt cart", "Shopping cart Pakistan", "Online footwear checkout"],
  openGraph: {
    title: "Shopping Cart | GetToHunt",
    description: "Review your selected items and proceed to secure checkout.",
    url: "https://gettohunt.com/cart",
    siteName: "GetToHunt",
    type: "website",
  },
};

const CartPage = () => {
  return (
    <>
      <Cart />
    </>
  );
};

export default CartPage;
