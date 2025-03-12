"use client";

import { PhotoIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function GameOptionCardThumbnail({
  src,
  title,
}: {
  src?: string | null | undefined;
  title: string;
}) {
  const [error, setError] = useState(false);
  return !src || error ? (
    <div className="flex items-center justify-center w-full aspect-3/2 bg-gray-400 dark:bg-gray-600">
      <PhotoIcon className="size-8 text-gray-100" />
    </div>
  ) : (
    <img
      src={src ?? ""}
      alt={title}
      className="block object-cover aspect-3/2 overflow-clip max-w-full w-full bg-gray-600"
      onLoad={() => {
        setError(false);
      }}
      onError={() => {
        setError(true);
      }}
    />
  );
}
