"use client";

import React, { useEffect, useState } from "react";
import { handleGetProductDetail } from "@/utils/product/handleGetProductDetail";
import { handleGetCategoryById } from "@/utils/categories/handleGetCategoryById";
import ProductEditForm from "./ProductEditForm";
import styles from "@/styles/components/ProductDetail.module.css";
import { handleDeleteProduct } from "@/utils/product/handleDeleteProduct";

export default function ProductDetail({ productId, onClose, onDeleted, onUpdated }) {
    const [product, setProduct] = useState(null);
    const [categoryName, setCategoryName] = useState("");
    const [error, setError] = useState("");
    const [showEdit, setShowEdit] = useState(false);

    const fetchDetail = async () => {
        const res = await handleGetProductDetail(productId);
        if (res.success) {
            setProduct(res.data);
            setError("");

            const categoryId = res.data.categoryId;
            if (categoryId) {
                const catRes = await handleGetCategoryById(categoryId);
                setCategoryName(catRes.success ? catRes.data.name : "Không xác định");
            }
        } else {
            setError(res.message || "Lỗi khi lấy chi tiết sản phẩm");
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
        if (!confirmDelete) return;

        const result = await handleDeleteProduct(productId);

        if (result.success) {
            alert("✅ " + result.message);
            if (typeof onDeleted === "function") {
                onDeleted(productId); // Gọi hàm xoá bên ngoài
            }
            onClose(); // Đóng modal
        }
    };


    useEffect(() => {
        if (productId) fetchDetail();
    }, [productId]);

    if (!productId) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>✖</button>

                {error && <p style={{ color: "red" }}>{error}</p>}

                {!product ? (
                    <p>Đang tải...</p>
                ) : (
                    <>
                        <h2 className={styles.title}>{product.name}</h2>
                        <p className={styles.text}><strong>Giá:</strong> {product.price.toLocaleString()}đ</p>
                        <p className={styles.text}><strong>Mô tả:</strong> {product.description}</p>
                        <p className={styles.text}><strong>Danh mục:</strong> {categoryName}</p>
                        {product.image?.[0] && (
                            <img
                                src={product.image[0]}
                                alt={product.name}
                                className={styles.image}
                            />
                        )}

                        <button onClick={() => setShowEdit(true)} className={styles.editButton}>
                            Cập nhật thông tin
                        </button>

                        <button onClick={handleDelete} className={styles.deleteButton}>
                            🗑 Xóa sản phẩm
                        </button>


                        {showEdit && (
                            <ProductEditForm
                                product={product}
                                onClose={() => setShowEdit(false)}
                                onUpdated={(updatedProduct) => {
                                    fetchDetail();
                                    setShowEdit(false);

                                    if (typeof onUpdated === "function") {
                                        onUpdated(updatedProduct);
                                    }
                                }}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
