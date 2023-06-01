import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.scss";
import { useAuth } from "@/hooks";

export default function Home() {
  const { user, isLoading, logout } = useAuth();

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {user && !isLoading ? (
          <div>
            <Image
              src={user.avatarUrl}
              alt={`profile picture of ${user.displayName}`}
              width={200}
              height={200}
            />
            <h1>{`Authenticated as ${user.displayName} with ${user.id}`}</h1>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <div>
            <a
              href="http://localhost:3010/api/auth/login"
              referrerPolicy="origin-when-cross-origin"
            >
              Login
            </a>
          </div>
        )}
      </main>
    </>
  );
}
