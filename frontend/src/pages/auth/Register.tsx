import React, { useState, ChangeEvent } from "react";
import { useRegisterMutation } from "../../redux/api/userAPI";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [register, { isLoading, error }] = useRegisterMutation(); // Use the mutation hook
  const navigate = useNavigate();

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Append redirectPath to the form data
    const formDataWithRedirect = {
      ...formData,
      redirectPath: "/admin/auth/verify", // Include dummy path in the request
    };

    try {
      const res = await register(formDataWithRedirect).unwrap();
      console.log("Register Response:", res); // Log the response

      if (res.status === "success") {
        toast.success(res.message);

        // Navigate to a fixed location after successful registration
        navigate("/login");
      } else {
        toast.error(res.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error registering user:", error); // Log the error
      toast.error("Error registering user");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Register
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter your name"
              required
              onChange={handleChange}
              value={formData.name}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              autoComplete="new-email" // Use a custom value to prevent autofill
              required
              onChange={handleChange}
              value={formData.email}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              required
              onChange={handleChange}
              value={formData.password}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>

        {/* Error Handling */}
        {error && (
          <p className="mt-2 text-red-500 text-xs">
            {(error as Error).message}
          </p>
        )}

        {/* Login Link */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
