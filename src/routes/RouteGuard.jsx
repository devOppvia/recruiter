import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function RouteGuard({ children }) {
  const location = useLocation();

  useEffect(() => {
    const allowedRoutes = [
      "/create-account",
      "/create-company-details",
      "/create-company-location",
      "/create-company-social-media",
      "/verify-otp-email",
      "/verify-otp-mobile"
    ];

    // If current route is not in allowed list, clear steps
    if (!allowedRoutes.includes(location.pathname)) {
      localStorage.removeItem("step1");
      localStorage.removeItem("step2");
      localStorage.removeItem("step3");
      localStorage.removeItem("step4");

    }
  }, [location.pathname]);

  return children;
}

export default RouteGuard;
