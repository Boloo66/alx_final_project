import { FaTrash } from "react-icons/fa";
import AdminMenu from "../../components/nav/AdminMenu";
import React from "react";

const AdminProduct = () => {
  return (
    <div className="flex pt-20">
      <AdminMenu />

      <main className="product-management flex-grow p-8">
        <section className="flex flex-col items-center mb-8">
          <strong className="mb-2">ID-1234</strong>
          <img src="" alt="" className="w-40 h-40 rounded-full mb-2" />
          <p className="mb-2">Name</p>

          <span className="text-green-300"> Stock Available </span>
          <span className="text-red-500"> Not Available</span>

          <h3 className="text-2xl mt-2"> Price</h3>
        </section>
        <article className="flex flex-col items-center">
          <button className="product-delete-btn bg-red-500 text-white p-2 rounded-full mb-4">
            <FaTrash />
          </button>

          <form action="#" className="text-center">
            <h2 className="text-2xl mb-4">Manage</h2>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-600"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full px-4 border rounded-mb focus:outline-none focus:border-blue-500"
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
                type="text"
                name="price"
                placeholder="$1"
                className="w-full px-4 border rounded-mb focus:outline-none focus:border-blue-500"
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
                name="stock"
                placeholder="Stock"
                className="w-full px-4 border rounded-mb focus:outline-none focus:border-blue-500"
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
                name="category"
                placeholder="eg., Books, shirts, etc."
                className="w-full px-4 border rounded-mb focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-600"
              >
                Photo
              </label>
              <input type="file" name="file" />
            </div>

            <img src="" alt="" className="max-w-full mb-4" />

            <button className="bg-green-500 focus:outline-none focus:border-indigo-400 focus:ring-indigo-50 border">
              Submit
            </button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default AdminProduct;
