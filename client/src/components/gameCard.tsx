import styles from "@/styles/components/gameCard.module.scss";
import { Game } from "@/types";
import Image from "next/image";

interface props {
  game: Game;
}

export function GameCard(props: props) {
  const game = props.game;

  return (
    <li className={styles.card}>
      <Image src={game.headerImageUrl} alt="art" width={460} height={215} />
      <h2>{game.name}</h2>
      <p className={styles.description}>{game.shortDescription}</p>
    </li>
  );
}
