"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { handleCreateAuctionSession } from "@/utils/auction/handleCreateAuction.js";
import styles from "@/styles/dashboard/create-auction/page.module.css";

export default function CreateAuctionPage() {
  const router = useRouter();

  const [sessionCode, setSessionCode] = useState("");
  const [timeAuction, setTimeAuction] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMsg("Bạn chưa đăng nhập.");
      return;
    }

    if (!sessionCode || !timeAuction) {
      setErrorMsg("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setLoading(true);
    const res = await handleCreateAuctionSession({ sessionCode, timeAuction, token });

    if (res.success) {
      setSuccessMsg("Tạo phiên đấu giá thành công.");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } else {
      setErrorMsg(res.message || "Tạo phiên đấu giá thất bại.");
    }

    setLoading(false);
  };

  return (
    <main className={styles.wrapper}>
      <h1 className={styles.title}>Tạo Buổi Đấu Giá Mới</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Mã phiên đấu giá:
          <input
            type="text"
            value={sessionCode}
            onChange={(e) => setSessionCode(e.target.value)}
            className={styles.input}
            placeholder="VD: SESSION001"
            required
          />
        </label>

        <label className={styles.label}>
          Thời gian diễn ra:
          <input
            type="datetime-local"
            value={timeAuction}
            onChange={(e) => setTimeAuction(e.target.value)}
            className={styles.input}
            required
          />
        </label>

        {errorMsg && <p className={styles.error}>{errorMsg}</p>}
        {successMsg && <p className={styles.success}>{successMsg}</p>}

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? "Đang tạo..." : "Tạo phiên đấu giá"}
        </button>
      </form>
    </main>
  );
}
