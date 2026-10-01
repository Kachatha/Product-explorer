"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, ProductDraftSchema } from "@/lib/products";
import type { Product, ProductDraft } from "@/lib/products";

type ProductFormProps = {
  editing: Product | null;
  onSave: (draft: ProductDraft) => void;
  onCancel: () => void;
};

const EMPTY_VALUES = {
  title: "",
  price: "",
  stock: "",
  category: "",
  images: [],
} as unknown as ProductDraft;

function toFormValues(editing: Product | null): ProductDraft {
  return editing
    ? {
        title: editing.title,
        price: editing.price,
        stock: editing.stock,
        category: editing.category,
        images: editing.images,
      }
    : EMPTY_VALUES;
}

export default function ProductForm({
  editing,
  onSave,
  onCancel,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductDraft>({
    resolver: zodResolver(ProductDraftSchema),
    mode: "onChange",
    defaultValues: toFormValues(editing),
  });

  useEffect(() => {
    reset(toFormValues(editing));
  }, [editing, reset]);

  function saveProduct(values: ProductDraft) {
    onSave(values);
    reset(EMPTY_VALUES);
  }

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "24px 28px",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
        marginBottom: "24px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          marginBottom: "20px",
          paddingBottom: "12px",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <h2
          style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "#0f172a",
            margin: 0,
          }}
        >
          {editing ? "แก้ไขรายการสินค้า" : "เพิ่มสินค้าใหม่"}
        </h2>
        <p
          style={{
            fontSize: "12px",
            color: "#64748b",
            margin: "4px 0 0 0",
          }}
        >
          {editing
            ? "ปรับปรุงข้อมูลสินค้าในระบบ"
            : "กรอกข้อมูลเพื่อลงทะเบียนสินค้าใหม่"}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(saveProduct)}
        noValidate
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "100%",
        }}
      >
        {/* จัดลง 2 คอลัมน์ กระจายเต็มความกว้างของการ์ด */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
            width: "100%",
          }}
        >
          {/* ชื่อสินค้า */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              htmlFor="title"
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#475569",
              }}
            >
              ชื่อสินค้า
            </label>
            <input
              id="title"
              {...register("title")}
              placeholder="กรอกชื่อสินค้า"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#f8fafc",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
                color: "#0f172a",
              }}
            />
            {errors.title && (
              <span style={{ color: "#ef4444", fontSize: "12px" }}>
                {errors.title.message}
              </span>
            )}
          </div>

          {/* หมวดหมู่ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              htmlFor="category"
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#475569",
              }}
            >
              หมวดหมู่
            </label>
            <select
              id="category"
              {...register("category")}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#f8fafc",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
                color: "#0f172a",
                cursor: "pointer",
              }}
            >
              <option value="">เลือกหมวดหมู่</option>
              {CATEGORIES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            {errors.category && (
              <span style={{ color: "#ef4444", fontSize: "12px" }}>
                {errors.category.message}
              </span>
            )}
          </div>

          {/* ราคา */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              htmlFor="price"
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#475569",
              }}
            >
              ราคา (บาท)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              placeholder="0.00"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#f8fafc",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
                color: "#0f172a",
              }}
            />
            {errors.price && (
              <span style={{ color: "#ef4444", fontSize: "12px" }}>
                {errors.price.message}
              </span>
            )}
          </div>

          {/* จำนวนคงเหลือ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              htmlFor="stock"
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#475569",
              }}
            >
              จำนวนคงเหลือ
            </label>
            <input
              id="stock"
              type="number"
              {...register("stock", { valueAsNumber: true })}
              placeholder="0"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#f8fafc",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
                color: "#0f172a",
              }}
            />
            {errors.stock && (
              <span style={{ color: "#ef4444", fontSize: "12px" }}>
                {errors.stock.message}
              </span>
            )}
          </div>
        </div>

        {/* ปุ่มกดยืนยัน ชิดขวา */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          {editing && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: "10px 20px",
                backgroundColor: "#f1f5f9",
                color: "#475569",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              ยกเลิก
            </button>
          )}
          <button
            type="submit"
            style={{
              padding: "10px 28px",
              backgroundColor: "#4f46e5",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)",
            }}
          >
            {editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
          </button>
        </div>
      </form>
    </div>
  );
}