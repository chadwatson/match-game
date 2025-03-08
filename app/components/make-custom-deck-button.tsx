"use client";
import { PlusIcon } from "@heroicons/react/24/outline";
import { createDeck } from "../actions";
import Button from "./button";
import Form from "next/form";
import { usePathname } from "next/navigation";
import { useFormStatus } from "react-dom";

function MakeDeckSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      icon={<Button.Icon Component={PlusIcon} />}
      disabled={pending}
    >
      {pending ? "Setting up..." : "Make your own"}
    </Button>
  );
}

function MakeDeckButtonForm() {
  return (
    <Form action={createDeck}>
      <MakeDeckSubmitButton />
    </Form>
  );
}

export default function MakeDeckButton() {
  const isCustomDeckPath = /^\/decks/.test(usePathname());

  return !isCustomDeckPath && <MakeDeckButtonForm />;
}
