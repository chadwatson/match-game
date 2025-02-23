"use client";
import { PlusIcon } from "@heroicons/react/24/outline";
import { createCustomDeck } from "../actions";
import Button from "./button";
import Form from "next/form";
import { usePathname } from "next/navigation";
import { useFormStatus } from "react-dom";

function MakeCustomDeckSubmitButton() {
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

function MakeCustomDeckButtonForm() {
  return (
    <Form action={createCustomDeck}>
      <MakeCustomDeckSubmitButton />
    </Form>
  );
}

export default function MakeCustomDeckButton() {
  const isCustomDeckPath = /^\/custom-deck/.test(usePathname());

  return !isCustomDeckPath && <MakeCustomDeckButtonForm />;
}
