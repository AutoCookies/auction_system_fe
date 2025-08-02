"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handleGetAllProducts } from "@/utils/product/handleGetAllProduct.js";
import styles from "@/styles/dashboard/products/page.module.css";
import ProductDetail from "@/components/ProductDetail";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const router = useRouter();

  const handleProductUpdated = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
  };

  const handleProductDeleted = (deletedProductId) => {
    setProducts((prev) => prev.filter((p) => p._id !== deletedProductId));
    setSelectedProductId(null); // Đóng ProductDetail
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const result = await handleGetAllProducts({ page, limit });

      if (result.success) {
        setProducts(result.data || []);
        setTotalPages(result.totalNoPage || 1);
        setErrorMsg("");
      } else {
        setErrorMsg(result.message || "Lỗi khi tải sản phẩm");
      }

      setLoading(false);
    };

    fetchProducts();
  }, [page]);

  return (
    <main className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>Danh sách sản phẩm</h1>
        <button
          className={styles.createButton}
          onClick={() => router.push("/dashboard/products/create")}
        >
          Tạo sản phẩm
        </button>
      </div>

      {loading ? (
        <p className={styles.loading}>Đang tải dữ liệu...</p>
      ) : errorMsg ? (
        <p className={styles.error}>{errorMsg}</p>
      ) : products.length === 0 ? (
        <p className={styles.empty}>Không có sản phẩm nào.</p>
      ) : (
        <ul className={styles.list}>
          {products.map((product) => (
            <li
              key={product._id}
              className={styles.item}
              onClick={() => setSelectedProductId(product._id)} // 👈 Bắt sự kiện click
              style={{ cursor: "pointer" }}
            >
              <h3>{product.name}</h3>
              <p><strong>Giá:</strong> {product.price.toLocaleString()}đ</p>
              <p><strong>Mô tả:</strong> {product.description}</p>
            </li>
          ))}
        </ul>
      )}

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
      {selectedProductId && (
        <ProductDetail
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
          onUpdated={handleProductUpdated}
          onDeleted={handleProductDeleted}
        />
      )}
    </main>
  );
}
