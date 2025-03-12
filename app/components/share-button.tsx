"use client";

import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { createButtonClassName } from "./button";

export default function ShareButton({
  title,
  path,
}: {
  title: string;
  path: string;
}) {
  const url = `${globalThis.location?.origin}${path}`;
  const [copied, setCopied] = useState(false);
  return (
    <>
      <button
        type="button"
        className="relative cursor-pointer text-white/70 hover:text-white"
        onClick={(event) => {
          event.stopPropagation();
          setCopied(false);
          window.navigator.clipboard.writeText(url);
          setCopied(true);
        }}
      >
        <ArrowUpOnSquareIcon className="size-5" />
      </button>
      <Dialog
        open={copied}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={() => {
          setCopied(false);
        }}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl shadow-2xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle
                as="h3"
                className="text-base/7 font-medium text-white"
              >
                Share {title}
              </DialogTitle>
              <p className="mt-2 text-sm/6 text-white/50">URL copied!</p>
              <input
                autoFocus
                type="text"
                id="url-field"
                name="url"
                value={url}
                onFocus={(event) => {
                  event.target.select();
                }}
                onChange={() => {}}
                className="block w-full rounded-md bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-700 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              <div className="flex justify-end mt-4">
                <Button
                  className={createButtonClassName({ theme: "neutral" })}
                  onClick={() => {
                    setCopied(false);
                  }}
                >
                  Dismiss
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
