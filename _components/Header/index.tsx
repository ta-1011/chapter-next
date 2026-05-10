import Link from "next/link";
import styles from "./style.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <ul className="flex justify-between">
        <li>
          <Link className={styles.header_link} href="/">
            Blog
          </Link>
        </li>
        <li>
          <Link className={styles.header_link} href="/contact">
            お問い合わせ
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
