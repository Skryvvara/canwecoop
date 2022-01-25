import styles from 'styles/components/gameCard.module.scss';
import { FunctionComponent } from 'react';
import { Category, Game, Genre } from '@prisma/client';
import Image from 'next/image';

interface Props {
  game: Game & { categories: Category[]; genres: Genre[]; }
  index?: number
}

export const GameCard: FunctionComponent<Props> = ({ game, index }) => {

  return(
    <li className={styles.gameCard}>
        <div>
          <Image src={game.header_image} priority={(index && index <= 12) ? true : false} alt={game.name} width={460} height={215} />
        </div>
        <div className={styles.cardBody}>
          <h2>{game.name}</h2>
          <p>{game.short_description}</p>

          { (game.is_free) 
            ? <p><strong>FREE</strong></p>
            : <></>
          }

          <button className={styles.categoryBtn}>
            Categories
            <ul className={styles.categoryList}>
              {game.categories.map((c) => <li key={c.id}>{c.description}</li>) }
            </ul>
          </button>
        </div>
      </li>
  );
};
