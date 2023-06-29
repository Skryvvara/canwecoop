import styles from "@/styles/Game.module.scss";
import { Game } from "@/types";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "react-feather";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { getServerSideClientConfig } from "@/server/getServerSideClientConfig";

interface IGameProps {
  game: Game;
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const config = await getServerSideClientConfig();
  const { id } = ctx.query;

  const res = await axios
    .get(config.apiBaseUrl + "/games/" + id)
    .then((res) => {
      return {
        success: true,
        data: res.data,
      };
    })
    .catch((err) => {
      console.error(err);
      return {
        success: false,
        data: null,
      };
    });

  if (!res.success) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      game: res.data,
    },
  };
}

export default function GamePage(props: IGameProps) {
  const { game } = props;

  return (
    <>
      <Head>
        <title>{`${game.name} | CanWeCoop`}</title>
        <meta name="description" content={game.shortDescription} />
        <meta name="og:site_name" content="CanWeCoop" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={game.name} />
        <meta property="og:description" content={game.shortDescription} />
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
