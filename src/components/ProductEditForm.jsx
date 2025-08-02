"use client";

import React, { useState } from "react";
import { handleUpdateProduct } from "@/utils/product/handleUpdateProduct";
import styles from "@/styles/components/ProductEditForm.module.css";

export default function ProductEditForm({ product, onClose, onUpdated }) {
    const [form, setForm] = useState({
        name: product.name,
        price: product.price,
        description: product.description,
        _id: product._id,
    });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState("");

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async () => {
        setSaving(true);
        const result = await handleUpdateProduct(form);
        setSaving(false);

        if (result.success) {
            setMsg("✅ Cập nhật thành công!");
            onUpdated(result.data); // Cập nhật lại state ở cha
        } else {
            setMsg(result.message || "❌ Lỗi khi cập nhật");
        }
    };

    return (
        <div className={styles.formWrapper}>
            <h3>Chỉnh sửa sản phẩm</h3>

            <label>Tên sản phẩm:</label>
            <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={styles.inputField}
            />

            <label>Giá:</label>
            <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className={styles.inputField}
            />

            <label>Mô tả:</label>
            <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className={styles.inputField}
            />

            <div className={styles.actions}>
                <button onClick={handleSubmit} disabled={saving} className={styles.button}>
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>

                <button onClick={onClose} className={styles.button}>Huỷ</button>
            </div>

            {msg && <p className={styles.message}>{msg}</p>}
        </div>
    );
}
