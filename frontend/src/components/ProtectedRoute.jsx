import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  let data = null;

  try {
    const storedData = localStorage.getItem("data");
    data = storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error("Error parsing localStorage data:", error);
    localStorage.removeItem("data"); // Clear invalid data
  }

  // Check if isLoggedIn is "true" and data is a non-empty object
  const isAuthenticated = isLoggedIn === "true" && data && Object.keys(data).length > 0;

  if (!isAuthenticated) {
    // Redirect to login, preserve current location in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;