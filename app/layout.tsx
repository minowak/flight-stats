import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/top-bar";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { User } from "firebase/auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";
import { GithubIcon } from "lucide-react";

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
  title: "Sky Log",
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
            <footer className="text-sm text-muted-foreground py-8 flex items-center justify-center px-4">
              <div className="max-w-[500px]">
                <p>2025 SkyLog - by Michal Nowak</p>
                <p>Crafted with ☁️ and ❤️ for sky enthusiasts.</p>
                <div className="mt-4 flex items-center gap-2"><GithubIcon /> <a href="https://github.com/minowak/flight-stats">Repo</a> </div>
              </div>
            </footer>
          </ScrollArea>
        </div>
      </body>
    </html>
  );
}
