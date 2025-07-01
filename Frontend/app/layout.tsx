import type { Metadata } from "next";
import { Outfit, Ovo } from "next/font/google";
import "./globals.css";

// ✅ Rename variables to avoid conflicts with function names
const outfitFont = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ovoFont = Ovo({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "SplitEase - Simplify Your Expenses",
  description: "Smart and easy bill splitting for groups, trips, and roommates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body className={`${outfitFont.className} ${ovoFont.className} antialiased`}
      cz-shortcut-listen="true"
      >
        {children}
      </body>
    </html>
  );
}
