"use client";

import React, { useEffect, useState } from "react";
import { handleGetAllMyInvoice } from "@/utils/invoice/handleGetAllMyInvoice";
import styles from "@/styles/home/invoices/page.module.css";
import InvoiceDetails from "@/components/InvoiceDetails";

export default function InvoicePage() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    useEffect(() => {
        async function fetchInvoices() {
            const data = await handleGetAllMyInvoice();
            if (Array.isArray(data)) {
                setInvoices(data);
            } else {
                console.error("Không thể lấy hóa đơn");
            }
            setLoading(false);
        }

        fetchInvoices();
    }, []);

    if (loading) return <p>Đang tải hóa đơn...</p>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Hóa đơn của tôi</h1>


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
