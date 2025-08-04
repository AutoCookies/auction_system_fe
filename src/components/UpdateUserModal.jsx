"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/components/updateUserModal.module.css";
import { handleGetUserById } from "@/utils/users/handleGetUserById";
import { handleUpdateUser } from "@/utils/users/handleUpdateUsers";

export default function UpdateUserModal({ userId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    role: "USER",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState(""); // Thêm confirmPassword
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const res = await handleGetUserById(userId);
      if (res.success) {
        const { name, email, mobile, address, role } = res.user;
        setFormData({
          name,
          email,
          mobile: mobile || "",
          address: address || "",
          role,
          password: "",
        });
      } else {
        setErrorMsg(res.message);
      }
      setLoading(false);
    }

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    // Kiểm tra mật khẩu nếu được nhập
    if (formData.password) {
      if (formData.password.length < 6) {
        setErrorMsg("Mật khẩu phải có ít nhất 6 ký tự");
        setSaving(false);
        return;
      }

      if (formData.password !== confirmPassword) {
        setErrorMsg("Mật khẩu nhập lại không khớp");
        setSaving(false);
        return;
      }
    }

    const res = await handleUpdateUser(userId, formData);
    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg(res.message);
    }
    setSaving(false);
  };

  if (loading) return <div className={styles.modal}>Đang tải thông tin...</div>;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Chỉnh sửa người dùng</h2>
        {errorMsg && <p className={styles.error}>{errorMsg}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Họ tên:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Số điện thoại:
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Địa chỉ:
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Vai trò:
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>

          {/* Mật khẩu mới */}
          <label className={styles.label}>
            Mật khẩu mới (để trống nếu không thay đổi):
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.9em",
                  color: "#0070f3",
                }}
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>
          </label>

          {/* Xác nhận mật khẩu */}
          {formData.password && (
            <label className={styles.label}>
              Nhập lại mật khẩu:
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
              />
            </label>
          )}

          <div className={styles.buttons}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={saving}
            >
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
