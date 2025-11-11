import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Deskriptr - AI Product Description Generator",
  description: "Generate compelling product descriptions using AI",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤖</text></svg>",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} font-outfit antialiased min-h-screen`}
      >
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
