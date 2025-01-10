import React from "react";
import AdminMenu from "../../components/nav/AdminMenu";
import { Link, Navigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { useSelector } from "react-redux";
import { TRootState } from "../../redux/store";
import { useAllProductsQuery } from "../../redux/api/productAPI";
import { IProduct } from "../../types/types";

const AdminProduct = () => {
  const { user } = useSelector((state: TRootState) => state.userReducer);
  const { data, isLoading, error } = useAllProductsQuery({});

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error || !data?.data.product) {
    return <div>Error: {(error as Error).message}</div>;
  }

  const products: IProduct[] = data.data.product;
  console.log(products);
  return (
    <div className="flex flex-grow">
      <div className="w-1/4">
        <AdminMenu />
      </div>

      <div className="w-3/4 p-4">
        <div className="p-3 mb-2 text-lg font-semibold bg-gray-200">
          Manage All Products
        </div>

        <div className="max-w-7xl mx-auto bg-white p-6 rounded-md shadow-md">
          <h1 className="text-2xl font-bold mb-4">Product Dashboard</h1>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-collapse rounded-md overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border-b border-r border-black">
                    Image
                  </th>
                  <th className="py-2 px-4 border-b border-r border-black">
                    Name
                  </th>
                  <th className="py-2 px-4 border-b border-r border-black">
                    Price
                  </th>
                  <th className="py-2 px-4 border-b border-r border-black">
                    Stock
                  </th>
                  <th className="py-2 px-4 border-b border-r border-black">
                    Category
                  </th>
                  <th className="py-2 px-4 border-b border-r border-black">
                    Discription
                  </th>
                  <th className="py-2 px-4 border-b border-r border-black">
                    More info
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: IProduct) => (
                  <tr key={product.id} className="border-b">
                    <td className="py-2 px-4 border-r border-b border-black">
                      <img
                        src={`${import.meta.env.VITE_SERVER}/uploads/${product.images[0].split("/")[-1]}`}
                        alt=""
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    </td>
                    <td className="py-2 px-4 border-r border-b border-black">
                      {product.name}
                    </td>
                    <td className="py-2 px-4 border-r border-b border-black">
                      {product.price}
                    </td>
                    <td className="py-2 px-4 border-r border-b border-black">
                      {product.stock}
                    </td>
                    <td className="py-2 px-4 border-r border-b border-black">
                      {product.category}
                    </td>
                    <td className="py-2 px-4 border-r border-b border-black">
                      {product.description}
                    </td>

                    <td className="py-2 px-4 border-r border-b border-black">
                      <Link to={`/dashboard/admin/product/${product.id}`}>
                        <button className="text-blue-500 hover:underline mr-2 text-lg">
                          <FaEye />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProduct;
