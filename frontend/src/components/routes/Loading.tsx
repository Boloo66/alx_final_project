import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { assets } from "../../assets/frontend_assets/assets";

const Loading = ({ path = "login" }) => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => {
        const nextCount = currentCount - 1;
        if (nextCount === 0) {
          clearInterval(interval); // Stop the timer when count reaches 0
        }
        return nextCount;
      });
    }, 1000);

    // Only navigate after count reaches 0
    if (count === 0) {
      navigate(`/${path}`, {
        state: location.pathname,
      });
    }

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [count, navigate, path, location]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <img src={assets.search_icon} alt="loading" className="w-64" />
      <div>{count}</div> {/* Display countdown */}
    </div>
  );
};

export default Loading;
