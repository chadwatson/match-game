"use client";
import { PlusIcon } from "@heroicons/react/24/outline";
import Button, { createButtonClassName } from "./button";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

function MakeDeckLink() {
  return (
    <Link
      href="/new-deck"
      className={createButtonClassName({ theme: "primary", glow: true })}
    >
      <Button.Icon Component={PlusIcon} />
      Make your own
    </Link>
  );
}

function MakeDeckButtonForm() {
  return (
    <>
      <SignedOut>
        <SignInButton forceRedirectUrl="/new-deck">
          <Button
            theme="primary"
            glow
            icon={<Button.Icon Component={PlusIcon} />}
          >
            Make your own
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <MakeDeckLink />
      </SignedIn>
    </>
  );
}

export default function MakeDeckButton() {
  const isCustomDeckPath = /^\/decks/.test(usePathname());

  return !isCustomDeckPath && <MakeDeckButtonForm />;
}
