"use client";

import React from "react";
import Link from "next/link";
import styles from "@/styles/dashboard/layout.module.css";

export default function DashboardLayout({ children }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>Admin Dashboard</div>
        <nav className={styles.nav}>
          <Link href="/dashboard" className={styles.navLink}>
            Trang chủ
          </Link>
          <Link href="/dashboard/products" className={styles.navLink}>
            Sản phẩm
          </Link>
          <Link href="/dashboard/categories" className={styles.navLink}>
            Danh mục
          </Link>
        </nav>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Quản lý đấu giá. All rights reserved.</p>
      </footer>
    </div>
  );
}
