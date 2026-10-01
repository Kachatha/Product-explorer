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
        backgroundColor: "#1e293b",
        padding: "28px",
        borderRadius: "8px",
        border: "1px solid #334155",
        marginBottom: "24px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: "1px solid #334155",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#f8fafc",
            margin: 0,
          }}
        >
          {editing ? "แก้ไขรายการสินค้า" : "เพิ่มสินค้าใหม่"}
        </h2>
        <p style={{ fontSize: "13px", color: "#94a3b8", margin: "6px 0 0 0" }}>
          {editing
            ? "ปรับปรุงข้อมูลสินค้าที่เลือก"
            : "ระบุข้อมูลเพื่อนำสินค้าเข้าสู่ระบบ"}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(saveProduct)}
        noValidate
        style={{ display: "flex", flexDirection: "column", gap: "24px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "24px",
            width: "100%",
          }}
        >
          {/* ชื่อสินค้า */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label htmlFor="title" style={{ fontSize: "13px", color: "#cbd5e1" }}>
              ชื่อสินค้า
            </label>
            <input
              id="title"
              {...register("title")}
              placeholder="กรอกชื่อสินค้า"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "6px",
                border: "1px solid #475569",
                backgroundColor: "#0f172a",
                fontSize: "14px",
                color: "#f8fafc",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {errors.title && (
              <span style={{ color: "#f43f5e", fontSize: "12px" }}>
                {errors.title.message}
              </span>
            )}
          </div>

          {/* หมวดหมู่ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label htmlFor="category" style={{ fontSize: "13px", color: "#cbd5e1" }}>
              หมวดหมู่
            </label>
            <select
              id="category"
              {...register("category")}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "6px",
                border: "1px solid #475569",
                backgroundColor: "#0f172a",
                fontSize: "14px",
                color: "#f8fafc",
                outline: "none",
                boxSizing: "border-box",
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
              <span style={{ color: "#f43f5e", fontSize: "12px" }}>
                {errors.category.message}
              </span>
            )}
          </div>

          {/* ราคา */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label htmlFor="price" style={{ fontSize: "13px", color: "#cbd5e1" }}>
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
                padding: "12px 14px",
                borderRadius: "6px",
                border: "1px solid #475569",
                backgroundColor: "#0f172a",
                fontSize: "14px",
                color: "#f8fafc",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {errors.price && (
              <span style={{ color: "#f43f5e", fontSize: "12px" }}>
                {errors.price.message}
              </span>
            )}
          </div>

          {/* จำนวนคงเหลือ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label htmlFor="stock" style={{ fontSize: "13px", color: "#cbd5e1" }}>
              จำนวนคงเหลือ
            </label>
            <input
              id="stock"
              type="number"
              {...register("stock", { valueAsNumber: true })}
              placeholder="0"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "6px",
                border: "1px solid #475569",
                backgroundColor: "#0f172a",
                fontSize: "14px",
                color: "#f8fafc",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {errors.stock && (
              <span style={{ color: "#f43f5e", fontSize: "12px" }}>
                {errors.stock.message}
              </span>
            )}
          </div>
        </div>

        {/* ปุ่มกดยืนยัน */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px" }}>
          {editing && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: "12px 24px",
                backgroundColor: "#334155",
                color: "#f8fafc",
                border: "1px solid #475569",
                borderRadius: "6px",
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
              padding: "12px 32px",
              backgroundColor: "#06b6d4",
              color: "#083344",
              border: "none",
              borderRadius: "6px",
              fontWeight: "700",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            {editing ? "บันทึกข้อมูล" : "เพิ่มสินค้าใหม่"}
          </button>
        </div>
      </form>
    </div>
  );
}
