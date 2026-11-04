import Home from "@/components/Home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "hunttoget.com - Home",
  description: "HuntToGet.com - Discover the best deals, products, and exclusive offers all in one place. Shop smart and find everything you need at unbeatable prices!",
  keywords: [
    "HuntToGet",
    "best deals",
    "online shopping",
    "exclusive offers",
    "discount products",
    "buy online",
    "top deals",
    "shopping site",
    "unbeatable prices"
  ],
  authors: [{ name: "HuntToGet" }],
  openGraph: {
    title: "hunttoget.com - Home",
    description: "HuntToGet.com - Discover the best deals, products, and exclusive offers all in one place. Shop smart and find everything you need at unbeatable prices!",
    url: "https://hunttoget.com",
    siteName: "HuntToGet",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "hunttoget.com - Home",
    description: "HuntToGet.com - Discover the best deals, products, and exclusive offers all in one place. Shop smart and find everything you need at unbeatable prices!",
  },
};

export default function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}
