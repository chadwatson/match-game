"use client";
import Link from "next/link";
import { ArrowPathIcon, SparklesIcon } from "@heroicons/react/24/outline";
import Button, { createButtonClassName } from "./button";

export default function GameOver(props: { winner: number }) {
  const { winner } = props;

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="text-center">
        <h1 className="mb-4 text-2xl text-black dark:text-white font-bold text-center">
          {winner === 2
            ? "Player 2 wins!"
            : winner === 1
            ? "Player 1 wins!"
            : "It's a tie!"}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            icon={<Button.Icon Component={ArrowPathIcon} />}
            onClick={() => {
              window.location.reload();
            }}
          >
            Play again
          </Button>
          <Link
            href="/"
            title="Start a new game."
            className={createButtonClassName({ theme: "primary" })}
          >
            <SparklesIcon className="size-5 mr-2" />
            New game
          </Link>
        </div>
      </div>
    </div>
  );
}
