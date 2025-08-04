"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { handleGetAllProducts } from "@/utils/product/handleGetAllProduct.js";
import styles from "@/styles/dashboard/products/page.module.css";
import ProductDetail from "@/components/ProductDetail";

export default function ProductListPage() {
  const [allProducts, setAllProducts] = useState([]); // 👉 chứa toàn bộ
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();

  // 🔍 Lọc sản phẩm theo tên (frontend)
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allProducts]);

  const handleProductUpdated = (updatedProduct) => {
    setAllProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
  };

  const handleProductDeleted = (deletedProductId) => {
    setAllProducts((prev) => prev.filter((p) => p._id !== deletedProductId));
    setSelectedProductId(null);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const result = await handleGetAllProducts({ page: 1, limit: 1000 }); // tải nhiều lên để lọc frontend

      if (result.success) {
        setAllProducts(result.data || []);
        setErrorMsg("");
      } else {
        setErrorMsg(result.message || "Lỗi khi tải sản phẩm");
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <main className={styles.wrapper}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm theo tên..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

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
      ) : filteredProducts.length === 0 ? (
        <p className={styles.empty}>Không tìm thấy sản phẩm phù hợp.</p>
      ) : (
        <ul className={styles.list}>
          {filteredProducts.map((product) => (
            <li
              key={product._id}
              className={styles.item}
              onClick={() => setSelectedProductId(product._id)}
              style={{ cursor: "pointer" }}
            >
              <h3>{product.name}</h3>
              <p><strong>Giá:</strong> {product.price.toLocaleString()}đ</p>
              <p><strong>Mô tả:</strong> {product.description}</p>
            </li>
          ))}
        </ul>
      )}

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
