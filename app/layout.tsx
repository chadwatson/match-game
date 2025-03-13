import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import MakeCustomDeckButton from "./components/make-custom-deck-button";
import Link from "next/link";
import Button from "./components/button";
import Image from "next/image";
import logo from "./logo.png";

export const metadata: Metadata = {
  title: "Match & Match",
  description: "A matching game!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          <header className="flex justify-between items-center px-4 py-2 h-16">
            <Link href="/" title="Match & Match">
              <Image src={logo} alt="Match & Match" className="size-14" />
            </Link>
            <div className="flex justify-end items-center gap-2">
              <MakeCustomDeckButton />
              <SignedOut>
                <SignInButton>
                  <Button>Sign In</Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          <main>{children}</main>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
