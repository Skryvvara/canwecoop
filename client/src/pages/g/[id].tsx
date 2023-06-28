import styles from "@/styles/Game.module.scss";
import { getGameById } from "@/api";
import { LoadingSpinner } from "@/components";
import { Game } from "@/types";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink } from "react-feather";

export default function Game() {
  const [isLoading, setIsLoading] = useState(true);
  const [game, setGame] = useState<Game>();
  const router = useRouter();

  const getGame = useCallback(async () => {
    setIsLoading(true);
    const { id } = router.query;
    if (id) {
      const game = await getGameById(String(id));
      setGame(game);
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    getGame();
  }, [getGame]);

  if (isLoading) return <LoadingSpinner />;
  if (!game || !game.id) {
    router.push("/404");
    return;
  }

  return (
    <>
      <Head>
        <title>{game.name} | CanWeCoop</title>
        <meta name="description" content={game.shortDescription} />
        <meta property="og:image" content={game.headerImageUrl} />
      </Head>
      <section
        aria-label={game.name}
        className={styles.mainSection}
        style={{
          backgroundImage: `linear-gradient(
            to bottom, transparent, var(--color-background)
          ), url(${game.backgroundImageUrl})`,
        }}
      >
        <div className="container">
          <header className={`${styles.mainHeader} main-header`}>
            <Image
              src={game.headerImageUrl}
              alt={game.name}
              width={460}
              height={215}
              priority={true}
            />
            <span className={styles.headerText}>
              <h1>{game.name}</h1>
              <p>{game.shortDescription}</p>
              <footer>
                <ul>
                  <li>
                    <Link
                      role="button"
                      className="iconLink"
                      rel="noreferrer"
                      target="_BLANK"
                      href={game.storeUrl}
                    >
                      Store <ExternalLink />
                    </Link>
                  </li>
                  <li>
                    {game.website && (
                      <Link
                        role="button"
                        className="iconLink"
                        rel="noreferrer"
                        target="_BLANK"
                        href={game.website}
                      >
                        Website <ExternalLink />
                      </Link>
                    )}
                  </li>
                </ul>
              </footer>
            </span>
          </header>

          <section
            className={styles.tagSection}
            aria-labelledby="section-categories"
          >
            <h2 id="section-categories">Categories</h2>
            <ul>
              {game.categories.map((category) => (
                <li key={category.id}>{category.description}</li>
              ))}
            </ul>
          </section>

          <section
            className={styles.tagSection}
            aria-labelledby="section-genres"
          >
            <h2 id="section-genres">Genres</h2>
            <ul>
              {game.genres.map((genre) => (
                <li key={genre.id}>{genre.description}</li>
              ))}
            </ul>
          </section>
        </div>
      </section>
    </>
  );
}
