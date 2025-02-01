"use client";
import Link from "next/link";
import { ArrowPathIcon, SparklesIcon } from "../icons";
import { useRouter } from "next/navigation";

export default function GameOver(props: { winner: number }) {
  const router = useRouter();
  const { winner } = props;

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="text-center">
        <h1 className="mb-4 text-4xl text-white font-bold text-center">
          {winner === 2
            ? "Player 2 wins!"
            : winner === 1
            ? "Player 1 wins!"
            : "It's a tie!"}
        </h1>
        <div className="flex items-center">
          <button
            type="button"
            className="inline-block rounded-full py-2 px-5 mr-3 cursor-pointer text-xl font-bold bg-lime-600 text-white hover:bg-lime-700 border-b-4 border-lime-700 hover:border-lime-900 active:border-0"
            onClick={() => {
              router.refresh();
            }}
          >
            <span className="flex items-center justify-center">
              <ArrowPathIcon className="size-6 mr-2" />
              Play again
            </span>
          </button>
          <Link
            href="/"
            title="Start a new game."
            className="flex items-center justify-center rounded-full py-2 px-5 text-xl font-bold bg-gray-50 text-gray-700 hover:bg-gray-200 border-b-4 border-gray-400 hover:text-gray-900 active:border-0"
          >
            <SparklesIcon className="size-6 mr-2" />
            New game
          </Link>
        </div>
      </div>
    </div>
  );
}
