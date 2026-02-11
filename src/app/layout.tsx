import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reve",
  description: "AI-powered design assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
