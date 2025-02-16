"use client";

import { ChangeEventHandler, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { always } from "../lib/function";

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
      className="flex items-center justify-center w-full h-full rounded-lg border-1 border-dashed cursor-pointer px-4 py-8 opacity-80 hover:opacity-100 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden"
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
          <span className="relative font-semibold text-indigo-400 hover:text-indigo-500">
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
  );
}
