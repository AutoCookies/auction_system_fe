"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handleGetAllAuctionSession } from "@/utils/auction/handleGetAllAuctionSession";
import styles from "@/styles/home/page.module.css";

export default function AdminDashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      const res = await handleGetAllAuctionSession({ page });

      if (res.success) {
        setSessions(res.data || []);
        setTotalPages(res.totalNoPage || 1);
        setErrorMsg("");
      } else {
        setErrorMsg(res.message || "Lỗi khi tải phiên đấu giá");
      }

      setLoading(false);
    };

    fetchSessions();
  }, [page]);

  return (
    <main className={styles.wrapper}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Danh sách phiên đấu giá</h1>
        <div className={styles.buttonGroup}>
          <button
            className={styles.createButton}
            onClick={() => router.push("/dashboard/create-auction")}
          >
            + Tạo Buổi Đấu Giá
          </button>
        </div>
      </div>

      {loading ? (
        <p className={styles.loading}>Đang tải dữ liệu...</p>
      ) : errorMsg ? (
        <p className={styles.error}>{errorMsg}</p>
      ) : sessions.length === 0 ? (
        <p className={styles.empty}>Không có phiên đấu giá nào.</p>
      ) : (
        <ul className={styles.list}>
          {sessions.map((session) => (
            <li key={session._id} className={styles.item}>
              <h3>{session.sessionCode}</h3>
              <p>
                <strong>Thời gian:</strong>{" "}
                {new Date(session.timeAuction).toLocaleString()}
              </p>
              <p>
                <strong>Trạng thái:</strong> {session.status}
              </p>
              {session.auctionDetail && (
                <>
                  <p>
                    <strong>Giá khởi điểm:</strong> {session.auctionDetail.startPrice}
                  </p>
                  <p>
                    <strong>Kết thúc:</strong>{" "}
                    {new Date(session.auctionDetail.endDate).toLocaleString()}
                  </p>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            disabled={page === i + 1}
            className={`${styles.pageButton} ${page === i + 1 ? styles.activePage : ""}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </main>
  );
}
