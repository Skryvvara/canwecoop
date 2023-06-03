import { useAuth } from "@/hooks";
import styles from "@/styles/components/pageHeader.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function PageHeader() {
  const { user, isLoading, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className={styles.header}>
      <div className="container">
        <nav>
          <div className={styles.logo}>CanWeCoop</div>
          <ul className={styles.mainNavigation}>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
          </ul>
          <div className="auth">
            {user ? (
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
                          href={user.profileUrl}
                          rel="noreferrer"
                          target="_BLANK"
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link href={"/friends"}>Friends</Link>
                      </li>
                      <li>
                        <button className="inverted" onClick={logout}>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </menu>
                </div>
              </>
            ) : (
              <>
                <Link
                  role="button"
                  className="inverted"
                  href={"http://localhost:3010/api/auth/login"}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
