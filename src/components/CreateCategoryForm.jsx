"use client";

import React, { useState } from "react";
import styles from "@/styles/components/CreateCategoryForm.module.css";
import { handleCreateCategory } from "@/utils/categories/handleCreateCategory";

export default function CreateCategoryForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const res = await handleCreateCategory(formData);

    if (res.success) {
      onSuccess(res.data);
      onClose();
    } else {
      setErrorMsg(res.message || "❌ Lỗi khi tạo danh mục.");
    }

    setLoading(false);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>📝 Thêm danh mục</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tên danh mục"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Mô tả (tuỳ chọn)"
          />
          {errorMsg && <p className={styles.error}>{errorMsg}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
        </form>
      </div>
    </div>
  );
}
