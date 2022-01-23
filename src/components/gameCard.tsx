import { FunctionComponent } from 'react';
import { Category, Game, Genre } from '@prisma/client';
import Image from 'next/image';

interface Props {
  game: Game & { categories: Category[]; genres: Genre[]; }
}

export const GameCard: FunctionComponent<Props> = ({ game }) => {

  return(
    <li>
        <Image src={game.header_image} alt={game.name} width={460} height={215} />
        <div className='cardBody'>
          <h2>{game.name}</h2>
          <p>{game.short_description}</p>

          { (game.is_free) 
            ? <p><strong>FREE</strong></p>
            : <></>
          }
        </div>
      </li>
  );
};
