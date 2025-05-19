import React from "react";
import Avatar from "react-avatar";
import { useNavigate } from "react-router-dom";

const RightDivTop = () => {
  const user = localStorage.getItem("userInfo") || {}; // Fallback to an empty object
  //console.log(user);

  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
  };

  return (
    <div>
      <div className="flex justify-between items-center bg-[#060c18] text-white px-4 py-4">
        <div className="flex items-center space-x-2">
          <div>
            <p className="text-right border-b-2 border-yellow-100 font-semibold">{user || "Vendeur"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightDivTop;
