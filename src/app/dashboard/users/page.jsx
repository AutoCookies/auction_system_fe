"use client";

import { useEffect, useState } from "react";
import { handleGetAllUsers } from "@/utils/users/handleGetAllUsers";
import styles from "@/styles/dashboard/users/page.module.css";
import UpdateUserModal from "@/components/UpdateUserModal"; // Import component modal
import { handleDeleteUser } from "@/utils/users/handleDeleteUser";

export default function UserListPage() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);

    async function fetchUsers() {
        const res = await handleGetAllUsers();
        if (res.success) {
            setUsers(res.users);
            setFilteredUsers(res.users);
        } else {
            setErrorMsg(res.message);
        }
        setLoading(false);
    }

    async function handleDelete(userId) {
        const confirmDelete = window.confirm("Bạn có chắc muốn xóa người dùng này?");
        if (!confirmDelete) return;

        const res = await handleDeleteUser(userId);
        if (res.success) {
            alert("Xóa người dùng thành công");
            fetchUsers(); // Cập nhật danh sách
        } else {
            alert(`Xóa thất bại: ${res.message}`);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const keyword = search.toLowerCase();
        const filtered = users.filter(
            (user) =>
                user.name.toLowerCase().includes(keyword) ||
                user.email.toLowerCase().includes(keyword)
        );
        setFilteredUsers(filtered);
    }, [search, users]);

    if (loading) return <p className={styles.loading}>Đang tải người dùng...</p>;
    if (errorMsg) return <p className={styles.error}>{errorMsg}</p>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Danh sách người dùng</h1>

            <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                className={styles.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Địa chỉ</th>
                        <th>Vai trò</th>
                        <th>Ngày tạo</th>
                        <th>Sửa</th>
                        <th>Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.mobile || "Chưa có"}</td>
                            <td>{user.address || "Chưa có"}</td>
                            <td className={user.role === "ADMIN" ? styles.adminRole : ""}>
                                {user.role}
                            </td>
                            <td>{new Date(user.createdAt).toLocaleString("vi-VN")}</td>
                            <td>
                                <button
                                    className={styles.editButton}
                                    onClick={() => setSelectedUserId(user._id)}
                                >
                                    Sửa
                                </button>
                            </td>
                            <td>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDelete(user._id)}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedUserId && (
                <UpdateUserModal
                    userId={selectedUserId}
                    onClose={() => setSelectedUserId(null)}
                    onSuccess={() => {
                        setSelectedUserId(null);
                        fetchUsers(); // refresh lại danh sách
                    }}
                />
            )}
        </div>
    );
}
