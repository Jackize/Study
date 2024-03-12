"use client";
import { ProductType } from "@/types/types";
import { useCartStore } from "@/utils/store";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  id: string;
  price: number;
  options?: { title: string; additionalPrice: number }[];
};

function Price({ product }: { product: ProductType }) {
  const [total, setTotal] = useState(product?.price);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState(0);
  const { addToCart } = useCartStore();

  const calculateTotal = useMemo(
    () =>
      quantity *
      (product?.options?.length
        ? product?.price + product?.options[selected].additionalPrice
        : product?.price),
    [quantity, selected, product],
  );

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    setTotal(calculateTotal);
  }, [calculateTotal]);

  const handleAddToCart = () => {
    addToCart({
      id: product.id + "_" + product?.options?.[selected]?.title,
      title: product.title,
      img: product?.img,
      price: total,
      optionTitle: product?.options?.[selected]?.title,
      quantity,
    });
    console.log({
      id: product.id + "_" + product?.options?.[selected]?.title,
      title: product.title,
      img: product?.img,
      price: total,
      optionTitle: product?.options?.[selected]?.title,
      quantity,
    });

    toast.success("Added to cart");
  };
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">${Number(total).toFixed(2)}</h2>
      {/* Option container */}
      <div className="flex gap-4">
        {product?.options?.length &&
          product?.options?.map((option, index) => (
            <button
              key={option.title}
              className="p-2 ring-1 ring-red-400 rounded-md min-w-[6rem]"
              style={{
                background: selected === index ? "rgb(248 113 113)" : "white",
                color: selected === index ? "white" : "red",
              }}
              onClick={() => setSelected(index)}
            >
              {option.title}
            </button>
          ))}
      </div>
      <div className="flex justify-between items-center">
        {/* Quantity container */}
        <div className=" flex justify-between w-full p-3 ring-1 ring-red-500">
          <span>Quantity</span>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
            >
              {"<"}
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => setQuantity((prev) => (prev < 9 ? prev + 1 : 9))}
            >
              {">"}
            </button>
          </div>
        </div>
        {/* Cart Button */}
        <button
          className="uppercase w-56 bg-red-500 text-white p-3"
          onClick={handleAddToCart}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}

export default React.memo(Price);
