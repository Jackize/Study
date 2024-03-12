"use client";
import { useCartStore } from "@/utils/store";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const CartPage = () => {
  const { products, totalItems, totalPrice, removeFromCart } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);
  const handleCheckout = async () => {
    if (!session) {
      redirect("/login");
    } else {
      try {
        const res = await fetch("http://localhost:3000/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            price: totalPrice,
            products,
            status: "Not Paid!",
            userEmail: session.user.email,
          }),
        });
        const data = await res.json();
        router.push(`/pay/${data.id}`);
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col text-red-500 lg:flex-row">
      {/* Products list */}
      <div className="h-1/2 p-4 flex flex-col justify-center overflow-scroll lg:h-full lg:w-2/3 2xl:w-1/2 lg:px-20 xl:px-40">
        {/* Single product */}
        {products.map((product) => (
          <div
            className="flex items-center justify-between mb-4"
            key={product.id}
          >
            {product.img && (
              <Image src={product?.img} alt="" width={100} height={100} />
            )}
            <div className="uppercase">
              <h1 className="text-xl font-bold">{product.title}</h1>
              <span>
                {product.optionTitle} x{product.quantity}
              </span>
            </div>
            <h2 className="font-bold">${Number(product.price).toFixed(2)}</h2>
            <span
              className="cursor-pointer"
              onClick={() => removeFromCart(product)}
            >
              X
            </span>
          </div>
        ))}
      </div>
      {/* Payment container */}
      <div className="h-1/2 p-4 bg-fuchsia-50 flex flex-col gap-4 justify-center lg:h-full lg:w-1/3 2xl:w-1/2 lg:px-20 xl:px-40 2xl:text-xl 2xl:gap-6">
        <div className="flex justify-between">
          <span>Subtorial ({totalItems} item)</span>
          <span>{totalPrice}</span>
        </div>
        <div className="flex justify-between">
          <span>Service cost</span>
          <span>$0.0</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery cost</span>
          <span className="text-green-500">Free</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between">
          <span className="uppercase font-bold">Total(INCL. VAT)</span>
          <span className="font-bold">{totalPrice}</span>
        </div>
        <button
          className="bg-red-500 text-white p-3 rounded-md w-1/2 self-end"
          onClick={handleCheckout}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
