import React from "react";
import Link from "next/link";
import styles from "@/styles/home/layout.module.css";

export default function UserLayout({ children }) {
  return (
    <div className={styles.userLayout}>
      <header className={styles.header}>
        <div className={styles.container}>
          <h1 className={styles.title}>Hệ thống đấu giá</h1>
          <nav className={styles.nav}>
            <Link className={styles.navLink} href="/">Trang chủ</Link>
            <Link className={styles.navLink} href="/profile">Hồ sơ</Link>
            <Link className={styles.navLink} href="/orders">Đơn hàng</Link>
            <Link className={styles.navLink} href="/logout">Đăng xuất</Link>
          </nav>
        </div>
      </header>

      <main className={styles.mainContent}>{children}</main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>&copy; {new Date().getFullYear()} Đấu giá trực tuyến. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
