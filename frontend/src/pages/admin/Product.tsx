import { FaTrash } from "react-icons/fa";
import AdminMenu from "../../components/nav/AdminMenu";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TRootState } from "../../redux/store";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  useDeleteProductMutation,
  useProductByIdQuery,
  useUpdateProductMutation,
} from "../../redux/api/productAPI";
import toast from "react-hot-toast";

interface Product {
  price: number;
  images: string[];
  name: string;
  stock: number;
  category: string;
  description: string;
}

const AdminProduct = () => {
  const { user } = useSelector((state: TRootState) => state.userReducer);
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useProductByIdQuery(id as string);

  const defaultProduct: Product = {
    price: 0,
    images: [],
    name: "",
    stock: 0,
    category: "",
    description: "",
  };

  const product = data?.data?.product || defaultProduct;

  const [priceUpdate, setPriceUpdate] = useState<number>(product.price);
  const [stockUpdate, setStockUpdate] = useState<number>(product.stock);
  const [nameUpdate, setNameUpdate] = useState<string>(product.name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(
    product.category
  );
  const [descriptionUpdate, setDescriptionUpdate] = useState<string>(
    product.description || ""
  );
  const [photoUpdate, setPhotoUpdate] = useState<string>(
    product.images[0] || ""
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoUpdate(reader.result);
          setPhotoFile(file);
        }
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updateBody = {
      name: nameUpdate,
      price: Number(priceUpdate),
      stock: Number(stockUpdate),
      category: categoryUpdate,
      description: descriptionUpdate,
      ...(photoUpdate && { images: [photoUpdate] }),
    };

    try {
      await updateProduct({
        formData: updateBody,
        productId: id as string,
      }).unwrap();

      toast.success("Product updated successfully");
      navigate("/dashboard/admin/products");
    } catch (error) {
      toast.error("Error updating product");
      console.error("Update Error:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct({ productId: id as string }).unwrap();
        toast.success("Product deleted successfully");
        navigate("/dashboard/admin/products");
      } catch (error) {
        toast.error("Error deleting product");
        console.error("Delete Error:", error);
      }
    }
  };

  useEffect(() => {
    if (data?.data?.product) {
      const product = data.data.product;
      setNameUpdate(product.name);
      setPriceUpdate(Number(product.price));
      setStockUpdate(Number(product.stock));
      setCategoryUpdate(product.category);
      setDescriptionUpdate(product.description || "");
      setPhotoUpdate(product.images[0] || "");
    }
  }, [data]);

  if (isError) return <Navigate to="/404" />;

  return (
    <div className="flex pt-10">
      <AdminMenu />

      <main className="product-management flex-grow p-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-xl">Loading...</p>
          </div>
        ) : (
          <>
            <section className="flex flex-col items-center mb-8">
              <strong className="mb-2">ID: {id}</strong>
              {photoUpdate && (
                <img
                  src={photoUpdate}
                  alt={nameUpdate}
                  className="w-40 h-40 object-cover rounded-full mb-2"
                />
              )}
              <p className="text-xl font-semibold mb-2">{nameUpdate}</p>

              {stockUpdate > 0 ? (
                <span className="text-green-500 font-medium">
                  Stock Available: {stockUpdate}
                </span>
              ) : (
                <span className="text-red-500 font-medium">Not Available</span>
              )}

              <h3 className="text-2xl mt-2">${priceUpdate}</h3>
            </section>

            <article className="flex flex-col items-center">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white p-3 rounded-full mb-4 hover:bg-red-600 transition-colors"
              >
                <FaTrash />
              </button>

              <form onSubmit={handleSubmit} className="w-full max-w-lg">
                <h2 className="text-2xl mb-4 text-center">Manage Product</h2>

                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={nameUpdate}
                    onChange={(e) => setNameUpdate(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={priceUpdate}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Stock
                  </label>
                  <input
                    type="number"
                    id="stock"
                    value={stockUpdate}
                    onChange={(e) => setStockUpdate(Number(e.target.value))}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                    min="0"
                    step="1"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    value={categoryUpdate}
                    onChange={(e) => setCategoryUpdate(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={descriptionUpdate}
                    onChange={(e) => setDescriptionUpdate(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                    rows={4}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="photo"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Photo
                  </label>
                  <input
                    type="file"
                    id="photo"
                    onChange={handleImageChange}
                    className="w-full py-2"
                    accept="image/*"
                  />
                  {photoUpdate && (
                    <img
                      src={photoUpdate}
                      alt="Product preview"
                      className="mt-2 max-w-full h-40 object-contain"
                    />
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                  Update Product
                </button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminProduct;
