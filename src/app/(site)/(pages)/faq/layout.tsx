import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQs) | GetToHunt",
  description: "Find answers to common questions about ordering, Cash on Delivery (COD), nationwide shipping, sizing, and 7-day exchanges at GetToHunt Pakistan.",
  keywords: ["GetToHunt FAQ", "GetToHunt delivery time", "GetToHunt exchange policy", "Online shopping FAQ Pakistan"],
  openGraph: {
    title: "FAQs | GetToHunt",
    description: "Find answers to common questions about ordering, shipping, and exchanges at GetToHunt.",
    url: "https://gettohunt.com/faq",
    siteName: "GetToHunt",
    type: "website",
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}