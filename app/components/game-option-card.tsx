import { User } from "@clerk/nextjs/server";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Suspense, use } from "react";
import GameOptionCardThumbnail from "./game-option-card-thumbnail";
import ShareButton from "./share-button";

function GameOwner(props: {
  owner: Promise<User | null | undefined>;
  playCount: number;
}) {
  const user = use(props.owner);

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center">
      <img
        src={user.imageUrl}
        className="block size-7 rounded-full object-cover object-center mr-2"
      />
      <div>
        <div className="font-bold text-xs truncate text-white leading-3.5">
          {user.fullName}
        </div>
        <div className="text-xs truncate leading-3.5 text-gray-200">
          {props.playCount} plays
        </div>
      </div>
    </div>
  );
}

export default function GameOptionCard(props: {
  type: "deck" | "unsplash";
  deckId?: number | undefined;
  thumbnail?: string | null | undefined;
  title: string;
  description: string;
  playCount: number | null;
  owner: Promise<User | null | undefined>;
  canEdit: boolean;
}) {
  const { type, deckId } = props;
  const playHref = {
    pathname: "/play",
    query: { type, deckId, difficulty: "medium" },
  };

  return (
    <div className="relative rounded-lg bg-gray-900 border border-gray-800 shadow-md">
      <div className="block relative">
        <Link
          title={props.title}
          href={playHref}
          className="block active:opacity-80"
        >
          <div className="relative rounded-t-lg overflow-hidden">
            <GameOptionCardThumbnail
              src={props.thumbnail}
              title={props.title}
            />
          </div>
        </Link>
        <div className="absolute left-0 right-0 bottom-0 h-16 min-h-16 flex items-end px-3 pb-2 bg-gradient-to-b from-black/0 to-black/75">
          <div className="flex justify-between items-center w-full">
            <Suspense>
              <GameOwner owner={props.owner} playCount={props.playCount ?? 0} />
            </Suspense>
            <ShareButton
              title={props.title}
              path={`/play?type=deck&deckId=${deckId}`}
            />
          </div>
        </div>
      </div>
      <div className="px-4 py-3">
        <h3 className="font-bold text-base/7 truncate">{props.title}</h3>
        <p className="text-sm text-ellipsis h-10 mb-1 text-gray-700 dark:text-gray-300">
          {props.description}
        </p>
      </div>
      <div className="flex items-center justify-between border-t border-gray-800">
        <Link
          title={`Play ${props.title}`}
          href={playHref}
          className="flex-1 px-2 py-3 flex justify-center items-center border-r border-gray-800 hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700"
        >
          <span className="font-bold text-sm mr-2">Play</span>
          <ArrowRightIcon className="size-4" />
        </Link>
        {props.canEdit && (
          <Link
            title={`Edit ${props.title}`}
            href={`/decks/${deckId}/edit`}
            className="flex-1 px-2 py-3 flex justify-center items-center hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700"
          >
            <PencilIcon className="size-3 mr-2" />
            <span className="font-bold text-sm">Edit</span>
          </Link>
        )}
      </div>
    </div>
  );
}
