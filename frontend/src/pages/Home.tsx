import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from "lucide-react";
import { IProduct } from "../types/types";
import { assets } from "../assets/frontend_assets/assets";
import {
  useAllProductsQuery,
  useGetCategoryQuery,
} from "../redux/api/productAPI";

const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    rating: 4.8,
    image: "/api/placeholder/300/300",
    category: "Electronics",
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    rating: 4.6,
    image: "/api/placeholder/300/300",
    category: "Wearables",
  },
  {
    id: 3,
    name: "Ultra HD Camera",
    price: 799.99,
    rating: 4.9,
    image: "/api/placeholder/300/300",
    category: "Photography",
  },
  {
    id: 4,
    name: "Wireless Gaming Mouse",
    price: 79.99,
    rating: 4.7,
    image: "/api/placeholder/300/300",
    category: "Gaming",
  },
  {
    id: 5,
    name: "Mechanical Keyboard",
    price: 149.99,
    rating: 4.5,
    image: "/api/placeholder/300/300",
    category: "Peripherals",
  },
  {
    id: 6,
    name: "Noise-Canceling Earbuds",
    price: 249.99,
    rating: 4.8,
    image: "/api/placeholder/300/300",
    category: "Audio",
  },
];

const ProductCard = ({ product }: { product: IProduct }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mx-2 flex flex-col">
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <div className="flex-grow">
        <span className="text-sm text-blue-600 font-medium">
          {product.category}
        </span>
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <div className="flex items-center mb-2">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm text-gray-600">{5}</span>
        </div>
        <p className="text-xl font-bold text-blue-900">${product.price}</p>
      </div>
      <button
        onClick={() => alert("Added to cart!")}
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        <ShoppingCart className="h-4 w-4" />
        Add to Cart
      </button>
    </div>
  );
};

const ProductSlider = () => {
  const { data: productsData } = useAllProductsQuery({});
  const products = productsData?.data?.product || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 3 >= products.length ? 0 : prevIndex + 3
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 3 < 0 ? products.length - 3 : prevIndex - 3
    );
  };

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">
        Featured Products
      </h2>
      {products.length > 0 ? (
        <div className="relative">
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-2 rounded-full shadow-lg z-10 hover:bg-gray-100"
          >
            <ChevronLeft className="h-6 w-6 text-blue-600" />
          </button>
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
            >
              {products.map((product: IProduct) => (
                <div key={product.id} className="w-1/3 flex-shrink-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-2 rounded-full shadow-lg z-10 hover:bg-gray-100"
          >
            <ChevronRight className="h-6 w-6 text-blue-600" />
          </button>
        </div>
      ) : (
        <p className="text-center text-blue-600">Loading products...</p>
      )}
    </div>
  );
};

const Home = () => {
  const { data: productsData } = useAllProductsQuery({});
  const { data: categoriesData } = useGetCategoryQuery(null);

  const categories = categoriesData?.data.categories || [];
  const products = productsData?.data?.product || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Discover Amazing Products
                <span className="text-blue-400"> at Great Prices</span>
              </h1>
              <p className="text-lg text-blue-100">
                Shop the latest trends in electronics, fashion, and more. Free
                shipping on orders over $50!
              </p>
              <div className="flex gap-4">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors">
                  Shop Now
                </button>
                <button className="bg-white text-blue-900 px-8 py-3 rounded-md hover:bg-blue-50 transition-colors">
                  View Deals
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src={assets.hero_img}
                alt="Featured products"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
                <p className="text-2xl font-bold">Up to</p>
                <p className="text-4xl font-bold">50% OFF</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-6 rounded-lg bg-blue-50">
            <div className="bg-blue-600 p-3 rounded-full">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-blue-900">
                Free Shipping
              </h3>
              <p className="text-blue-600">On orders over $50</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 rounded-lg bg-blue-50">
            <div className="bg-blue-600 p-3 rounded-full">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-blue-900">
                Best Quality
              </h3>
              <p className="text-blue-600">100% guaranteed</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 rounded-lg bg-blue-50">
            <div className="bg-blue-600 p-3 rounded-full">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-blue-900">
                24/7 Support
              </h3>
              <p className="text-blue-600">Always here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Slider Section */}
      <ProductSlider />

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-6 rounded-lg bg-blue-50">
            <div className="bg-blue-600 p-3 rounded-full">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-blue-900">
                Free Shipping
              </h3>
              <p className="text-blue-600">On orders over $50</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 rounded-lg bg-blue-50">
            <div className="bg-blue-600 p-3 rounded-full">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-blue-900">
                Best Quality
              </h3>
              <p className="text-blue-600">100% guaranteed</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 rounded-lg bg-blue-50">
            <div className="bg-blue-600 p-3 rounded-full">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-blue-900">
                24/7 Support
              </h3>
              <p className="text-blue-600">Always here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Slider Section */}
      <ProductSlider />

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category: string) => (
              <button
                key={category}
                onClick={() => alert(`Navigating to ${category} category`)}
                className="group relative overflow-hidden rounded-lg aspect-square"
              >
                <img
                  src={
                    products.find((product) => product.category === category)
                      ?.images[0]
                  }
                  alt={category}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent flex items-end p-6">
                  <h3 className="text-white text-xl font-semibold">
                    {category}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-blue-100 mb-8">
            Subscribe to our newsletter for exclusive deals and updates
          </p>
          <form
            className="max-w-md mx-auto flex gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Subscribed!");
            }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
