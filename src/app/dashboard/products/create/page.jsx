"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/dashboard/products/create/page.module.css";
import { handleCreateProduct } from "@/utils/product/handleCreateProduct";
import { handleGetAllCategories } from "@/utils/categories/handleGetAllCategories"; // ✅ import mới

export default function CreateProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    image: "",
    categoryId: "",
    price: "",
    description: "",
  });

  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Lấy categories từ API
  useEffect(() => {
    const fetchCategories = async () => {
      const result = await handleGetAllCategories();
      if (result.success) {
        setCategories(result.data);
      } else {
        console.error(result.message);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const payload = {
      ...form,
      price: Number(form.price),
      discount: Number(form.discount),
    };

    const result = await handleCreateProduct(payload);

    if (result.success) {
      setSuccessMsg("✅ Tạo sản phẩm thành công!");
      setTimeout(() => router.push("/products"), 1500);
    } else {
      setErrorMsg(result.message || "❌ Lỗi khi tạo sản phẩm.");
    }

    setLoading(false);
  };

  return (
    <main className={styles.wrapper}>
      <h1 className={styles.title}>Tạo sản phẩm mới</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Tên sản phẩm:
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Hình ảnh (tải lên):
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ width: "150px", marginTop: "10px" }}
            />
          )}
        </label>

        <label>
          Danh mục:
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Giá (VND):
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Mô tả:
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Đang tạo..." : "Tạo sản phẩm"}
        </button>

        {successMsg && <p className={styles.success}>{successMsg}</p>}
        {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      </form>
    </main>
  );
}
