import { PhotoIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import { upload } from "@vercel/blob/client";
import { PutBlobResult } from "@vercel/blob";
import { DeckRecord, UserRecord } from "@/app/lib/types";

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

  return (
    <form
      ref={form}
      onSubmit={async (event) => {
        event.preventDefault();

        if (imageUploadInput.current) {
          const files = imageUploadInput.current.files ?? [];
          const promises = [] as Promise<PutBlobResult>[];
          for (const file of files) {
            promises.push(
              upload(`${user.id}/${file.name}`, file, {
                access: "public",
                clientPayload: `${deck.id}`,
                handleUploadUrl: `/api/decks/upload?path=/decks/${deck.id}/edit`,
                multipart: true,
              })
            );
          }

          const results = await Promise.all(promises);
          onComplete(results);
        }
      }}
    >
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
