"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import {
  CloudArrowUpIcon,
  ExclamationCircleIcon,
  LinkIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import UploadImageField from "./upload-image-field";
import Button from "@/app/components/button";
import { useState, useTransition } from "react";
import { DeckRecord, UserRecord } from "@/app/lib/types";
import { addDeckImageUrl } from "@/app/actions";

function UrlTab(props: { deck: DeckRecord; onComplete: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [url, setUrl] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  async function submitAction(formData: FormData) {
    startTransition(async () => {
      const { error } = await addDeckImageUrl(formData);
      if (!error) {
        props.onComplete();
      }
    });
  }

  return (
    <form className="h-52 px-4" action={submitAction}>
      <input type="hidden" name="deck-id" value={props.deck.id} />
      <div className="col-span-full">
        <div className="mb-2">
          <label
            htmlFor="url"
            className="text-sm/6 font-medium text-black dark:text-white"
          >
            Image URL
          </label>
        </div>
        <div className="mt-2 mb-2">
          <input
            autoFocus
            type="text"
            id="url-field"
            name="image-url"
            placeholder="https://"
            value={url}
            onChange={(event) => {
              setImageLoaded(false);
              setImageError(false);
              setUrl(event.target.value);
            }}
            className="block w-full rounded-md bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-700 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        </div>
      </div>
      <div className="flex justify-between mt-4">
        {imageError ? (
          <div className="flex flex-col justify-center items-center w-28 h-32 rounded border border-dashed border-gray-300 dark:border-gray-700 text-sm font-medium">
            <ExclamationCircleIcon className="size-8" />
            Invalid URL
          </div>
        ) : url ? (
          <img
            key={url}
            alt={url}
            src={url}
            className="max-h-32"
            onError={() => {
              setImageError(true);
              setImageLoaded(false);
            }}
            onLoad={() => {
              setImageError(false);
              setImageLoaded(true);
            }}
          />
        ) : (
          <div />
        )}
        <div>
          <Button
            type="submit"
            theme="primary"
            className="w-20"
            disabled={isPending || !imageLoaded}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function MediaLibrary() {
  return <div className="h-52 px-4">Coming soon</div>;
}

export default function AddImageDialog({
  user,
  deck,
  isOpen,
  onClose,
}: {
  user: UserRecord;
  deck: DeckRecord;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-gray-900/90">
        <DialogPanel className="max-w-xl w-full border border-gray-800 bg-gray-900 rounded-lg shadow-2xl">
          <div className="w-full px-6 py-3 border-b border-gray-800 flex justify-between items-center">
            <DialogTitle className="font-bold">Add Image</DialogTitle>
            <button
              title="Dismiss"
              className="text-gray-300 hover:text-gray-500 dark:text-gray-700 dark:hover:text-gray-300 dark:active:text-gray-100 cursor-pointer"
              onClick={onClose}
            >
              <XMarkIcon className="size-7" />
            </button>
          </div>
          <div className="w-full">
            <TabGroup>
              <TabList className="flex mb-4 border-b border-gray-800">
                {[
                  <>
                    <CloudArrowUpIcon className="size-5 mr-2" />
                    Upload
                  </>,
                  <>
                    <LinkIcon className="size-5 mr-2" />
                    URL
                  </>,
                  <>
                    <PhotoIcon className="size-5 mr-2" />
                    Media Library
                  </>,
                ].map((option, index) => (
                  <Tab
                    key={index}
                    className="flex items-center justify-center cursor-pointer py-3 px-6 text-sm/6 font-semibold text-white focus:outline-none border-b-2 border-transparent data-[selected]:border-violet-500 data-[hover]:bg-white/5 data-[focus]:outline-1 data-[focus]:outline-white"
                  >
                    {option}
                  </Tab>
                ))}
              </TabList>
              <TabPanels className="px-6 pb-6">
                <TabPanel>
                  <UploadImageField
                    user={user}
                    deck={deck}
                    onComplete={onClose}
                  />
                </TabPanel>
                <TabPanel>
                  <UrlTab deck={deck} onComplete={onClose} />
                </TabPanel>
                <TabPanel>
                  <MediaLibrary />
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
