"use client";

import React, { useEffect, useState } from "react";
import { handleUpdateAuctionSession } from "@/utils/auction/handleUpdateAuctionSession";
import { handleGetAllProducts } from "@/utils/product/handleGetAllProduct";
import styles from "@/styles/components/CreateAuctionSessionForm.module.css";

export default function UpdateAuctionSessionForm({ initialData, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [timeAuction, setTimeAuction] = useState("");
  const [productId, setProductId] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [endDate, setEndDate] = useState("");

  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      const res = await handleGetAllProducts({ limit: 1000 });
      if (res.success) setProducts(res.data);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setTimeAuction(initialData.timeAuction?.slice(0, 16) || "");
      setProductId(initialData.productId || "");
      setStartingPrice(initialData.startingPrice || "");
      setEndDate(initialData.endDate?.slice(0, 16) || "");
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    const updateData = {
      name,
      description,
      timeAuction,
      productId,
      startingPrice: Number(startingPrice),
      endDate,
    };

    const res = await handleUpdateAuctionSession(initialData._id, updateData);
    setLoading(false);

    if (!res.success) {
      setError("Cập nhật phiên đấu giá thất bại: " + (res.message || ""));
    } else {
      setSuccessMsg("Cập nhật phiên đấu giá thành công!");
      onSuccess?.(); // reload danh sách
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Cập nhật phiên đấu giá</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Tên phiên:
          <input
            type="text"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

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
          Thời gian bắt đầu:
          <input
            type="datetime-local"
            className={styles.input}
            value={timeAuction}
            onChange={(e) => setTimeAuction(e.target.value)}
            required
          />
        </label>

        <label className={styles.label}>
          Sản phẩm:
          <select
            className={styles.input}
            value={productId}
            onChange={(e) => {
              const selectedId = e.target.value;
              setProductId(selectedId);
              const selectedProduct = products.find((p) => p._id === selectedId);
              if (selectedProduct?.price != null) {
                setStartingPrice(selectedProduct.price);
              }
            }}
            required
          >
            <option value="">-- Chọn sản phẩm --</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.label}>
          Giá khởi điểm:
          <input
            type="number"
            className={styles.input}
            value={startingPrice}
            onChange={(e) => setStartingPrice(e.target.value)}
            required
          />
        </label>

        <label className={styles.label}>
          Ngày kết thúc:
          <input
            type="datetime-local"
            className={styles.input}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </label>

        <div className={styles.buttonRow}>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Đang cập nhật..." : "Cập nhật"}
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
