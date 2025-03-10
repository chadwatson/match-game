"use client";
import {
  CheckCircleIcon,
  CloudArrowUpIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { FormEvent, useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { PutBlobResult } from "@vercel/blob";
import { DeckRecord, UserRecord } from "@/app/lib/types";
import * as map from "@/app/lib/map";
import * as logic from "@/app/lib/logic";
import Progress from "@/app/components/progress";

function PendingUpload({ file, progress }: { file: File; progress: number }) {
  const [src] = useState(() => URL.createObjectURL(file));
  return (
    <div className="relative mr-4 overflow-hidden shrink-0">
      <img
        src={src}
        alt={file.name}
        className="block size-32 overflow-hidden rounded object-cover object-center"
        onLoad={() => {
          URL.revokeObjectURL(src);
        }}
      />
      <div className="absolute bottom-0 left-0 w-full flex justify-end px-3 pt-6 pb-2 rounded-b leading-1 bg-gradient-to-b from-black/0 to-black/75 text-white font-bold text-sm text-center">
        {progress < 1 ? (
          <CloudArrowUpIcon className="size-6" />
        ) : (
          <CheckCircleIcon className="size-6 text-green-500 rounded-full" />
        )}
      </div>
    </div>
  );
}

function average(xs: number[]) {
  let sum = 0;
  for (const x of xs) {
    sum += x;
  }
  return sum / xs.length;
}

function PendingUploads({
  pendingUploads,
}: {
  pendingUploads: Map<File, number>;
}) {
  const totalProgress = average([...pendingUploads.values()]);
  return (
    <div className="h-52">
      <div className="mb-4 pb-4 border-b border-gray-300 dark:border-gray-800 w-full">
        <p className="text-sm mb-2 truncate">Uploading files...</p>
        <Progress max={100} value={Math.round(totalProgress)} showPercentage />
      </div>
      <div className="w-full overflow-x-auto flex items-center">
        {[
          ...pendingUploads
            .entries()
            .map(([file, progress]) => (
              <PendingUpload key={file.name} file={file} progress={progress} />
            )),
        ]}
      </div>
    </div>
  );
}

export default function UploadImageField({
  user,
  deck,
  onComplete,
}: {
  user: UserRecord;
  deck: DeckRecord;
  onComplete: (blobResults: PutBlobResult[]) => void;
}) {
  const form = useRef<HTMLFormElement | null>(null);
  const imageUploadInput = useRef<HTMLInputElement | null>(null);
  const [pendingUploads, setPendingUploads] = useState<Map<File, number>>(
    () => new Map()
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (imageUploadInput.current) {
      const files = imageUploadInput.current.files ?? [];
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
      onComplete(results);
    }
  }

  if (pendingUploads.size) {
    return <PendingUploads pendingUploads={pendingUploads} />;
  }

  return (
    <form ref={form} onSubmit={handleSubmit}>
      <label
        className="flex items-center justify-center w-full rounded-lg border-1 border-dashed cursor-pointer p-4 h-52 opacity-80 hover:opacity-100 focus-within:ring-2 focus-within:ring-violet-600 focus-within:ring-offset-2 focus-within:outline-hidden"
        htmlFor="image-upload"
        title="Select photos"
      >
        <div className="text-center">
          <input
            ref={imageUploadInput}
            type="file"
            id="image-upload"
            name="image-upload"
            multiple
            className="opacity-0 w-0 h-0 overflow-hidden peer absolute"
            accept="image/png, image/jpeg, image/gif"
            onChange={() => {
              if (form.current) {
                form.current.requestSubmit();
              }
            }}
          />
          <PhotoIcon className="size-12 mx-auto" />
          <div className="mt-4 flex text-sm/6 text-gray-50">
            <span className="relative font-semibold text-violet-400 hover:text-violet-500">
              <span>Upload a file</span>
            </span>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs/5 text-gray-400">PNG, JPG, GIF up to 4.5MB</p>
        </div>
      </label>
    </form>
  );
}
