"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { handleGetAuctionSessionsByCategory } from "@/utils/auction/handleGetAuctionSessionByCategory.js";
import styles from "@/styles/home/page.module.css";
import AuctionDetailsUser from "@/components/AuctionDetailsUser";

export default function AuctionByCategoryPage() {
  const { categoryId } = useParams();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);
  const [countdowns, setCountdowns] = useState({});

  const handleOpenDetails = (session) => {
    setSelectedSession(session);
  };

  const getTimeLeftString = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) return { text: "Đã kết thúc", status: "expired" };

    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / 1000 / 60) % 60;
    const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
    const days = Math.floor(diff / 1000 / 60 / 60 / 24);

    const totalMinutesLeft = Math.floor(diff / 1000 / 60);

    let status = "running";
    if (totalMinutesLeft <= 30) status = "warning";

    return {
      text: `${days}d ${hours}h ${minutes}m ${seconds}s`,
      status,
    };
  };

  const fetchSessions = async () => {
    setLoading(true);
    const res = await handleGetAuctionSessionsByCategory(categoryId);
    if (res.success) {
      setSessions(res.sessions || []);
      setErrorMsg("");
    } else {
      setErrorMsg(res.message || "Lỗi khi tải phiên đấu giá");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (categoryId) fetchSessions();
  }, [categoryId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns = {};
      sessions.forEach((session) => {
        newCountdowns[session._id] = getTimeLeftString(session.endDate);
      });
      setCountdowns(newCountdowns);
    }, 1000);
    return () => clearInterval(interval);
  }, [sessions]);

  return (
    <main className={styles.wrapper}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Phiên đấu giá theo danh mục</h1>
      </div>

      {loading ? (
        <p className={styles.loading}>Đang tải dữ liệu...</p>
      ) : errorMsg ? (
        <p className={styles.error}>{errorMsg}</p>
      ) : sessions.length === 0 ? (
        <p className={styles.empty}>Không có phiên đấu giá nào.</p>
      ) : (
        <ul className={styles.list}>
          {sessions.map((session) => {
            const start = new Date(session.timeAuction).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            const end = new Date(session.endDate).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <li
                key={session._id}
                className={styles.item}
                style={{ cursor: "pointer" }}
                onClick={() => handleOpenDetails(session)}
              >
                <div className={styles.itemHeader}>
                  <h3>{session.name}</h3>
                </div>
                <p><strong>Bắt đầu:</strong> {start}</p>
                <p><strong>Kết thúc:</strong> {end}</p>
                <p>
                  <strong>Thời gian còn lại:</strong>{" "}
                  <span
                    className={
                      countdowns[session._id]?.status === "expired"
                        ? styles.expired
                        : countdowns[session._id]?.status === "warning"
                        ? styles.warning
                        : styles.running
                    }
                  >
                    {countdowns[session._id]?.text || "..."}
                  </span>
                </p>
              </li>
            );
          })}
        </ul>
      )}

      {selectedSession && (
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <button
              className={styles.closeButton}
              onClick={() => setSelectedSession(null)}
            >
              ×
            </button>
            <h2 className={styles.popupTitle}>{selectedSession.name}</h2>
            <AuctionDetailsUser
              sessionId={selectedSession._id}
              description={selectedSession.description}
              productId={selectedSession.productId}
              startingPrice={selectedSession.startingPrice}
            />
          </div>
        </div>
      )}
    </main>
  );
}
