"use client";

import React, { useEffect, useState } from "react";
import { handleGetAllCategories } from "@/utils/categories/handleGetAllCategories";
import { handleDeleteCategory } from "@/utils/categories/handleDeleteCategory";
import { handleUpdateCategory } from "@/utils/categories/handleUpdateCategory";
import styles from "@/styles/dashboard/categories/page.module.css";
import CreateCategoryForm from "@/components/CreateCategoryForm";

export default function CategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ new

  const fetchCategories = async () => {
    setLoading(true);
    const res = await handleGetAllCategories();

    if (res.success) {
      setCategories(res.data);
    } else {
      setErrorMsg(res.message || "Không thể tải danh mục.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddButtonClick = () => {
    setSuccessMsg("");
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xoá danh mục này?");
    if (!confirm) return;

    const res = await handleDeleteCategory(id);
    if (res.success) {
      setSuccessMsg("🗑️ Xoá danh mục thành công!");
      setErrorMsg("");
      fetchCategories();
    } else {
      setErrorMsg(res.message || "❌ Xoá thất bại.");
      setSuccessMsg("");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory({ ...category });
  };

  const handleEditChange = (e) => {
    setEditingCategory((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    if (!editingCategory.name) {
      setErrorMsg("Tên danh mục không được để trống.");
      return;
    }

    const res = await handleUpdateCategory({
      _id: editingCategory._id,
      name: editingCategory.name,
      description: editingCategory.description,
    });

    if (res.success) {
      setSuccessMsg("✏️ Cập nhật thành công!");
      setErrorMsg("");
      setEditingCategory(null);
      fetchCategories();
    } else {
      setErrorMsg(res.message || "❌ Cập nhật thất bại.");
      setSuccessMsg("");
    }
  };

  // ✅ Lọc danh mục dựa trên searchTerm
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>Danh sách danh mục</h1>
        <button className={styles.addButton} onClick={handleAddButtonClick}>
          + Thêm danh mục
        </button>
      </div>

      {/* ✅ Thanh tìm kiếm */}
      <input
        type="text"
        placeholder="🔍 Tìm kiếm theo tên..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      {showForm && (
        <CreateCategoryForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setSuccessMsg("✅ Tạo danh mục thành công!");
            fetchCategories();
          }}
        />
      )}

      {loading ? (
        <p className={styles.loading}>⏳ Đang tải...</p>
      ) : errorMsg ? (
        <p className={styles.error}>{errorMsg}</p>
      ) : (
        <>
          {successMsg && <p className={styles.success}>{successMsg}</p>}
          {filteredCategories.length === 0 ? (
            <p className={styles.empty}>Không có danh mục phù hợp.</p>
          ) : (
            <ul className={styles.list}>
              {filteredCategories.map((category) => (
                <li key={category._id} className={styles.item}>
                  {editingCategory?._id === category._id ? (
                    <div className={styles.itemContent}>
                      <input
                        name="name"
                        value={editingCategory.name}
                        onChange={handleEditChange}
                        className={styles.input}
                      />
                      <textarea
                        name="description"
                        value={editingCategory.description}
                        onChange={handleEditChange}
                        className={styles.textarea}
                      />
                      <button
                        className={styles.saveButton}
                        onClick={handleUpdate}
                      >
                        💾
                      </button>
                      <button
                        className={styles.cancelButton}
                        onClick={() => setEditingCategory(null)}
                      >
                        ❌
                      </button>
                    </div>
                  ) : (
                    <div className={styles.itemContent}>
                      <div>
                        <h3>{category.name}</h3>
                        <p>{category.description || "Không có mô tả"}</p>
                      </div>
                      <div>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEdit(category)}
                        >
                          ✏️
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(category._id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
