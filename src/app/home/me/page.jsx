"use client";

import { useEffect, useState } from "react";
import { checkAuth } from "@/utils/checkAuth";
import styles from "@/styles/home/me/page.module.css"; // bạn có thể tạo file CSS riêng cho style

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const res = await checkAuth();
      if (res.success) {
        setUser(res.user);
        setErrorMsg("");
      } else {
        setErrorMsg(res.message);
      }
      setLoading(false);
    }

    fetchUser();
  }, []);

  if (loading) {
    return <p className={styles.loading}>Đang tải thông tin...</p>;
  }

  if (errorMsg) {
    return <p className={styles.error}>{errorMsg}</p>;
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Thông tin người dùng</h1>

      <div className={styles.profileBox}>
        <p><strong>Họ tên:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Số điện thoại:</strong> {user.mobile || "Chưa cung cấp"}</p>
        <p><strong>Địa chỉ:</strong> {user.address || "Chưa cung cấp"}</p>
        <p><strong>Vai trò:</strong> {user.role === "ADMIN" ? "Quản trị viên" : "Người dùng"}</p>
        <p><strong>Ngày tạo tài khoản:</strong> {new Date(user.createdAt).toLocaleString("vi-VN")}</p>
      </div>
    </main>
  );
}
