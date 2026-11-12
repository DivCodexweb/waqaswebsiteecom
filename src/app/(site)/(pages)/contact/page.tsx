import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | GetToHunt - Customer Support & Inquiries",
  description: "Have a question about your order, sizing, or delivery? Contact GetToHunt customer support team via email, WhatsApp, or our contact form.",
  keywords: ["Contact GetToHunt", "GetToHunt customer support", "GetToHunt Pakistan contact"],
  openGraph: {
    title: "Contact Us | GetToHunt",
    description: "Get in touch with GetToHunt customer support for order assistance, exchanges, and general inquiries.",
    url: "https://gettohunt.com/contact",
    siteName: "GetToHunt",
    type: "website",
  },
};

const ContactPage = () => {
  return (
    <main>
      <Contact />
    </main>
  );
};

export default ContactPage;
