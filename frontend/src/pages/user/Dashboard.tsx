import React from "react";
import UserMenu from "../../components/nav/UserMenu";
import { useSelector } from "react-redux";
import { TRootState } from "../../redux/store";

const UserDashboard = () => {
  const { user } = useSelector((state: TRootState) => state.userReducer);

  return (
    <div className="w-full h-full flex flex-col flex-grow">
      <div className="break-normal flex-grow-0 h-1/3 bg-green-800 flex items-center justify-center">
        Hello {user!.name}
      </div>
      <div className="flex-grow-0 bg-green-800 flex justify-center text-5xl font-semibold pb-2">
        Welcome to your {user!.role}-dashboard
      </div>

      <div className="flex flex-grow">
        <div className="w-1/4">
          <UserMenu />
        </div>

        <div className="w-3/4 p-4">
          <div className="p-3 mb-2 text-lg font-semibold bg-gray-200">
            User Information
          </div>
          <ul className="list-none">
            <li className="py-2">Name: {user!.name}</li>
            <li className="py-2">Email: {user!.email}</li>
            <li className="py-2">Role: {user!.role}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
