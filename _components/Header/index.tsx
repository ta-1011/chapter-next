import Link from "next/link";
import styles from "./style.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <ul className="flex justify-between">
        <div>
          <li>
            <Link className={styles.header_link} href="/">
              Blog
            </Link>
          </li>
        </div>
        <div className="flex gap-4">
          <li>
            <Link className={styles.header_link} href="/contact">
              お問い合わせ
            </Link>
          </li>
          <li>
            <Link className={styles.header_link} href="/admin/posts">
              ログイン
            </Link>
          </li>
        </div>
      </ul>
    </header>
  );
};

export default Header;
