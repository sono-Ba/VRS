import type { Metadata, Viewport } from "next";
import { getCurrentUser } from "@/auth/session";
import { SessionProvider } from "@/components/layout/SessionProvider";
import { TopBar } from "@/components/layout/TopBar";
import { AuthPrompt } from "@/components/client/AuthPrompt";
import "./globals.css";

export const metadata: Metadata = {
  title: "VRS Residences — Immersive Real Estate",
  description:
    "Explore Abu Dhabi's residential districts, projects, and residences through a continuous immersive experience.",
};

export const viewport: Viewport = {
  themeColor: "#0b0c0e",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className="flex h-dvh flex-col overflow-hidden">
        <SessionProvider user={user} />
        <TopBar />
        {children}
        <AuthPrompt />
      </body>
    </html>
  );
}
