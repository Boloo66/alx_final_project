import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserData } from "../../types/api-types";
import { RootState } from "@reduxjs/toolkit/query";
import { logout, userExist } from "../../redux/reducer/userReducer";
import { TRootState } from "../../redux/store";
import { useNavigate, useNavigation } from "react-router-dom";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, isloading } = useSelector(
    (state: TRootState) => state.userReducer
  );
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<UserData | null>(user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setUpdatedUser(user);
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleProfileUpdate = () => {
    if (updatedUser) {
      dispatch(userExist({ user: updatedUser }));
      setEditMode(false);
    }
  };

  if (isloading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold text-center mb-4">User Profile</h1>

      {user ? (
        <>
          {editMode ? (
            <div>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={updatedUser?.name}
                  onChange={(e) =>
                    setUpdatedUser({ ...updatedUser!, name: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={updatedUser?.email}
                  onChange={(e) =>
                    setUpdatedUser({ ...updatedUser!, email: e.target.value })
                  }
                />
              </div>
              <button
                onClick={handleProfileUpdate}
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <strong className="text-gray-700">Name:</strong> {user.name}
              </div>
              <div className="mb-4">
                <strong className="text-gray-700">Email:</strong> {user.email}
              </div>
              <button
                onClick={() => setEditMode(true)}
                className="bg-yellow-500 text-white py-2 px-4 rounded-md"
              >
                Edit Profile
              </button>
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded-md"
            >
              Log Out
            </button>
          </div>
        </>
      ) : (
        <p>No user found.</p>
      )}
    </div>
  );
};

export default ProfilePage;
