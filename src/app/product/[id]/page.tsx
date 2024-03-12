import Price from "@/components/Price";
import { ProductType } from "@/types/types";
import { urlFetchApi } from "@/utils/constant";
import Image from "next/image";
import React from "react";

const getData = async (id: string) => {
  const res = await fetch(`${urlFetchApi}/products/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed!");
  }
  return res.json();
};
const SingleProduct = async ({ params }: { params: { id: string } }) => {
  const product: ProductType = await getData(params.id);
  return (
    <div className="p-4 lg:px-20 xl:px-40 h-screen flex flex-col justify-around text-red-500 md:flex-row md:gap-8 md:items-center">
      {product.img && (
        <div className="relative w-full h-1/2 md:h-[70%]">
          <Image
            src={product.img}
            alt={product.title}
            fill
            className="object-contain"
          />
        </div>
      )}
      <div className="h-1/2 flex flex-col gap-4 md:h-[70%] md:justify-center md:gap-6 xl:gap-8">
        <h1 className="text-3xl font-bold uppercase xl:text-5xl">
          {product.title}
        </h1>
        <p>{product.desc}</p>
        <Price product={product} />
      </div>
    </div>
  );
};

export default SingleProduct;
