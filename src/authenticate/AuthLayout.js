import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import SigninPage from "./SigninPage";

export const AuthLayout = () => {
  const isLogged = useSelector((state) => state.auth?.isLogged);

  if (isLogged) {
    return <Navigate to="/" />;
  }
  return (
    <Routes>
      <Route path="/signin" element={<SigninPage />} />
    </Routes>
  );
};
