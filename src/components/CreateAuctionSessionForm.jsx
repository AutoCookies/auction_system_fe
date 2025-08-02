"use client";

import React, { useState } from "react";
import { handleCreateAuctionSession } from "@/utils/auction/handleCreateAuction";
import styles from "@/styles/components/CreateAuctionSessionForm.module.css";

export default function CreateAuctionSessionForm({ onClose, onSuccess }) {
  const [description, setDescription] = useState("");
  const [timeAuction, setTimeAuction] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await handleCreateAuctionSession({ description, timeAuction });

    if (res.success) {
      setSuccessMsg("Tạo phiên đấu giá thành công!");
      setError("");
      onSuccess?.(); // reload hoặc ẩn form
    } else {
      setError(res.message || "Tạo thất bại");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Tạo phiên đấu giá</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Mô tả phiên:
          <input
            type="text"
            className={styles.input}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <label className={styles.label}>
          Thời gian:
          <input
            type="datetime-local"
            className={styles.input}
            value={timeAuction}
            onChange={(e) => setTimeAuction(e.target.value)}
            required
          />
        </label>

        <div className={styles.buttonRow}>
          <button type="submit" className={styles.submitButton}>
            Tạo
          </button>
          <button type="button" className={styles.cancelButton} onClick={onClose}>
            Thoát
          </button>
        </div>
      </form>

      {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
      {successMsg && <p className={`${styles.message} ${styles.success}`}>{successMsg}</p>}
    </div>
  );
}
