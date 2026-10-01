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
        backgroundColor: "#1e293b",
        padding: "24px",
        borderRadius: "8px",
        border: "1px solid #334155",
        marginBottom: "24px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-end",
        gap: "16px",
      }}
    >
      <div style={{ flex: "1 1 250px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <label htmlFor="q" style={{ fontSize: "13px", color: "#cbd5e1" }}>
          ค้นหาสินค้า
        </label>
        <input
          id="q"
          {...register("q")}
          placeholder="พิมพ์ชื่อสินค้า..."
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
      </div>

      <div style={{ width: "160px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <label htmlFor="sortBy" style={{ fontSize: "13px", color: "#cbd5e1" }}>
          เรียงตาม
        </label>
        <select
          id="sortBy"
          {...register("sortBy")}
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
          {SORT_FIELDS.map((field) => (
            <option key={field} value={field}>{field}</option>
          ))}
        </select>
      </div>

      <div style={{ width: "120px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <label htmlFor="limit" style={{ fontSize: "13px", color: "#cbd5e1" }}>
          รายการต่อหน้า
        </label>
        <input
          id="limit"
          type="number"
          {...register("limit", { valueAsNumber: true })}
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
            textAlign: "center",
          }}
        />
        {errors.limit && <span style={{ color: "#f43f5e", fontSize: "12px" }}>{errors.limit.message}</span>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          padding: "12px 28px",
          backgroundColor: "#06b6d4",
          color: "#083344",
          border: "none",
          borderRadius: "6px",
          fontWeight: "700",
          fontSize: "14px",
          cursor: "pointer",
          height: "45px",
        }}
      >
        {isSubmitting ? "ค้นหา..." : "ค้นหา"}
      </button>
    </form>
  );
}
