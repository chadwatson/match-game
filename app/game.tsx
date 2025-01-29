"use client";
import { use, useCallback, useEffect, useState } from "react";
import * as set from "./lib/set";
import { Deck, GameDifficulty } from "./lib/types";

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
      <header className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-6 py-2">
        <div className="flex-1">
          <div className="flex items-center">
            <div className="mr-4 pr-6 flex items-center">
              <div
                className={`rounded w-10 h-10 mr-3 flex items-center justify-center font-bold text-2xl ${
                  currentPlayer === 1
                    ? "bg-blue-700 text-white"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                {currentPlayer === 1 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div>
                <div className="leading-none text-sm text-gray-500">
                  Player 1
                </div>
                <div className="leading-none text-2xl text-white font-bold">
                  {playerOneCards.size}
                </div>
              </div>
            </div>
            <div className="mr-4 pr-6 flex items-center">
              <div
                className={`rounded w-10 h-10 mr-3 flex items-center justify-center font-bold text-2xl ${
                  currentPlayer === 2
                    ? "bg-red-700 text-white"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                {currentPlayer === 2 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div>
                <div className="leading-none text-sm text-gray-500">
                  Player 2
                </div>
                <div className="leading-none text-2xl text-white font-bold">
                  {playerTwoCards.size}
                </div>
              </div>
            </div>
            {matchFound ? (
              <button
                type="button"
                className="rounded-full inline-block py-1 pl-3 pr-4 font-bold bg-emerald-700 text-white text-nowrap hover:bg-emerald-800 border-b-4 border-emerald-800"
                onClick={collectCards}
              >
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 mr-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                  <span>Match Found!</span>
                </span>
              </button>
            ) : guessesMade ? (
              <button
                type="button"
                className="rounded-full inline-block py-1 pl-3 pr-4 font-bold bg-violet-800 text-white text-nowrap hover:bg-violet-900 border-b-4 border-violet-900"
                onClick={switchPlayer}
              >
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 mr-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                  <span>Switch</span>
                </span>
              </button>
            ) : null}
          </div>
        </div>
        <div className="flex-1 items-end text-right">
          <button
            type="button"
            className="ml-2 p-2 text-gray-800 hover:text-gray-300 active:text-gray-100"
            onClick={() => {
              if (confirm("Are you sure you want to start a new game?")) {
                window.location.reload();
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
              />
            </svg>
          </button>
        </div>
      </header>
      <div className="w-screen h-screen pt-16 p-6">
        {gameOver ? (
          <div className="w-full h-full flex justify-center items-center">
            <div className="text-center">
              <h1 className="mb-4 text-4xl text-white font-bold text-center">
                {playerTwoCards.size > playerOneCards.size
                  ? "Player 2 wins!"
                  : playerTwoCards.size < playerOneCards.size
                  ? "Player 1 wins!"
                  : "It's a tie!"}
              </h1>
              <button
                type="button"
                className="rounded-full inline-block py-2 px-5 text-xl font-bold bg-lime-600 text-white hover:bg-lime-700 border-b-4 border-lime-700 hover:border-lime-900 active:border-0"
                onClick={() => {
                  window.location.reload();
                }}
              >
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                  Play again
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`w-full h-full max-w-full max-h-full grid gap-6 ${gridClassName(
              props.difficulty
            )}`}
          >
            {[...deck].map((image, index) => (
              <div key={`card-${index}`} className="w-full h-full relative">
                {foundCards.has(index) ? (
                  <div className="block w-full h-full border border-gray-800 rounded-lg overflow-hidden" />
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
