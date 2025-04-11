import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/top-bar";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { User } from "firebase/auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flight Stats",
  description: "Track your flights",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { currentUser } = await getAuthenticatedAppForUser()

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <div className="flex flex-col justify-stretch h-screen">
          <TopBar initialUser={(currentUser?.toJSON()) as User} />
          <ScrollArea className="h-full">
            <main className="mt-16">
              {children}
            </main>
            <Toaster />
          </ScrollArea>
        </div>
      </body>
    </html>
  );
}
