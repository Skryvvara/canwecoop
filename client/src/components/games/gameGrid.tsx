import styles from "@/styles/components/gameGrid.module.scss";
import { Game } from "@/types";
import { GameCard } from "./gameCard";

interface IGameGridProps {
  games: Game[];
}

export function GameGrid(props: IGameGridProps) {
  return (
    <ul className={styles.gameGrid}>
      {props.games.map((game: Game, index: number) => (
        <GameCard key={game.id} game={game} index={index} />
      ))}
    </ul>
  );
}
