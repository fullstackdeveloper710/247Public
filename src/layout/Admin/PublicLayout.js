import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "routes/constant";
import { usersTypes } from "util/helpers";
import { isExpired } from "react-jwt";

const PublicLayout = ({ children }) => {
  const { userAuth } = useSelector((state) => state.app);
  const {
    token,
    user: { role },
  } = userAuth;
  const { user } = usersTypes;
  const location = useLocation();
  const path = location?.state?.url;

  const isMyTokenExpired = isExpired(token);
  return isMyTokenExpired ? (
    <>{children}</>
  ) : role && role === user ? (
    <Navigate to={path?path:ROUTES.DASHBOARD} replace={true} />
  ) : role ? (
    <Navigate to={path?path:ROUTES.DASHBOARD} replace={true} />
  ) : null;
};

export default PublicLayout;
