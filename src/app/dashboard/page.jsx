"use client";

import React, { useEffect, useState } from "react";
import { handleGetAllAuctionSession } from "@/utils/auction/handleGetAllAuctionSession";
import styles from "@/styles/dashboard/page.module.css";
import CreateAuctionSessionForm from "@/components/CreateAuctionSessionForm";
import AuctionDetails from "@/components/AuctionDetails";
import handleDeleteAuctionSession from "@/utils/auction/handleDeleteAuctionSession";
import UpdateAuctionSessionForm from "@/components/UpdateAuctionSessionForm";

export default function AdminDashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [detailMode, setDetailMode] = useState(false);


  const handleOpenDetails = (session) => {
    setSelectedSession(session);
    setDetailMode(true);
  };

  const fetchSessions = async (pageToFetch = page) => {
    setLoading(true);
    const res = await handleGetAllAuctionSession({ page: pageToFetch });

    if (res.success) {
      setSessions(res.data || []);
      setTotalPages(res.totalNoPage || 1);
      setErrorMsg("");
    } else {
      setErrorMsg(res.message || "Lỗi khi tải phiên đấu giá");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, [page]);

  const handleCloseForm = () => {
    setShowCreateForm(false);
  };

  const handleSuccessCreate = () => {
    handleCloseForm();
    fetchSessions(1);
    setPage(1);
  };

  return (
    <main className={styles.wrapper}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Danh sách phiên đấu giá</h1>
        <div className={styles.buttonGroup}>
          <button className={styles.createButton} onClick={() => setShowCreateForm(true)}>
            + Tạo Buổi Đấu Giá
          </button>
        </div>
      </div>

      {showCreateForm && (
        <div className={styles.popupWrapper}>
          <div className={styles.popupContainer}>
            <CreateAuctionSessionForm onClose={handleCloseForm} onSuccess={handleSuccessCreate} />
          </div>
        </div>
      )}

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

            const handleDelete = async (e) => {
              e.stopPropagation(); // Không trigger mở chi tiết
              const confirm = window.confirm(`Xác nhận xóa phiên "${session.name}"?`);
              if (!confirm) return;

              const res = await handleDeleteAuctionSession(session._id);
              if (res.success) {
                alert("Xóa thành công");
                fetchSessions(1);
                setPage(1);
              } else {
                alert(`Lỗi: ${res.message}`);
              }
            };

            return (
              <li key={session._id} className={styles.item} style={{ cursor: "pointer" }} onClick={() => handleOpenDetails(session)}>
                <div className={styles.itemHeader}>
                  <h3>{session.name}</h3>
                  <button
                    className={styles.deleteButton}
                    onClick={async (e) => {
                      e.stopPropagation();
                      const confirm = window.confirm(`Xác nhận xóa phiên "${session.name}"?`);
                      if (!confirm) return;

                      const res = await handleDeleteAuctionSession(session._id);
                      if (res.success) {
                        alert("Xóa thành công");
                        fetchSessions(1);
                        setPage(1);
                      } else {
                        alert(`Lỗi: ${res.message}`);
                      }
                    }}
                  >
                    Xóa
                  </button>

                  <button
                    className={styles.updateButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSession(session);
                      setDetailMode(false); // 🛑 không bật chi tiết
                      setShowUpdateForm(true);
                    }}
                    onClose={() => {
                      setShowUpdateForm(false);
                      setDetailMode(false);
                    }}
                  >
                    Sửa
                  </button>
                </div>
                <p><strong>Bắt đầu:</strong> {start}</p>
                <p><strong>Kết thúc:</strong> {end}</p>
              </li>
            );
          })}
        </ul>
      )}

      {/* ✅ Mở popup khi chọn một session */}
      {selectedSession && detailMode && (
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <button className={styles.closeButton} onClick={() => {
              setSelectedSession(null);
              setDetailMode(false);
            }}>
              ×
            </button>
            <h2 className={styles.popupTitle}>{selectedSession.name}</h2>
            <AuctionDetails
              sessionId={selectedSession._id}
              description={selectedSession.description}
              productId={selectedSession.productId}
              startingPrice={selectedSession.startingPrice}
              winnerId={selectedSession.winnerId} // Thêm prop winnerId
            />
          </div>
        </div>
      )}
      {
        showUpdateForm && selectedSession && (
          <div className={styles.popupWrapper}>
            <div className={styles.popupContainer}>
              <UpdateAuctionSessionForm
                initialData={selectedSession}
                onClose={() => setShowUpdateForm(false)}
                onSuccess={() => {
                  setShowUpdateForm(false);
                  fetchSessions(1);
                  setPage(1);
                }}
              />
            </div>
          </div>
        )
      }

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
