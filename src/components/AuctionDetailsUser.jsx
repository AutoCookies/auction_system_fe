"use client";

import React, { useEffect, useState } from "react";
import { handleGetProductDetail } from "@/utils/product/handleGetProductDetail";
import { handleGetLatestBid } from "@/utils/bid/handleGetLatestBid";
import styles from "@/styles/components/AuctionDetailsUser.module.css";
import { io } from "socket.io-client";
import { handleCreateBid } from "@/utils/bid/handleCreateBid";
import ENVARS from "@/config/env";
import { handleGetUserById } from "@/utils/users/handleGetUserById";

// ⚠️ Kết nối socket backend
const socket = io(ENVARS.API_URL);

export default function AuctionDetailsUser({ sessionId, description, productId, startingPrice, winnerId }) {
  const [product, setProduct] = useState(null);
  const [latestBid, setLatestBid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [winner, setWinner] = useState(null);

  // 🧠 Đặt giá
  const handleSubmitBid = async () => {
    setSubmitError("");
    setSubmitSuccess("");

    const bidValue = parseInt(bidAmount);
    const currentPrice = latestBid?.bidAmount || startingPrice;

    if (isNaN(bidValue) || bidValue <= currentPrice) {
      setSubmitError(`Giá đấu phải lớn hơn ${currentPrice} VND`);
      return;
    }

    const res = await handleCreateBid({ auctionSessionId: sessionId, amount: bidValue });

    if (res.success) {
      setSubmitSuccess("✅ Đặt giá thành công!");
      setBidAmount("");
    } else {
      setSubmitError(res.message || "❌ Đặt giá thất bại");
    }
  };

  // 1️⃣ Lấy thông tin sản phẩm
  useEffect(() => {
    if (!productId) return;

    async function fetchProduct() {
      setLoading(true);
      const res = await handleGetProductDetail(productId);

      if (res.success) {
        setProduct(res.data);
        setErrorMsg("");
      } else {
        setProduct(null);
        setErrorMsg(res.message || "Không thể lấy thông tin sản phẩm");
      }

      setLoading(false);
    }

    fetchProduct();
  }, [productId]);

  // 2️⃣ Lấy giá đấu mới nhất ban đầu
  useEffect(() => {
    if (!sessionId) return;

    async function fetchLatestBid() {
      const res = await handleGetLatestBid(sessionId);
      if (res.success) {
        setLatestBid(res.data);
      } else {
        console.warn("Không có bid mới:", res.message);
      }
    }

    fetchLatestBid();
  }, [sessionId]);

  // 3️⃣ Lắng nghe bid mới qua socket
  useEffect(() => {
    if (!sessionId) return;

    socket.emit("joinAuctionRoom", sessionId);

    const handleNewBid = (newBid) => {
      if (newBid.auctionSessionId === sessionId) {
        setLatestBid(newBid);
      }
    };

    socket.on("newBid", handleNewBid);

    return () => {
      socket.off("newBid", handleNewBid);
    };
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;

    const handleAuctionEnded = async ({ sessionId: endedId, winnerId, finalPrice }) => {
      if (endedId !== sessionId) return;

      setLatestBid({ bidAmount: finalPrice }); // Cập nhật giá chốt

      if (winnerId) {
        const res = await handleGetUserById(winnerId);
        console.log("Winner ID:", winnerId);
        if (res.success) {
          setWinner(res.user);
        } else {
          console.warn("Không thể lấy thông tin người thắng:", res.message);
        }
      }
    };

    socket.on("auctionEnded", handleAuctionEnded);

    return () => {
      socket.off("auctionEnded", handleAuctionEnded);
    };
  }, [sessionId]);

  useEffect(() => {
    if (!winnerId) return;

    async function fetchWinner() {
      const res = await handleGetUserById(winnerId);
      if (res.success) {
        setWinner(res.user);
      } else {
        console.warn("Không thể lấy thông tin người thắng:", res.message);
      }
    }

    fetchWinner();
  }, [winnerId]);

  return (
    <div className={styles.detailsContainer}>
      <p><strong>Mô tả phiên:</strong> {description || "Không có mô tả"}</p>

      {loading ? (
        <p>⏳ Đang tải thông tin sản phẩm...</p>
      ) : errorMsg ? (
        <p className={styles.error}>⚠️ {errorMsg}</p>
      ) : !product ? (
        <p><em>Sản phẩm không tồn tại.</em></p>
      ) : (
        <>
          <div className={styles.detailBox}>
            <p><strong>Sản phẩm:</strong> {product.name}</p>
            <p><strong>Giá khởi điểm:</strong> {startingPrice} VND</p>
            <p><strong>Giá hiện tại:</strong> {latestBid?.bidAmount || "Chưa có lượt đấu giá"} VND</p>

            {winner && (
              <p><strong>Người thắng:</strong> {winner.name || "Ẩn danh"}</p>
            )}

            {product.image?.[0] && (
              <img
                src={product.image[0]}
                alt={product.name}
                className={styles.productImage}
              />
            )}

            <p><strong>Mô tả sản phẩm:</strong> {product.description || "Không có mô tả"}</p>
          </div>

          <div className={styles.bidBox}>
            <h3>Đặt giá ngay</h3>
            <input
              type="number"
              placeholder="Nhập giá đấu (VND)"
              min={(latestBid?.bidAmount || startingPrice) + 1}
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className={styles.input}
            />
            <button onClick={handleSubmitBid} className={styles.submitButton}>
              Đặt giá
            </button>
            {submitError && <p className={styles.error}>{submitError}</p>}
            {submitSuccess && <p className={styles.success}>{submitSuccess}</p>}
          </div>
        </>
      )}
    </div>
  );
}
