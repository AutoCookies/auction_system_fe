"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { checkAuth } from "@/utils/checkAuth";
import styles from "@/styles/dashboard/layout.module.css";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const res = await checkAuth();
      if (res.success && res.user.role === "ADMIN") {
        setUser(res.user);
      } else {
        router.push("/"); // không phải admin → đá về trang chủ
      }
    }

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.push("/login");
  };

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
          <Link href="/dashboard/users" className={styles.navLink}>
            Người dùng
          </Link>
          <Link href="/dashboard/invoices" className={styles.navLink}>
            Hóa đơn
          </Link>
          {user && (
            <div className={styles.dropdown}>
              <button
                className={styles.dropdownToggle}
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                {user.name}
              </button>
              {showDropdown && (
                <div className={styles.dropdownMenu}>
                  <button className={styles.dropdownItem} onClick={() => router.push("/dashboard/me")}>
                    Hồ sơ
                  </button>
                  <button className={styles.dropdownItem} onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Quản lý đấu giá. All rights reserved.</p>
      </footer>
    </div>
  );
}
