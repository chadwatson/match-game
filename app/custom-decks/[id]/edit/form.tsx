"use client";

import { ChangeEventHandler, use, useState } from "react";
import { PhotoIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import * as set from "@/app/lib/set";
import { always } from "@/app/lib/function";
import Button from "@/app/components/button";
import { CheckIcon } from "@heroicons/react/24/solid";
import { CustomDeckRecord } from "@/app/lib/types";

function SelectedItem(props: { file: File; onRemove: (file: File) => void }) {
  const [src] = useState(() => URL.createObjectURL(props.file));

  return (
    <li className="block relative w-full h-full group">
      <div className="w-full h-full bg-gray-400 bg-cover bg-center rounded-lg overflow-hidden">
        <img
          alt={props.file.name}
          title={props.file.name}
          src={src}
          className="w-full h-full object-cover object-center"
          onLoad={() => {
            URL.revokeObjectURL(src);
          }}
        />
      </div>
      <button
        type="button"
        className="hidden absolute top-0 right-0 w-6 h-6 translate-x-1/2 -translate-y-1/2 group-hover:flex items-center justify-center rounded-full bg-red-800 text-white shadow-lg shadow-red-700/50 active:shadow-md ring-1 cursor-pointer ring-red-700 ring-inset hover:ring-red-600 active:bg-red-700"
        onClick={() => {
          props.onRemove(props.file);
        }}
      >
        <MinusIcon className="size-4" />
      </button>
    </li>
  );
}

function UploadInput(props: {
  onChange: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <label
      className="flex items-center justify-center w-full h-full rounded-lg border-1 border-dashed cursor-pointer px-4 py-8 opacity-80 hover:opacity-100 focus-within:ring-2 focus-within:ring-violet-600 focus-within:ring-offset-2 focus-within:outline-hidden"
      htmlFor="image-upload"
      title="Select photos"
    >
      <div className="text-center">
        <input
          type="file"
          id="image-upload"
          multiple
          className="opacity-0 w-0 h-0 overflow-hidden peer absolute"
          accept="image/png, image/jpeg, image/gif"
          onChange={props.onChange}
        />
        <PhotoIcon className="size-12 mx-auto" />
        <div className="mt-4 flex text-sm/6 text-gray-50">
          <span className="relative font-semibold text-violet-400 hover:text-violet-500">
            <span>Upload a file</span>
          </span>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs/5 text-gray-400">PNG, JPG, GIF up to 10MB</p>
      </div>
    </label>
  );
}

const validFileTypes = always(
  new Set(["image/png", "image/jpeg", "image/gif"])
);

const fileIsValidType = (file: File) => validFileTypes().has(file.type);

const MIN_FILES_COUNT = always(18);

export default function CustomDeckForm(props: {
  customDeck: Promise<CustomDeckRecord | undefined>;
}) {
  const customDeck = use(props.customDeck);
  const [files, setFiles] = useState<Set<File>>(new Set());

  async function processSelectedFiles(selectedFiles: FileList) {
    setFiles((files) => {
      const result = new Set(selectedFiles);
      for (const file of files) {
        if (fileIsValidType(file)) {
          result.add(file);
        }
      }
      return result;
    });
  }

  function handleRemoveItem(file: File) {
    setFiles(set.remove(file));
  }

  function uploadImages(formData: FormData) {}

  return (
    <form
      action={uploadImages}
      className="w-full h-screen p-6"
      onDrop={(event) => {
        event.preventDefault();
        if (event.dataTransfer.files) {
          processSelectedFiles(event.dataTransfer.files);
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
      }}
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-4 sm:flex sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1 flex items-center">
            <h1 className="text-2xl/7 font-bold text-gray-900 mr-4 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
              Make your own deck
            </h1>
          </div>
          <Button
            type="button"
            disabled={files.size < MIN_FILES_COUNT()}
            icon={<Button.Icon Component={CheckIcon} />}
          >
            Let's play!
          </Button>
        </header>
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
                defaultValue={customDeck?.name ?? ""}
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
                defaultValue={customDeck?.description ?? ""}
              />
            </div>
          </div>
          <div className="sm:col-span-full">
            <div className="mb-2 flex items-center">
              <label
                htmlFor="image-upload"
                className="inline-block mr-3 text-sm/6 font-medium text-black dark:text-white"
              >
                Images{" "}
                <span className="text-gray-700 dark:text-gray-300">
                  ({files.size} / {MIN_FILES_COUNT()})
                </span>
              </label>
              <label
                htmlFor="image-upload"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-white shadow-lg shadow-gray-700/50 active:shadow-md ring-1 cursor-pointer ring-gray-700 ring-inset hover:ring-gray-600 active:bg-gray-700"
              >
                <input
                  type="file"
                  id="image-upload"
                  name="images"
                  multiple
                  className="opacity-0 w-0 h-0 overflow-hidden peer absolute"
                  accept="image/png, image/jpeg, image/gif"
                  onChange={async (event) => {
                    const { files } = event.target;
                    if (files) {
                      processSelectedFiles(files);
                    }
                  }}
                />
                <PlusIcon className="size-5" />
              </label>
            </div>
          </div>
        </div>
        {files.size > 0 ? (
          <ul className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-8 lg:grid-rows-8 gap-4 lg:gap-6">
            {[...files].map((file, index) => (
              <SelectedItem
                key={file.name}
                file={file}
                onRemove={handleRemoveItem}
              />
            ))}
          </ul>
        ) : (
          <UploadInput
            onChange={async (event) => {
              const { files } = event.target;
              if (files) {
                processSelectedFiles(files);
              }
            }}
          />
        )}
      </div>
    </form>
  );
}
