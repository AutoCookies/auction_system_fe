"use client";
import React, { useState, useEffect } from "react";
import { handleCreateAuctionDetails } from "@/utils/auction/handleCreateAuctionDetails";
import { handleGetAllProduct } from "@/utils/product/handleGetAllProduct.js";

export default function CreateAuctionDetailForm({ sessionId, onSuccess, onClose }) {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productId: "",
    startingPrice: "",
    bidStep: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      const res = await handleGetAllProduct(); // cần viết hàm này để lấy danh sách sản phẩm
      if (res.success) {
        setProducts(res.data);
      }
    }
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await handleCreateAuctionDetails({
      auctionSessionId: sessionId,
      ...formData
    });
    setLoading(false);

    if (res.success) {
      alert("Tạo thành công!");
      onSuccess();
    } else {
      setErrorMsg(res.message || "Tạo thất bại");
    }
  };

  return (
    <div style={{ background: "#fff", padding: 20, borderRadius: 8 }}>
      <h3>Thêm chi tiết phiên đấu giá</h3>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Sản phẩm</label>
          <select name="productId" onChange={handleChange} required>
            <option value="">-- Chọn sản phẩm --</option>
            {products.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Giá khởi điểm</label>
          <input type="number" name="startingPrice" onChange={handleChange} required />
        </div>
        <div>
          <label>Bước giá</label>
          <input type="number" name="bidStep" onChange={handleChange} required />
        </div>
        <div>
          <label>Ngày kết thúc</label>
          <input type="datetime-local" name="endDate" onChange={handleChange} required />
        </div>
        <div style={{ marginTop: 10 }}>
          <button type="submit" disabled={loading}>Tạo</button>
          <button type="button" onClick={onClose} style={{ marginLeft: 10 }}>Huỷ</button>
        </div>
      </form>
    </div>
  );
}
