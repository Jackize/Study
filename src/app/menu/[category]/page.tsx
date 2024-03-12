import { ProductType } from "@/types/types";
import { urlFetchApi } from "@/utils/constant";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

type Props = {
  params: { category: string };
};

const getData = async (category: string) => {
  const res = await fetch(`${urlFetchApi}/products?cat=${category}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed!");
  }
  return res.json();
};

const CategoryPage = async ({ params }: Props) => {  
  const products: ProductType[] = await getData(params.category);
  return (
    <div className="flex flex-wrap text-red-500">
      {products.map((item) => (
        <Link
          href={`/product/${item.id}`}
          key={item.id}
          className="w-full h-[60vh] border-b-2 border-r-2 border-red-500 md:w-1/2 lg:w-1/3 p-4 flex flex-col justify-between group odd:bg-fushsia-50"
        >
          {item.img && (
            <div className="relative h-[80%]">
              <Image src={item.img} alt="" fill className="object-contain" />
            </div>
          )}
          <div className="flex items-center justify-between font-bold ">
            <h1 className="text-2xl uppercase p-2">{item.title}</h1>
            <h2 className="group-hover:hidden text-xl">${item.price}</h2>
            <button className="hidden group-hover:block uppercase bg-red-500 text-white p-2 rounded-md">
              Add to cart
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryPage;
