import * as React from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { lazy } from "react";
import { useCookies } from "react-cookie";

const portalNamespace = {
  Home: lazy(() => import("./home/home")),
  Auth: lazy(() => import("./auth/auth")),
  Category: lazy(() => import("./category/category")),
  Product: lazy(() => import("./product/product")),
};

const SharedNamespace = {
  Error: lazy(() => import("../component/error/error")),
};

const LayoutNamespace = {
  Layout: lazy(() => import("../component/layout/main/main")),
};

function PortalModule() {
  const navigation = useNavigate();
  const [cookies] = useCookies(['ACCESS_TOKEN']);

  React.useEffect(() => {
    if (!cookies.ACCESS_TOKEN && window.location.pathname !== "/login") {
      navigation("/login");
    }
  }, [cookies, navigation]);

  return (
    <Routes>
      {cookies.ACCESS_TOKEN ? (
        <>
          <Route path="login" element={<Navigate to="/" />} />

          <Route path="" element={<LayoutNamespace.Layout />}>
            <Route path="/product" element={<portalNamespace.Product />} />
            <Route path="/category" element={<portalNamespace.Category />} />
            <Route path="/" element={<portalNamespace.Home />} />
            <Route path="home" element={<Navigate to="/" />} />
          </Route>
        </>
      ) : (
        <>
          <Route path="login" element={<portalNamespace.Auth />} />

          <Route path="*" element={<Navigate to="/login" />} />
        </>
      )}

      <Route path="*" element={<SharedNamespace.Error />} />
    </Routes>
  );
}

export default PortalModule;
