import styles from 'styles/components/gameCard.module.scss';
import { FunctionComponent } from 'react';
import { Category, Game, Genre } from '@prisma/client';
import Image from 'next/image';
import { FaShoppingCart } from 'react-icons/fa';
import Link from 'next/link';

interface Props {
  game: Game & { categories: Category[]; genres: Genre[]; }
  index?: number
}

export const GameCard: FunctionComponent<Props> = ({ game, index }) => {

  return(
    <li className={styles.gameCard}>
        <div className={styles.imgBox}>
          <Image src={game.header_image} priority={(index && index <= 12) ? true : false} alt={game.name} width={460} height={215} />
        </div>
        <div className={styles.cardBody}>
          <h2>{game.name}</h2>
          <p>{game.short_description}</p>

          { (game.is_free) 
            ? <p><strong>FREE</strong></p>
            : <></>
          }

          <div className={styles.buttonGroup}>
            <button className={styles.categoryBtn}>
              C
              <ul className={styles.categoryList}>
                { game.categories.map((c) => <li key={c.id}>{c.description}</li>) }
              </ul>
            </button>

            <button className={styles.categoryBtn}>
              G
              <ul className={styles.categoryList}>
                { game.genres.map((c) => <li key={c.id}>{c.description}</li>) }
              </ul>
            </button>

            <div className="appBtn"><Link href={game.storeUrl} passHref><><FaShoppingCart /> Store</></Link></div>
          </div>
        </div>
      </li>
  );
};
