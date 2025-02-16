import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import bluey from "../public/bluey.jpg";
import fox from "../public/fox.jpg";
import nature from "../public/nature.jpg";
import fish from "../public/fish.jpg";
import mountains from "../public/mountains.jpg";
import cars from "../public/cars.jpg";
import { GameDifficulty, GameTheme } from "./lib/types";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const difficulty = "medium";

  return (
    <div className="w-full h-screen flex justify-center items-center py-4 px-6">
      <div className="max-w-3xl">
        <h2 className="font-bold text-center text-4xl mb-4">
          Which game would you like to play?
        </h2>
        <div className="grid grid-cols-3 gap-6">
          <GameThemeOption
            difficulty={difficulty}
            theme="bluey"
            imgSrc={bluey}
            title="Bluey"
          />
          <GameThemeOption
            difficulty={difficulty}
            theme="animals"
            imgSrc={fox}
            title="Animals"
          />
          <GameThemeOption
            difficulty={difficulty}
            theme="nature"
            imgSrc={nature}
            title="Nature"
          />
          <GameThemeOption
            difficulty={difficulty}
            theme="fish"
            imgSrc={fish}
            title="Fish"
          />
          <GameThemeOption
            difficulty={difficulty}
            theme="mountains"
            imgSrc={mountains}
            title="Mountains"
          />
          <GameThemeOption
            difficulty={difficulty}
            theme="cars"
            imgSrc={cars}
            title="Cars"
          />
          <Link
            title="Make your own!"
            href="/custom-game"
            className="active:opacity-80"
          >
            <div className="relative rounded-lg overflow-hidden flex items-center justify-center">
              <div className="flex items-center">
                <ArrowUpTrayIcon className="size-6 mr-2" />
                <span className="">Make your own!</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function GameThemeOption(props: {
  difficulty: GameDifficulty;
  theme: GameTheme;
  imgSrc: StaticImageData;
  title: string;
}) {
  const { theme, difficulty } = props;
  return (
    <Link
      title={props.title}
      href={{
        pathname: "/game",
        query: { theme, difficulty },
      }}
      className="active:opacity-80"
    >
      <div className="relative rounded-lg overflow-hidden">
        <Image
          src={props.imgSrc}
          alt={props.title}
          className="block object-cover aspect-3/2 overflow-clip max-w-full h-auto"
        />
      </div>
    </Link>
  );
}
