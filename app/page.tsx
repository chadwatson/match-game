import json from "./images.json";
import * as array from "./lib/array";
import { GameDifficulty } from "./lib/types";
import Game from "./game";

type SourceImages = string[];

const imagesForDifficulty =
  (difficulty: GameDifficulty) =>
  (images: SourceImages): SourceImages => {
    switch (difficulty) {
      case "easy":
        return images.slice(0, 8);
      case "hard":
        return images.slice(0, 32);
      case "insane":
        return images.slice(0, 50);
      default:
        return images.slice(0, 18);
    }
  };

async function initGame(difficulty: GameDifficulty) {
  const sourceImages = imagesForDifficulty(difficulty)(
    array.shuffle(json.bluey)
  );

  // preload images
  await Promise.all(sourceImages.map((url) => fetch(url)));

  return array.shuffle(array.repeat(sourceImages));
}

export default function Home() {
  const difficulty = "medium";
  const deck = initGame(difficulty);

  return <Game deck={deck} difficulty={difficulty} />;
}
