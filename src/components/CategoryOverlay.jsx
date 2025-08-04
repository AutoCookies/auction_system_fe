"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ dùng đúng module
import { handleGetAllCategory } from "@/utils/category/handleGetAllCategory";
import styles from "@/styles/components/categoryOverlay.module.css";

export default function CategoryOverlay({ onClose }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter(); // ✅ khởi tạo router

    useEffect(() => {
        async function fetch() {
            const res = await handleGetAllCategory();
            if (res.success && Array.isArray(res.categories)) {
                setCategories(res.categories);
            } else {
                setCategories([]);
            }
            setLoading(false);
        }
        fetch();
    }, []);

    const handleClickCategory = (categoryId) => {
        router.push(`/home/${categoryId}`); // ✅ chuyển route
        onClose(); // đóng overlay nếu cần
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.content}>
                <button className={styles.closeBtn} onClick={onClose}>×</button>
                <h2 className={styles.title}>Danh Mục Sản Phẩm</h2>
                {loading ? (
                    <p>Đang tải...</p>
                ) : (
                    <ul className={styles.categoryList}>
                        {categories.map((cat) => (
                            <li
                                key={cat._id}
                                className={styles.categoryItem}
                                onClick={() => handleClickCategory(cat._id)}
                            >
                                <h3>{cat.name}</h3>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
