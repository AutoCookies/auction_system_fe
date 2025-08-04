"use client";

import React, { useEffect, useState } from "react";
import { handleGetProductDetail } from "@/utils/product/handleGetProductDetail";
import { handleGetLatestBid } from "@/utils/bid/handleGetLatestBid";
import { handleGetUserById } from "@/utils/users/handleGetUserById";
import styles from "@/styles/components/AuctionDetails.module.css";
import { io } from "socket.io-client";
import ENVARS from "@/config/env";

// ⚠️ Kết nối socket backend
const socket = io(ENVARS.API_URL);

export default function AuctionDetails({ sessionId, description, productId, startingPrice, winnerId }) {
  const [product, setProduct] = useState(null);
  const [latestBid, setLatestBid] = useState(null);
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // 🔍 Lấy thông tin sản phẩm
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

  // 🔍 Lấy giá đấu mới nhất khi load
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

  // 🔁 Lắng nghe bid mới qua socket
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

  // 🔁 Lắng nghe sự kiện phiên đấu kết thúc
  useEffect(() => {
    if (!sessionId) return;

    const handleAuctionEnded = async ({ sessionId: endedId, winnerId, finalPrice }) => {
      if (endedId !== sessionId) return;

      setLatestBid({ bidAmount: finalPrice });

      if (winnerId) {
        const res = await handleGetUserById(winnerId);
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

  // 🧠 Nếu đã có winnerId từ props => fetch
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
      )}
    </div>
  );
}
