import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "8n8 - Automate Everything, Your Way.",
  description: "8n8 is a powerful, open-source workflow automation platform built from the ground up. Connect apps, services, and APIs with ease - no code required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
