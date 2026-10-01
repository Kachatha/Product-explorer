"use client";

import { useEffect, useState } from "react";
import { defaultQuery, fetchProducts } from "@/lib/products";
import type {
  Product,
  ProductList,
  SearchQuery,
  ProductDraft,
} from "@/lib/products";

import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductForm";

type LoadState = "loading" | "error" | "ready";

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts(defaultQuery).then(showResult).catch(showError);
  }, []);

  function showResult(list: ProductList) {
    setProducts(list.products);
    setStatus("ready");
  }

  function showError(error: unknown) {
    setErrorMessage(
      error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ"
    );
    setStatus("error");
  }

  async function loadProducts(query: SearchQuery) {
    setStatus("loading");
    setErrorMessage("");

    try {
      showResult(await fetchProducts(query));
    } catch (error) {
      showError(error);
    }
  }

  function saveProduct(draft: ProductDraft) {
    if (editing) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editing.id ? { ...product, ...draft } : product
        )
      );
      setEditing(null);
    } else {
      setProducts((prev) => [{ ...draft, id: Date.now() }, ...prev]);
    }
  }

  function removeProduct(id: number) {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    if (editing?.id === id) {
      setEditing(null);
    }
  }

  return (
    <main
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "32px 16px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#ffffff",
          padding: "20px 24px",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            ระบบจัดการสินค้า
          </h1>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>
            ค้นหา เพิ่ม แก้ไข และลบข้อมูลรายการสินค้าทั้งหมด
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadProducts(defaultQuery)}
          disabled={status === "loading"}
          style={{
            padding: "9px 18px",
            backgroundColor: "#f1f5f9",
            border: "1px solid #cbd5e1",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "600",
            color: "#475569",
            cursor: "pointer",
          }}
        >
          รีเฟรชข้อมูล
        </button>
      </div>

      <ProductSearchForm onSearch={loadProducts} />

      <ProductForm
        editing={editing}
        onSave={saveProduct}
        onCancel={() => setEditing(null)}
      />

      {/* ตารางรายการสินค้า */}
      <section
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
          minHeight: "300px",
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            fontSize: "14px",
            tableLayout: "fixed",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
              <th style={{ padding: "14px 20px", width: "40%", fontWeight: "600" }}>สินค้า</th>
              <th style={{ padding: "14px 20px", width: "20%", fontWeight: "600" }}>หมวดหมู่</th>
              <th style={{ padding: "14px 20px", width: "15%", fontWeight: "600", textAlign: "right" }}>ราคา</th>
              <th style={{ padding: "14px 20px", width: "12%", fontWeight: "600", textAlign: "center" }}>คงเหลือ</th>
              <th style={{ padding: "14px 20px", width: "13%", fontWeight: "600", textAlign: "center" }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {status === "loading" && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
                  กำลังโหลดข้อมูล...
                </td>
              </tr>
            )}
            {status === "error" && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "#ef4444" }}>
                  {errorMessage}
                </td>
              </tr>
            )}
            {status === "ready" && products.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
                  ไม่พบรายการสินค้า
                </td>
              </tr>
            )}
            {status === "ready" &&
              products.length > 0 &&
              products.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", overflow: "hidden" }}>
                      {item.images?.[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "#f1f5f9",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#94a3b8",
                            fontSize: "11px",
                            flexShrink: 0,
                          }}
                        >
                          ไม่มีรูป
                        </div>
                      )}
                      <span
                        style={{
                          fontWeight: "600",
                          color: "#0f172a",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.title}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        backgroundColor: "#f1f5f9",
                        color: "#475569",
                        padding: "4px 10px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "600",
                        display: "inline-block",
                      }}
                    >
                      {item.category || "ทั่วไป"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", textAlign: "right", fontWeight: "700", color: "#0f172a" }}>
                    ฿{Number(item.price).toLocaleString()}
                  </td>
                  <td style={{ padding: "14px 20px", textAlign: "center" }}>
                    <span
                      style={{
                        backgroundColor: item.stock > 0 ? "#dcfce7" : "#fee2e2",
                        color: item.stock > 0 ? "#15803d" : "#b91c1c",
                        padding: "4px 10px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "600",
                        display: "inline-block",
                      }}
                    >
                      {item.stock > 0 ? `${item.stock} ชิ้น` : "หมด"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                      <button
                        type="button"
                        onClick={() => setEditing(item)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#fef3c7",
                          color: "#b45309",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        แก้ไข
                      </button>
                      <button
                        type="button"
                        onClick={() => removeProduct(item.id)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#fee2e2",
                          color: "#b91c1c",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}