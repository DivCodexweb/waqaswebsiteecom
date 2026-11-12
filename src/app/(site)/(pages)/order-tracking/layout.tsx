import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Order | GetToHunt - Real-Time Shipment Status",
  description:
    "Track your GetToHunt parcel status in real time across Pakistan. Enter your Order ID and registered phone number or email to check delivery updates.",
  keywords: [
    "GetToHunt order tracking",
    "Track parcel GetToHunt",
    "Order status Pakistan",
    "Courier tracking GetToHunt",
  ],
  openGraph: {
    title: "Track Your Order | GetToHunt",
    description:
      "Check real-time shipping and delivery updates for your GetToHunt order.",
    url: "https://gettohunt.com/order-tracking",
    siteName: "GetToHunt",
    type: "website",
  },
};

export default function OrderTrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}