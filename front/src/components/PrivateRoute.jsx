import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin");
  const [isTokenValid, setIsTokenValid] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          localStorage.removeItem("isAdmin");
          localStorage.removeItem("store");
          localStorage.removeItem("userInfo");
          setIsTokenValid(false);
        }
      } catch (error) {
        setIsTokenValid(false);
      }
    } else {
      setIsTokenValid(false);
    }
  }, [token]);

  if (!isTokenValid) {
    return <Navigate to="/login" />;
  }

  if (isAdmin === "1") {
    return <Navigate to="/isStore" />;
  }

  return children;
};

export default PrivateRoute;
