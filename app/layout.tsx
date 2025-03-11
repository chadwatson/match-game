import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import MakeCustomDeckButton from "./components/make-custom-deck-button";
import Link from "next/link";

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
          <header className="flex justify-between items-center p-4 h-16">
            <h1 className="font-bold text-lg">
              <Link href="/">Match & Match</Link>
            </h1>
            <div className="flex justify-end items-center gap-4">
              <MakeCustomDeckButton />
              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
