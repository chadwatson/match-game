"use client";
import { Suspense, use, useCallback, useEffect, useState } from "react";
import * as set from "@/app/lib/set";
import { Deck, GameDifficulty } from "@/app/lib/types";
import {
  ArrowPathIcon,
  CheckIcon,
  SparklesIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { preloadImage } from "@/app/lib/image";
import GameOver from "./game-over";

type Guesses = Set<number>;

type PlayerNumber = 1 | 2;

type PlayerCards = Set<number>;

const allGuessesMade = (guesses: Guesses) => {
  const [a, b] = [...guesses];
  return typeof a === "number" && typeof b === "number";
};

const guessesMatch = (guesses: Set<number>) => {
  const [a, b] = [...guesses];
  return function (deck: string[]) {
    return allGuessesMade(guesses) && deck[a] === deck[b];
  };
};

function gridClassName(difficulty: GameDifficulty) {
  switch (difficulty) {
    case "easy":
      return "grid-cols-4 grid-rows-4";
    case "hard":
      return "grid-cols-8 grid-rows-8";
    case "insane":
      return "grid-cols-10 grid-rows-10";
    default:
      return "grid-cols-6 grid-rows-6";
  }
}

export default function Game(props: {
  deck: Promise<Deck>;
  difficulty: GameDifficulty;
}) {
  const router = useRouter();
  const deck = use(props.deck);
  const [guesses, setGuesses] = useState<Guesses>(new Set());
  const [currentPlayer, setCurrentPlayer] = useState<PlayerNumber>(1);
  const [playerOneCards, setPlayerOneCards] = useState<PlayerCards>(
    () => new Set()
  );
  const [playerTwoCards, setPlayerTwoCards] = useState<PlayerCards>(
    () => new Set()
  );

  const matchFound = guessesMatch(guesses)(deck);
  const guessesMade = guesses.size >= 2;
  const foundCards = set.join(playerTwoCards)(playerOneCards);
  const gameOver = foundCards.size === deck.length;
  const playerOneWins = gameOver && playerOneCards.size > playerTwoCards.size;
  const playerTwoWins = gameOver && playerOneCards.size < playerTwoCards.size;

  const collectCards = useCallback(() => {
    if (currentPlayer === 2) {
      setPlayerTwoCards(set.join(guesses));
    } else {
      setPlayerOneCards(set.join(guesses));
    }
    setGuesses(new Set());
  }, [guesses, currentPlayer, setPlayerOneCards, setPlayerTwoCards]);

  const switchPlayer = useCallback(() => {
    setGuesses(new Set());
    setCurrentPlayer((currentPlayer) => (currentPlayer === 1 ? 2 : 1));
  }, [setGuesses, setCurrentPlayer]);

  useEffect(() => {
    deck.forEach(preloadImage);
  }, [props.deck]);

  useEffect(() => {
    function listener(event: KeyboardEvent) {
      event.preventDefault();
      if (event.key === " " && matchFound) {
        collectCards();
      } else if (event.key === " " && guessesMade) {
        switchPlayer();
      }
    }
    document.addEventListener("keyup", listener);
    return () => {
      document.removeEventListener("keyup", listener);
    };
  }, [matchFound, guessesMade, collectCards, switchPlayer]);

  return (
    <form className="w-screen h-screen">
      <header className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-2 lg:px-6 py-2">
        <div className="flex-1">
          <div className="flex items-center">
            <div className="mr-2 pr-3 md:mr-4 md:pr-6 flex items-center">
              <div
                className={`rounded w-10 h-10 mr-3 flex items-center justify-center font-bold text-2xl ${
                  playerOneWins || (!gameOver && currentPlayer === 1)
                    ? "bg-blue-700 text-white"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                {playerOneWins ? (
                  <CheckIcon className="size-6" />
                ) : !gameOver && currentPlayer === 1 ? (
                  <StarIcon className="size-6" />
                ) : null}
              </div>
              <div>
                <div className="leading-none text-sm text-gray-500 whitespace-nowrap">
                  Player 1
                </div>
                <div className="leading-none text-2xl text-white font-bold whitespace-nowrap">
                  {playerOneCards.size}
                </div>
              </div>
            </div>
            <div className="mr-2 pr-3 md:mr-4 md:pr-6 flex items-center">
              <div
                className={`rounded w-10 h-10 mr-3 flex items-center justify-center font-bold text-2xl ${
                  playerTwoWins || (!gameOver && currentPlayer === 2)
                    ? "bg-red-700 text-white"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                {playerTwoWins ? (
                  <CheckIcon className="size-6" />
                ) : !gameOver && currentPlayer === 2 ? (
                  <StarIcon className="size-6" />
                ) : null}
              </div>
              <div>
                <div className="leading-none text-sm text-gray-500 whitespace-nowrap">
                  Player 2
                </div>
                <div className="leading-none text-2xl text-white font-bold whitespace-nowrap">
                  {playerTwoCards.size}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 items-end text-right">
          {matchFound ? (
            <button
              type="button"
              className="cursor-pointer rounded-full inline-block px-2 md:px-3 py-1 md:py-1 font-bold bg-emerald-700 text-sm text-white text-nowrap hover:bg-emerald-800 border-b-4 border-emerald-800"
              onClick={collectCards}
            >
              <span className="flex items-center">
                <CheckIcon className="size-7 md:size-5 md:mr-1" />
                <span className="hidden md:inline-block">Match Found!</span>
              </span>
            </button>
          ) : guessesMade ? (
            <button
              type="button"
              className="rounded-full inline-block px-2 md:px-3 py-1 md:py-1 cursor-pointer font-bold bg-violet-800 text-white text-sm text-nowrap hover:bg-violet-900 border-b-4 border-violet-900"
              onClick={switchPlayer}
            >
              <span className="flex items-center">
                <ArrowPathIcon className="size-7 md:size-5 md:mr-1" />
                <span className="hidden md:inline-block">Switch</span>
              </span>
            </button>
          ) : null}
          {!gameOver && (
            <button
              type="button"
              className="inline-block rounded-full cursor-pointer px-2 md:px-3 py-1 md:py-1 ml-2 md:ml-4 text-sm font-bold bg-gray-50 text-gray-700 hover:bg-gray-200 border-b-4 border-gray-400 hover:text-gray-900 active:border-0"
              onClick={() => {
                if (confirm("Are you sure you want to start a new game?")) {
                  router.push("/");
                }
              }}
            >
              <span className="flex items-center justify-center">
                <SparklesIcon className="size-7 md:size-5 md:mr-1" />
                <span className="hidden md:inline-block">New Game</span>
              </span>
            </button>
          )}
        </div>
      </header>
      <div className="w-screen h-screen pt-16 px-2 pb-2 lg:px-6 lg:pb-6">
        {gameOver ? (
          <Suspense>
            <GameOver winner={playerOneWins ? 1 : 2} />
          </Suspense>
        ) : (
          <div
            className={`w-full h-full max-w-full max-h-full grid gap-2 lg:gap-6 ${gridClassName(
              props.difficulty
            )}`}
          >
            {[...deck].map((image, index) => (
              <div key={`card-${index}`} className="w-full h-full relative">
                {foundCards.has(index) ? (
                  <div className="block w-full h-full border border-gray-800 rounded lg:rounded-lg overflow-hidden" />
                ) : (
                  <>
                    <input
                      type="checkbox"
                      disabled={
                        !guesses.has(index) && (guessesMade || matchFound)
                      }
                      id={`card-${index}`}
                      className="opacity-0 w-0 h-0 overflow-hidden peer absolute"
                      checked={guesses.has(index)}
                      onChange={() => {
                        setGuesses((guesses) =>
                          guesses.size < 2 ? set.add(index)(guesses) : guesses
                        );
                      }}
                    />
                    <label
                      htmlFor={`card-${index}`}
                      className={`block w-full h-full bg-gray-400 bg-cover bg-center rounded-lg overflow-hidden ${
                        matchFound || guessesMade
                          ? ""
                          : "cursor-pointer hover:bg-gray-500"
                      }`}
                      style={
                        guesses.has(index)
                          ? { backgroundImage: `url(${image})` }
                          : undefined
                      }
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
