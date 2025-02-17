"use client";

import { ChangeEventHandler, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { always } from "../lib/function";
import Button from "../components/button";
import { CheckIcon } from "@heroicons/react/24/solid";

function SelectedItem(props: { file: File }) {
  const [src] = useState(() => URL.createObjectURL(props.file));

  return (
    <li className="block w-full h-full bg-gray-400 bg-cover bg-center rounded-lg overflow-hidden">
      <img
        alt={props.file.name}
        title={props.file.name}
        src={src}
        className="w-full h-full object-cover object-center"
        onLoad={() => {
          URL.revokeObjectURL(src);
        }}
      />
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

type SelectedItemsState = Set<File>;

export default function CustomGamePage() {
  const [selectedItems, setSelectedItems] = useState<SelectedItemsState>(
    new Set()
  );

  async function processSelectedFiles(files: FileList) {
    setSelectedItems((selectedItems) => {
      const result = new Set(selectedItems);
      for (const file of files) {
        if (fileIsValidType(file)) {
          result.add(file);
        }
      }
      return result;
    });
  }

  return (
    <div
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
        <header className="mb-4 lg:flex lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1 flex items-center">
            <h1 className="text-2xl/7 font-bold text-gray-900 mr-4 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
              Make your own deck
            </h1>
            <div className="bg-lime-700 text-white px-2 py-1 text-sm font-bold rounded-full">
              {selectedItems.size} / 18
            </div>
          </div>
          <div className="mt-5 flex lg:mt-0 lg:ml-4">
            <Button icon={<Button.Icon Component={CheckIcon} />}>Let's play!</Button>
          </div>
        </header>
        {selectedItems.size > 0 ? (
          <ul className="grid grid-cols-8 grid-rows-8 gap-6">
            <li className="col-span-3">
              <UploadInput
                onChange={async (event) => {
                  const { files } = event.target;
                  if (files) {
                    processSelectedFiles(files);
                  }
                }}
              />
            </li>
            {[...selectedItems].map((file, index) => (
              <SelectedItem key={`${file.name}-${index}`} file={file} />
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
    </div>
  );
}
