import React, { useState } from "react";
import { useSelector } from "react-redux";
import { TRootState } from "../../redux/store";
import AdminMenu from "../../components/nav/AdminMenu";
import { useNewProductMutation } from "../../redux/api/productAPI";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [newProduct, { isLoading, error }] = useNewProductMutation();
  const { user } = useSelector((state: TRootState) => state.userReducer);
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(1);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file: File | undefined = e.target.files[0];
      const reader: FileReader = new FileReader();
      if (file) {
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setPreview(reader.result);
            setImage(file);
          }
        };
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || stock < 0 || !image) {
      toast.error("All fields are required");
      return;
    }

    try {
      // Step 1: Upload the image
      const imageFormData = new FormData();
      imageFormData.append("image", image);

      const imageUploadResponse = await fetch(
        `${import.meta.env.VITE_SERVER}/api/v1/media/upload`,
        {
          method: "POST",
          body: imageFormData,
        }
      );
      console.log(imageUploadResponse);

      if (!imageUploadResponse.ok) {
        const errorResponse = await imageUploadResponse.json();
        throw new Error(errorResponse.message || "Image upload failed");
      }

      const imageData = await imageUploadResponse.json();

      if (imageData.status !== "success") {
        throw new Error(imageData.message || "Image upload failed");
      }

      const imagePath = imageData.data.filename;
      console.log(imagePath);

      // Step 2: Send product data to the backend
      const productData = {
        name,
        category,
        description,
        price,
        stock,
        images: [imagePath], // Include the uploaded image path in an array
      };

      const res = await newProduct(productData).unwrap();

      if (res.status === "success") {
        toast.success("Product created successfully");
        navigate("/dashboard/admin/products");
      } else {
        throw new Error(
          (res as unknown as Error).message || "Failed to create product"
        );
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-grow-0 h-1/3 bg-green-800 flex items-center justify-center text-5xl font-semibold text-white">
        Welcome, {user?.name || "Admin"}
      </div>

      <div className="flex flex-grow">
        <div className="w-1/4 bg-gray-100 p-4">
          <AdminMenu />
        </div>

        <div className="w-3/4 p-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold mb-6">Create New Product</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Product Name"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Price
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
                placeholder="Price"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                placeholder="e.g., Books, Electronics"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Stock
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                required
                placeholder="Stock Quantity"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Product Description"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            {preview && (
              <img src={preview} alt="new image" className="max-w-full mb-4" />
            )}

            <div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Create Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
