import json from "../images.json";
import { createApi } from "unsplash-js";
import * as array from "../lib/array";
import { GameParams, GameDifficulty, GameTheme } from "../lib/types";
import Game from "./game";

const unsplashApi = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY as string,
});

type SearchParams = {
  theme?: GameTheme | "" | undefined;
  difficulty?: GameDifficulty | "" | undefined;
};

function imagesPerDifficulty(difficulty: GameDifficulty) {
  switch (difficulty) {
    case "easy":
      return 8;
    case "hard":
      return 32;
    case "insane":
      return 50;
    default:
      return 18;
  }
}

async function fetchImages(params: GameParams) {
  switch (params.theme) {
    case "bluey":
      return array
        .shuffle(json.bluey)
        .slice(0, imagesPerDifficulty(params.difficulty));
    default: {
      try {
        const { response } = await unsplashApi.photos.getRandom({
          query: params.theme,
          count: imagesPerDifficulty(params.difficulty),
        });
        const items = Array.isArray(response) ? response : [];
        return items.map((item) => item.urls?.small) ?? [];
      } catch {
        return [];
      }
    }
  }
}

async function initGame(searchParamsAsync: Promise<SearchParams>) {
  const searchParams = await searchParamsAsync;
  const gameParams = {
    difficulty: searchParams.difficulty || "medium",
    theme: searchParams.theme || "nature",
  } as GameParams;
  const sourceImages = await fetchImages(gameParams);

  // preload images
  await Promise.all(sourceImages.map((url) => fetch(url)));

  return array.shuffle(array.repeat(sourceImages));
}

export default async function GamePage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const difficulty = "medium";
  const deck = initGame(props.searchParams);

  return <Game deck={deck} difficulty={difficulty} />;
}
