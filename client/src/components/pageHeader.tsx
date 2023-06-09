import { useAuth } from "@/hooks";
import styles from "@/styles/components/pageHeader.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ExternalLink } from "react-feather";

export function PageHeader() {
  const { user, isLoading, logout, login } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className={styles.header}>
      <div className="container">
        <nav>
          <div className={styles.logo}>
            <Link href={"/"}>CanWeCoop</Link>
          </div>
          <div className={styles.auth}>
            <ul className={styles.mainNavigation}>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
            {!isLoading ? (
              user ? (
                <>
                  <div className={styles.profile}>
                    <button
                      className={styles.profileButton}
                      onClick={() => setShowProfile(!showProfile)}
                    >
                      <Image
                        src={user.avatarUrl}
                        alt={user.displayName}
                        width={50}
                        height={50}
                        priority
                      />
                    </button>
                    <menu
                      className={`${styles.profileMenu} ${
                        showProfile && styles.active
                      }`}
                    >
                      <ul>
                        <li>
                          <h3>{user.displayName}</h3>
                        </li>
                        <li>
                          <Link
                            className="iconLink"
                            href={user.profileUrl}
                            rel="noreferrer"
                            target="_BLANK"
                          >
                            Profile
                            <ExternalLink />
                          </Link>
                        </li>
                        <li>
                          <Link href={"/friends"}>Friends</Link>
                        </li>
                        <li>
                          <button onClick={logout}>Logout</button>
                        </li>
                      </ul>
                    </menu>
                  </div>
                </>
              ) : (
                <>
                  <button onClick={login}>Login</button>
                </>
              )
            ) : (
              <></>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
