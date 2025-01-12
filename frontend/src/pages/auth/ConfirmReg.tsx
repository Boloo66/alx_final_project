import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const RegistrationConfirmed = () => {
  const location = useLocation(); // Get the current location (URL)
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // Parse the query parameters using URLSearchParams
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get("code");
  const email = queryParams.get("email");
  const id = queryParams.get("id");

  useEffect(() => {
    if (!code || !email || !id) {
      setStatus("Invalid confirmation link.");
      setLoading(false);
      return;
    }
    console.log({ email });

    // Send the code, email, and id to the backend for verification
    fetch(`${import.meta.env.VITE_SERVER}/api/v1/auth/verify-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify({ code, email, id }), // Properly stringifying the body
    })
      .then((response) => response.json()) // Parse the response as JSON
      .then((data) => {
        if (!data.sessionId) {
          setStatus("Verification failed.");
          setLoading(false);
          return;
        }

        fetch(
          `${import.meta.env.VITE_SERVER}/api/v1/auth/complete-registration?id=${data.sessionId}`, // Properly interpolate sessionId
          { method: "GET" }
        )
          .then((response) => response.json()) // Parse the second response
          .then((responseData) => {
            console.log(responseData);
            if (responseData.status === "success") {
              setStatus("Your registration has been confirmed successfully!");
              setLoading(false);
              setTimeout(() => {
                navigate("/login");
              }, 5000);
            } else {
              setStatus(
                "There was an issue with confirming your registration."
              );
              setLoading(false);
            }
          })
          .catch(() => {
            setStatus("Error completing the registration.");
            setLoading(false);
          });
      })
      .catch(() => {
        setStatus("Error connecting to the server.");
        setLoading(false);
      });
  }, [code, email, id, navigate]); // added id and navigate to dependency array

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-sm w-full shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Registration Confirmation
        </h1>
        <p className="text-lg text-center mb-4">{status}</p>

        {loading && (
          <div className="text-center text-lg font-semibold mb-4">
            Loading...
          </div>
        )}

        <div className="text-center mt-6">
          <button
            className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none"
            onClick={() => navigate("/")}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationConfirmed;
