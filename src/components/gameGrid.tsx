import styles from 'styles/components/gameGrid.module.scss';
import { Category, Game, Genre } from '@prisma/client';
import { FunctionComponent } from 'react';
import { InfiniteData } from 'react-query';
import { GameCard } from './gameCard';

interface Props {
  data?: InfiniteData<{
    games: (Game & {
        categories: Category[];
        genres: Genre[];
    })[];
    nextCursor: string | null;
}> | undefined
}

export const GameGrid: FunctionComponent<Props> = ({ data }) => {

  return(
    <ul className={styles.gameGrid}>
      {
        data?.pages.map((page) => (
          page.games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))
        ))
      }
    </ul>
  );
};
