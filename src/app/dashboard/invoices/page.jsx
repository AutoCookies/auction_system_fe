"use client";

import React, { useEffect, useState } from "react";
import { handleGetAllInvoice } from "@/utils/invoice/handleGetAllInvoice";
import { handleGetAllPendingInvoice } from "@/utils/invoice/handleGetAllPendingInvoice";
import { handleGetAllPaidInvoice } from "@/utils/invoice/handleGetAllPaidInvoice";
import styles from "@/styles/home/invoices/page.module.css";
import InvoiceDetails from "@/components/InvoiceDetails";

export default function InvoicePage() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        async function fetchInvoices() {
            try {
                let data = [];

                if (filter === "all") {
                    data = await handleGetAllInvoice();
                } else if (filter === "pending") {
                    data = await handleGetAllPendingInvoice();
                } else if (filter === "paid") {
                    data = await handleGetAllPaidInvoice();
                }

                if (Array.isArray(data)) {
                    setInvoices(data);
                } else {
                    console.error("Không thể lấy hóa đơn");
                }
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        }

        fetchInvoices();
    }, [filter]);

    if (loading) return <p>Đang tải hóa đơn...</p>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Quản lý Hóa đơn</h1>

            <div className={styles.filterButtons}>
                <button
                    className={filter === "all" ? styles.active : ""}
                    onClick={() => setFilter("all")}
                >
                    Tất cả
                </button>
                <button
                    className={filter === "pending" ? styles.active : ""}
                    onClick={() => setFilter("pending")}
                >
                    Chờ thanh toán
                </button>
                <button
                    className={filter === "paid" ? styles.active : ""}
                    onClick={() => setFilter("paid")}
                >
                    Đã thanh toán
                </button>
            </div>

            {invoices.length === 0 ? (
                <p>Không có hóa đơn nào.</p>
            ) : (
                <div className={styles.list}>
                    {invoices.map((invoice) => (
                        <div
                            key={invoice._id}
                            className={styles.invoiceCard}
                            onClick={() => setSelectedInvoice(invoice)}
                        >
                            <h3>{invoice.auctionSessionId?.name || "Phiên không xác định"}</h3>
                            <p><strong>Sản phẩm:</strong> {invoice.productId?.name}</p>
                            <p><strong>Giá trúng:</strong> {invoice.bidAmount.toLocaleString()}đ</p>
                            <p><strong>Thời gian phát hành:</strong> {new Date(invoice.issuedAt).toLocaleString()}</p>
                            <p><strong>Trạng thái:</strong> <span className={styles[invoice.status.toLowerCase()]}>{invoice.status}</span></p>
                        </div>
                    ))}
                </div>
            )}

            {selectedInvoice && (
                <InvoiceDetails
                    invoice={selectedInvoice}
                    onClose={() => setSelectedInvoice(null)}
                />
            )}
        </div>
    );
}
