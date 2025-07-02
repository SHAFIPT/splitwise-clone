import type { Metadata } from "next";
import { Outfit, Ovo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers/ThemeProvider";
import { ThemeScript } from "./theme-script";
import ReduxProvider from "./providers/ReduxProvider";
import { Toaster } from "react-hot-toast";
import ReactQueryProvider from "./providers/ReactQueryProvider";

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
  description:
    "Smart and easy bill splitting for groups, trips, and roommates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <ThemeScript />
      </head>
      <body
        className={`${outfitFont.className} ${ovoFont.className} antialiased`}
        cz-shortcut-listen="true"
      >
        <ReduxProvider>
          <ReactQueryProvider>
            <ThemeProvider>
              {children}
              <Toaster
                position="bottom-right"
                toastOptions={{
                  className:
                    "bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white shadow-lg border dark:border-gray-700",
                  duration: 4000,
                  style: {
                    padding: "12px 16px",
                    borderRadius: "10px",
                  },
                }}
              />
            </ThemeProvider>
          </ReactQueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
