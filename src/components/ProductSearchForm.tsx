"use client";

import { useForm } from "react-hook-form";
import type { SearchQuery } from "@/lib/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { SORT_FIELDS, SearchQuerySchema, defaultQuery } from "@/lib/products";

type ProductSearchFormProps = {
  onSearch: (query: SearchQuery) => Promise<void>;
};

export default function ProductSearchForm({ onSearch }: ProductSearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchQuery>({
    resolver: zodResolver(SearchQuerySchema),
    defaultValues: defaultQuery,
  });

  return (
    <form
      onSubmit={handleSubmit(onSearch)}
      noValidate
      style={{
        backgroundColor: "#ffffff",
        padding: "20px 24px",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
        marginBottom: "24px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-end",
        gap: "16px",
      }}
    >
      <div style={{ flex: "1 1 220px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="q" style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>
          ค้นหาสินค้า
        </label>
        <input
          id="q"
          {...register("q")}
          placeholder="พิมพ์ชื่อสินค้าเพื่อค้นหา..."
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
      </div>

      <div style={{ width: "150px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="sortBy" style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>
          เรียงตาม
        </label>
        <select
          id="sortBy"
          {...register("sortBy")}
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
          {SORT_FIELDS.map((field) => (
            <option key={field} value={field}>{field}</option>
          ))}
        </select>
      </div>

      <div style={{ width: "120px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="limit" style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>
          แสดงรายการ
        </label>
        <input
          id="limit"
          type="number"
          {...register("limit", { valueAsNumber: true })}
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
            textAlign: "center",
          }}
        />
        {errors.limit && <span style={{ color: "#ef4444", fontSize: "12px" }}>{errors.limit.message}</span>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          padding: "10px 24px",
          backgroundColor: "#4f46e5",
          color: "#ffffff",
          border: "none",
          borderRadius: "10px",
          fontWeight: "600",
          fontSize: "14px",
          cursor: "pointer",
          height: "42px",
          boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)",
        }}
      >
        {isSubmitting ? "กำลังค้นหา..." : "ค้นหา"}
      </button>
    </form>
  );
}