"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StockFiltersProps {
  suppliers: string[];
  supplierFilter: string;
  onSupplierChange: (value: string) => void;
  priceMin: string;
  priceMax: string;
  onPriceMinChange: (value: string) => void;
  onPriceMaxChange: (value: string) => void;
  onReset: () => void;
}

export function StockFilters({
  suppliers,
  supplierFilter,
  onSupplierChange,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  onReset,
}: StockFiltersProps) {
  const hasActiveFilters = !!supplierFilter || !!priceMin || !!priceMax;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={supplierFilter} onValueChange={(val) => onSupplierChange(val ?? "")}>
        <SelectTrigger id="stock-supplier-filter" className="w-[180px]">
          <SelectValue placeholder="Fornecedor" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos</SelectItem>
          {suppliers.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-1.5">
        <Input
          id="stock-price-min"
          type="number"
          placeholder="Preço mín."
          value={priceMin}
          onChange={(e) => onPriceMinChange(e.target.value)}
          className="w-[110px]"
          min={0}
          step={0.01}
        />
        <span className="text-muted-foreground text-sm">–</span>
        <Input
          id="stock-price-max"
          type="number"
          placeholder="Preço máx."
          value={priceMax}
          onChange={(e) => onPriceMaxChange(e.target.value)}
          className="w-[110px]"
          min={0}
          step={0.01}
        />
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
          Limpar
        </Button>
      )}
    </div>
  );
}
