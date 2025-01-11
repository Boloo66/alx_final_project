import React, { useState, ChangeEvent } from "react";
import { useLoginMutation } from "../../redux/api/userAPI";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { userExist } from "../../redux/reducer/userReducer";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAdminLoginMutation } from "../../redux/api/adminAPI";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const dispatch = useDispatch();
  const [login, { isLoading, error }] = useLoginMutation();
  const [adminLogin] = useAdminLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);

    try {
      let res;

      if (formData.role === "admin") {
        res = await adminLogin(formData).unwrap();
      } else {
        res = await login(formData).unwrap();
      }

      console.log("Login Response=====>", res);

      if (res.status === "success") {
        toast.success(res.message);
        dispatch(userExist({ user: { ...res.data, id: res.data.id } }));
        const userData = {
          user: {
            name: res.data.name,
            email: res.data.email,
            role: res.data.role,
            token: res.data.token,
            id: res.data.id,
          },
          token: res.data.token,
        };
        localStorage.setItem("auth", JSON.stringify(userData));
        navigate(
          `/dashboard/${userData.user.role === "admin" ? "admin" : "user"}`
        );
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (err) {
      console.error("Login Error=====>", err);
      toast.error("Error logging in");
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              required
              onChange={handleChange}
              value={formData.email}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

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

          {/* Role Selection */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              name="role"
              id="role"
              onChange={handleChange}
              value={formData.role}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        {error && (
          <p className="mt-2 text-red-500 text-xs">
            {(error as Error).message}
          </p>
        )}

        <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
          <p>
            Forgot your password?{" "}
            <Link
              to="/reset-password"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Reset it here
            </Link>
          </p>

          <p>
            Don't have an account?
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
