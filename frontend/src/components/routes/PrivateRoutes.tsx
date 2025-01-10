import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TRootState } from "../../redux/store";
import { Outlet, useNavigate } from "react-router-dom";
import Loading from "./Loading";

const PrivateRoutes = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state: TRootState) => state.userReducer);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const userString = localStorage.getItem("auth");
    console.log("User from localStorage:", userString);

    const storedUser = userString ? JSON.parse(userString) : null;
    const isAuthenticated = storedUser.user.role === "user" && storedUser.token;

    console.log("isAuthenticated:", isAuthenticated);

    if (isAuthenticated) {
      setOk(true);
    } else {
      console.log("Redirecting to login...");
      navigate("/login");
    }
  }, [navigate]);

  if (!ok) return <Loading />;

  return <Outlet />;
};

export default PrivateRoutes;
