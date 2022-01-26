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
    <div>
      <ul data-box="grid">
        {
          data?.pages.map((page) => (
            page.games.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))
          ))
        }
      </ul>
    </div>
  );
};
