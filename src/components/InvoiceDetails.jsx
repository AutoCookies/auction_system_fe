// components/InvoiceDetails.jsx
import React from "react";
import styles from "@/styles/components/invoiceDetails.module.css";

export default function InvoiceDetails({ invoice, onClose }) {
  if (!invoice) return null;

  const {
    auctionSessionId,
    productId,
    bidAmount,
  } = invoice;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        <h2>Chi tiết hóa đơn</h2>

        <p><strong>Tên phiên:</strong> {auctionSessionId?.name || "Không xác định"}</p>

        {productId?.image?.[0] && (
          <img
            src={productId.image[0]}
            alt={productId.name}
            className={styles.image}
          />
        )}

        <p><strong>Ngày kết thúc:</strong> {new Date(auctionSessionId?.endDate).toLocaleString()}</p>
        <p><strong>Giá trúng:</strong> {bidAmount?.toLocaleString()}đ</p>

        <p><strong>Mô tả sản phẩm:</strong> {productId?.description || "Không có mô tả"}</p>
      </div>
    </div>
  );
}
