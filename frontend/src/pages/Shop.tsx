import React, { useState, useEffect } from "react";
import {
  useGetCategoryQuery,
  useSearchProductsQuery,
} from "../redux/api/productAPI";
import { TCustomError } from "../types/api-types";
import toast from "react-hot-toast";
import { addToCart, OrderItem } from "../redux/reducer/cartReducer";
import { useDispatch } from "react-redux";

const Shop: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(10);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // Adjust debounce delay as needed
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const {
    data: categoryRes,
    isLoading: loadingCategories,
    isError,
    error,
  } = useGetCategoryQuery(null);
  const {
    data: searchData,
    isLoading: productLoading,
    isError: isProductError,
    error: productError,
  } = useSearchProductsQuery({ search: debouncedSearch, page, category, sort });

  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: OrderItem) => {
    alert(`Add to cart: ${cartItem.productId}`);
    if (cartItem.quantity < 1) return toast.error("Out of stock");
    dispatch(addToCart(cartItem));
    toast.success("Product added to cart");
  };

  const isPrevPage = page > 1;
  const isNextPage = searchData?.meta.totalPages
    ? page < searchData.meta.totalPages
    : false;

  if (isError) {
    const err = error as TCustomError;
    toast.error(err.message as string);
  }
  if (isProductError) {
    const err = productError as TCustomError;
    toast.error(err.message as string);
  }

  return (
    <div className="flex flex-col mt-16">
      {/* Search Bar */}
      <div className="p-4 bg-gray-100 w-full">
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-600"
        >
          Search:
        </label>
        <input
          type="text"
          id="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="mt-2 p-2 border rounded w-full"
        />
      </div>

      <div className="flex">
        {/* Filters Section */}
        <div className="w-3/12 p-4 bg-gray-100">
          <div className="mb-4">
            <label
              htmlFor="sort"
              className="block text-sm font-medium text-gray-600"
            >
              Sort By:
            </label>
            <select
              id="sort"
              className="mt-1 p-2 border rounded w-full"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">None</option>
              <option value="-updatedAt">Newest</option>
              <option value="+updatedAt">Oldest</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-600"
            >
              Category:
            </label>
            <select
              id="category"
              className="mt-1 p-2 border rounded w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All</option>
              {categoryRes?.data.categories.map((cat: string) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
          {productLoading ? (
            <p>Loading products...</p>
          ) : searchData?.data.product?.length ? (
            searchData.data.product.map((product: any) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-md shadow-md"
              >
                <img
                  src={product.images[0] || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="w-full h-32 object-cover mb-4"
                />
                <h3 className="text-lg font-medium mb-2">{product.name}</h3>
                <p className="text-gray-600">${product.price}</p>
                <button
                  onClick={() =>
                    addToCartHandler({
                      productId: product.id,
                      price: product.price,
                      quantity: product.quantity,
                    })
                  }
                  className="bg-blue-500 text-white px-3 py-2 rounded-md mt-2"
                >
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center space-x-4 mt-4">
        <button
          className={`px-4 py-2 rounded-md ${
            isPrevPage ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          disabled={!isPrevPage}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span className="px-4 py-2">{`Page ${page}`}</span>
        <button
          className={`px-4 py-2 rounded-md ${
            isNextPage ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          disabled={!isNextPage}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Shop;
