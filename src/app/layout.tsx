import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beige Sales Rep Training",
  description:
    "Beige Sales Rep Onboarding: interactive training, scenario practice, and certification for new Beige sales reps.",
  icons: {
    icon: "/beige-icon.png",
    apple: "/beige-icon.png",
    shortcut: "/beige-icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-canvas-black text-foreground">
        {children}
      </body>
    </html>
  );
}
