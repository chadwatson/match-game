"use client";
import { PlusIcon } from "@heroicons/react/24/outline";
import { createCustomDeck } from "../actions";
import Button from "./button";
import Form from "next/form";
import { usePathname } from "next/navigation";

export default function MakeCustomDeckButton() {
  const pathname = usePathname();
  const isCustomDeckPath = /^\/custom-deck/.test(pathname);

  return (
    !isCustomDeckPath && (
      <Form action={createCustomDeck}>
        <Button type="submit" icon={<Button.Icon Component={PlusIcon} />}>
          Make your own
        </Button>
      </Form>
    )
  );
}
