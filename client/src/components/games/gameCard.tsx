import styles from "@/styles/components/gameCard.module.scss";
import { Game } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface props {
  game: Game;
  index?: number;
}

export function GameCard(props: props) {
  const game = props.game;
  const index = props.index ?? 12;

  return (
    <li className={styles.card}>
      <Image
        src={game.headerImageUrl}
        alt={game.name}
        width={460}
        height={215}
        priority={index && index <= 12 ? true : false}
      />
      <div className={styles.cardBody}>
        <Link href={"/g/" + game.id}>
          <h2>{game.name}</h2>
        </Link>
        <div className={styles.description}>
          <p>{game.shortDescription}</p>
          {game.isFree && <span>FREE</span>}
        </div>
      </div>
      <footer className={styles.cardFooter}>
        <Link
          role="button"
          rel="noreferrer"
          target="_BLANK"
          href={game.storeUrl}
        >
          Shop
        </Link>
      </footer>
    </li>
  );
}
