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
    <div style={{ backgroundColor: "#0f172a", minHeight: "100vh", paddingBottom: "40px" }}>
      <main
        style={{
          maxWidth: "1040px",
          margin: "0 auto",
          padding: "32px 16px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          width: "100%",
          boxSizing: "border-box",
          color: "#f8fafc",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#1e293b",
            padding: "20px 24px",
            borderRadius: "8px",
            border: "1px solid #334155",
            marginBottom: "24px",
          }}
        >
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#f8fafc", margin: 0 }}>
              ระบบจัดการสินค้า
            </h1>
            <p style={{ fontSize: "14px", color: "#94a3b8", margin: "6px 0 0 0" }}>
              พื้นที่ควบคุมและจัดการคลังสินค้า (Dark Theme)
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadProducts(defaultQuery)}
            disabled={status === "loading"}
            style={{
              padding: "10px 20px",
              backgroundColor: "#334155",
              border: "1px solid #475569",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              color: "#f8fafc",
              cursor: "pointer",
              transition: "all 0.2s",
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
            backgroundColor: "#1e293b",
            borderRadius: "8px",
            border: "1px solid #334155",
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
              <tr style={{ backgroundColor: "#0f172a", borderBottom: "2px solid #334155", color: "#94a3b8" }}>
                <th style={{ padding: "16px 20px", width: "40%", fontWeight: "600" }}>สินค้า</th>
                <th style={{ padding: "16px 20px", width: "20%", fontWeight: "600" }}>หมวดหมู่</th>
                <th style={{ padding: "16px 20px", width: "15%", fontWeight: "600", textAlign: "right" }}>ราคา</th>
                <th style={{ padding: "16px 20px", width: "12%", fontWeight: "600", textAlign: "center" }}>คงเหลือ</th>
                <th style={{ padding: "16px 20px", width: "13%", fontWeight: "600", textAlign: "center" }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {status === "loading" && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              )}
              {status === "error" && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "#f43f5e" }}>
                    {errorMessage}
                  </td>
                </tr>
              )}
              {status === "ready" && products.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
                    ไม่พบรายการสินค้า
                  </td>
                </tr>
              )}
              {status === "ready" &&
                products.length > 0 &&
                products.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #334155" }}>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "14px", overflow: "hidden" }}>
                        {item.images?.[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            style={{
                              width: "44px",
                              height: "44px",
                              objectFit: "cover",
                              borderRadius: "6px",
                              border: "1px solid #475569",
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "44px",
                              height: "44px",
                              backgroundColor: "#334155",
                              borderRadius: "6px",
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
                            fontWeight: "500",
                            color: "#f8fafc",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.title}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span
                        style={{
                          backgroundColor: "#0f172a",
                          color: "#cbd5e1",
                          border: "1px solid #334155",
                          padding: "4px 10px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "500",
                          display: "inline-block",
                        }}
                      >
                        {item.category || "ทั่วไป"}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "right", fontWeight: "600", color: "#06b6d4" }}>
                      ฿{Number(item.price).toLocaleString()}
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "center" }}>
                      <span
                        style={{
                          backgroundColor: item.stock > 0 ? "#064e3b" : "#7f1d1d",
                          color: item.stock > 0 ? "#34d399" : "#fca5a5",
                          padding: "4px 10px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "600",
                          display: "inline-block",
                        }}
                      >
                        {item.stock > 0 ? `${item.stock} ชิ้น` : "หมด"}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                        <button
                          type="button"
                          onClick={() => setEditing(item)}
                          style={{
                            padding: "6px 12px",
                            backgroundColor: "transparent",
                            color: "#eab308",
                            border: "1px solid #eab308",
                            borderRadius: "4px",
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
                            backgroundColor: "transparent",
                            color: "#f43f5e",
                            border: "1px solid #f43f5e",
                            borderRadius: "4px",
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
    </div>
  );
}
