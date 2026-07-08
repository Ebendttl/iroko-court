import type { Metadata } from "next";
import "./globals.css";

const inter = { variable: "font-sans" };
const fraunces = { variable: "font-serif" };

export const metadata: Metadata = {
  title: "Canopy | Iroko Court",
  description: "Unified storefront and operations management for Iroko Court Limited.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans text-brand-charcoal bg-brand-cream selection:bg-brand-forest selection:text-white">
        {children}
      </body>
    </html>
  );
}
