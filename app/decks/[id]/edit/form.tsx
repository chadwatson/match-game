"use client";

import { use, useRef, useState, useTransition } from "react";
import { upload } from "@vercel/blob/client";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { always } from "@/app/lib/function";
import Button, { createButtonClassName } from "@/app/components/button";
import { Button as HeadlessButton } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/solid";
import { DeckRecord, UserRecord } from "@/app/lib/types";
import { deleteDeckImage, updateDeck } from "@/app/actions";
import * as map from "@/app/lib/map";
import * as array from "@/app/lib/array";
import Form from "next/form";
import AddImageDialog from "./add-image-dialog";
import Link from "next/link";
import { PutBlobResult } from "@vercel/blob";

const MIN_FILES_COUNT = always(18);

function CustomDeckImage(props: {
  deck: DeckRecord;
  src: File | string;
  index: number;
  canRemove: boolean;
  onRemove: (index: number) => void;
}) {
  const [isDeleting, startDeleting] = useTransition();
  const [src] = useState(() =>
    typeof props.src === "string" ? props.src : URL.createObjectURL(props.src)
  );

  return (
    <div className="relative w-full col-span-1 p-2">
      <div className="relative w-full h-28 bg-gray-400 bg-cover bg-center rounded-lg overflow-hidden">
        <img
          alt={src}
          title={src}
          src={src}
          className="w-full h-full object-cover object-center"
          onLoad={() => {
            URL.revokeObjectURL(src);
          }}
        />
      </div>
      {props.canRemove && (
        <button
          type="button"
          className="absolute top-0 right-0 w-6 h-6 flex items-center justify-center rounded-full bg-red-800 text-white shadow-lg shadow-red-700/50 active:shadow-md ring-1 cursor-pointer ring-red-700 ring-inset hover:ring-red-600 active:bg-red-700"
          disabled={isDeleting}
          onClick={() => {
            props.onRemove(props.index);

            const formData = new FormData();
            formData.append("deck-id", props.deck.id.toString());
            formData.append("image-url", props.src);
            startDeleting(async () => {
              await deleteDeckImage(formData);
            });
          }}
        >
          <MinusIcon className="size-4" />
        </button>
      )}
    </div>
  );
}

function CustomDeckInfoForm({ deck }: { deck: DeckRecord }) {
  const form = useRef<HTMLFormElement>(null);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  return (
    <Form
      ref={form}
      action={updateDeck}
      onChange={() => {
        if (timeout.current) {
          clearTimeout(timeout.current);
        }

        timeout.current = setTimeout(() => {
          if (form.current) {
            form.current.requestSubmit();
          }
        }, 1000);
      }}
      onBlur={() => {
        if (timeout.current) {
          clearTimeout(timeout.current);
        }

        if (form.current) {
          form.current.requestSubmit();
        }
      }}
    >
      <input type="hidden" name="deck-id" value={deck.id} />
      <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <div className="mb-2">
            <label
              htmlFor="name"
              className="text-sm/6 font-medium text-black dark:text-white"
            >
              Name
            </label>
          </div>
          <div className="mt-2">
            <input
              type="text"
              id="name"
              name="name"
              className="block w-full rounded-md bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-700 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              defaultValue={deck.name ?? ""}
            />
          </div>
        </div>
        <div className="sm:col-span-full">
          <div className="mb-2">
            <label
              htmlFor="description"
              className="text-sm/6 font-medium text-black dark:text-white"
            >
              Description{" "}
              <small className="text-gray-700 dark:text-gray-300">
                (Optional)
              </small>
            </label>
          </div>
          <div className="mt-2">
            <input
              type="text"
              id="description"
              name="description"
              className="block w-full rounded-md bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-700 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              defaultValue={deck.description ?? ""}
            />
          </div>
        </div>
        <div />
      </div>
    </Form>
  );
}

function CustomDeckImages({
  images,
  deck,
  dragOver,
  onRemove,
  editing,
}: {
  images: string[];
  deck: DeckRecord;
  dragOver: boolean;
  editing: boolean;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-4 -mx-2 sm:grid-cols-6">
      {images.map((url, index) => (
        <CustomDeckImage
          key={url}
          src={url}
          deck={deck}
          index={index}
          canRemove={editing}
          onRemove={onRemove}
        />
      ))}
      {dragOver && (
        <div className="w-full col-span-1 p-2 ">
          <div className="flex items-center justify-center w-full h-28 rounded-lg border border-dashed">
            <PlusIcon className="size-8" />
          </div>
        </div>
      )}
    </div>
  );
}

function CustomDeckForm({
  deck,
  user,
}: {
  deck: DeckRecord;
  user: UserRecord;
}) {
  const [addingImage, setAddingImage] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [editingImages, setEditingImages] = useState(false);
  const [pendingUploads, setPendingUploads] = useState<Map<File, number>>(
    () => new Map()
  );
  const [images, setImages] = useState(() => deck.image_urls ?? []);

  async function uploadFiles(files: FileList | File[]) {
    const promises = [] as Promise<PutBlobResult>[];
    for (const file of files) {
      setPendingUploads(map.set<File, number>(file)(0));
      promises.push(
        upload(`${user.id}/${file.name}`, file, {
          access: "public",
          clientPayload: `${deck.id}`,
          handleUploadUrl: `/api/decks/upload?path=/decks/${deck.id}/edit`,
          multipart: true,
          onUploadProgress: ({ percentage }) => {
            setPendingUploads(map.set<File, number>(file)(percentage));
          },
        })
      );
    }

    const results = await Promise.all(promises);
    setImages(array.concat(results.map(({ url }) => url)));
    setAddingImage(false);
    setPendingUploads(new Map());
  }

  return (
    <>
      <div
        className="w-full max-w-3xl min-h-screen px-4 py-6 mx-auto"
        onDrop={async (event) => {
          event.preventDefault();
          setDragOver(false);
          if (event.dataTransfer.files) {
            setAddingImage(true);
            await uploadFiles(
              [...event.dataTransfer.items]
                .map((item) => item.getAsFile())
                .filter((file) => !!file)
            );
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragOver(false);
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="min-w-0 flex-1 flex items-center">
              <h1 className="text-2xl/7 font-bold text-gray-900 mr-4 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
                Make your own deck
              </h1>
            </div>
            <Link
              href={`/decks/${deck.id}`}
              prefetch
              className={createButtonClassName({ theme: "primary" })}
            >
              <Button.Icon Component={CheckIcon} />
              Let&apos;s play!
            </Link>
          </div>
          <CustomDeckInfoForm deck={deck} />
        </div>
        <div className="sm:col-span-full">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center">
              <div className="inline-block mr-3 text-sm/6 font-medium text-black dark:text-white">
                Images{" "}
                <span className="text-gray-700 dark:text-gray-300">
                  ({images.length} / {MIN_FILES_COUNT()})
                </span>
              </div>
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-white shadow-lg shadow-gray-700/50 active:shadow-md ring-1 cursor-pointer ring-gray-700 ring-inset hover:ring-gray-600 active:bg-gray-700"
                onClick={() => {
                  setAddingImage(true);
                }}
              >
                <PlusIcon className="size-5" />
              </button>
            </div>
            <HeadlessButton
              className="cursor-pointer text-sm opacity-80 data-[hover]:opacity-90 data-[active]:opacity-100"
              onClick={() => {
                setEditingImages(!editingImages);
              }}
            >
              {editingImages ? "Done" : "Edit"}
            </HeadlessButton>
          </div>
          <CustomDeckImages
            images={images}
            deck={deck}
            dragOver={dragOver}
            editing={editingImages}
            onRemove={(index) => {
              setImages((currentState) => {
                const nextState = [...currentState];
                nextState.splice(index, 1);
                return nextState;
              });
            }}
          />
        </div>
      </div>
      <AddImageDialog
        pendingUploads={pendingUploads}
        uploadFiles={uploadFiles}
        deck={deck}
        isOpen={addingImage}
        onImagesAdded={(urls) => {
          setImages(array.concat(urls));
          setAddingImage(false);
        }}
        onClose={() => {
          setAddingImage(false);
        }}
      />
    </>
  );
}

export default function CustomDeckFormRoot(props: {
  deck: Promise<DeckRecord | undefined>;
  user: UserRecord;
}) {
  const deck = use(props.deck);
  return deck ? <CustomDeckForm deck={deck} user={props.user} /> : null;
}
