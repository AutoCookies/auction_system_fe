"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import styles from "@/styles/home/layout.module.css";
import { checkAuth } from "@/utils/checkAuth";
import { handleLogout } from "@/utils/handleLogout";
import { useRouter } from "next/navigation";
import CategoryOverlay from "@/components/CategoryOverlay"; // Thêm import

export default function UserLayout({ children }) {
  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [showCategory, setShowCategory] = useState(false); // trạng thái mở overlay
  const router = useRouter();
  const dropdownRef = useRef(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await checkAuth();
      if (res.success) {
        setUser(res.user);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onLogout = async () => {
    const res = await handleLogout();
    if (res.success) {
      router.push("/login");
    } else {
      alert("Lỗi đăng xuất: " + res.message);
    }
  };

  return (
    <div className={styles.userLayout}>
      <header className={styles.header}>
        <div className={styles.container}>
          <h1 className={styles.title}>Hệ thống đấu giá</h1>
          <nav className={styles.nav}>
            <Link className={styles.navLink} href="/home">Trang chủ</Link>
            <button className={styles.navLink} onClick={() => setShowCategory(true)}>
              Danh mục
            </button>

            {user && (
              <div className={styles.dropdown} ref={dropdownRef}>
                <button className={styles.dropdownToggle} onClick={() => setOpenMenu(!openMenu)}>
                  {user.name}
                </button>
                {openMenu && (
                  <div className={styles.dropdownMenu}>
                    <Link className={styles.dropdownItem} href="/home/me">Hồ sơ</Link>
                    <button className={styles.dropdownItem} onClick={onLogout}>Đăng xuất</button>
                    <Link className={styles.dropdownItem} href="/home/invoices">Hóa đơn</Link>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className={styles.mainContent}>{children}</main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>&copy; {new Date().getFullYear()} Đấu giá trực tuyến. All rights reserved.</p>
        </div>
      </footer>

      {/* Overlay danh mục */}
      {showCategory && <CategoryOverlay onClose={() => setShowCategory(false)} />}
    </div>
  );
}
