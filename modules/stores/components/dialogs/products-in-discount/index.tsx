"use client";

import React from "react";
import { useLocale } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  image: string;
}

interface ProductsInDiscountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEditDisplay?: () => void;
  products?: Product[];
}

export default function ProductsInDiscountDialog({
  isOpen,
  onClose,
  onEditDisplay,
  products = [],
}: ProductsInDiscountDialogProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const defaultProducts: Product[] = [
    {
      id: "1",
      name: "ايفون 16 برو ماكس",
      image:
        "https://m.media-amazon.com/images/I/61zwK7mmLtL._UF1000,1000_QL80_.jpg",
    },
    {
      id: "2",
      name: "ايفون 16 برو ماكس",
      image:
        "https://m.media-amazon.com/images/I/61zwK7mmLtL._UF1000,1000_QL80_.jpg",
    },
    {
      id: "3",
      name: "ايفون 16 برو ماكس",
      image:
        "https://m.media-amazon.com/images/I/61zwK7mmLtL._UF1000,1000_QL80_.jpg",
    },
    {
      id: "4",
      name: "ايفون 16 برو ماكس",
      image:
        "https://m.media-amazon.com/images/I/61zwK7mmLtL._UF1000,1000_QL80_.jpg",
    },
    {
      id: "5",
      name: "ايفون 16 برو ماكس",
      image:
        "https://m.media-amazon.com/images/I/61zwK7mmLtL._UF1000,1000_QL80_.jpg",
    },
    {
      id: "6",
      name: "ايفون 16 برو ماكس",
      image:
        "https://m.media-amazon.com/images/I/61zwK7mmLtL._UF1000,1000_QL80_.jpg",
    },
    {
      id: "7",
      name: "ايفون 16 برو ماكس",
      image:
        "https://m.media-amazon.com/images/I/61zwK7mmLtL._UF1000,1000_QL80_.jpg",
    },
    {
      id: "8",
      name: "ايفون 16 برو ماكس",
      image:
        "https://m.media-amazon.com/images/I/61zwK7mmLtL._UF1000,1000_QL80_.jpg",
    },
    {
      id: "9",
      name: "ايفون 16 برو ماكس",
      image:
        "https://m.media-amazon.com/images/I/61zwK7mmLtL._UF1000,1000_QL80_.jpg",
    },
    {
      id: "10",
      name: "ايفون 16 برو ماكس",
      image:
        "https://m.media-amazon.com/images/I/61zwK7mmLtL._UF1000,1000_QL80_.jpg",
    },
    {
      id: "11",
      name: "ايفون 16 برو ماكس",
      image:
        "https://m.media-amazon.com/images/I/61zwK7mmLtL._UF1000,1000_QL80_.jpg",
    },
    {
      id: "12",
      name: "ايفون 16 برو ماكس",
      image:
        "https://m.media-amazon.com/images/I/61zwK7mmLtL._UF1000,1000_QL80_.jpg",
    },
    {
      id: "13",
      name: "ايفون 16 برو ماكس",
      image:
        "https://m.media-amazon.com/images/I/61zwK7mmLtL._UF1000,1000_QL80_.jpg",
    },
  ];

  const displayProducts = products.length > 0 ? products : defaultProducts;

  const handleEditDisplay = () => {
    onEditDisplay?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-6xl w-full bg-sidebar border-gray-700 ${
          isRtl ? "rtl" : "ltr"
        }`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-white">
            عرض {displayProducts.length} منتج الموجودين في التخفيض
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="bg-sidebar rounded-lg p-3 flex items-center space-x-3 space-x-reverse"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-white text-xs sm:text-sm font-medium flex-1 truncate">
                  {product.name}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleEditDisplay}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            >
              تعديل العرض
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
