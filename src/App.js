import React from "react";
import { Routes, Route, useNavigate, useLocation, Navigate, Outlet } from "react-router-dom";

import { customHistory } from "./_helpers";
import { useSelector } from "react-redux";

import { AuthLayout } from "./authenticate/AuthLayout";

import DefaultNavbar from "./components/Navbar";
import DefaultFooter from "./components/Footer";
import DefaultAlert from "./components/Alert";

import HomePage from "./pages/Home";
import AdminPage from "./pages/Admin";
import AboutPage from "./pages/About";
import ManagerPage from "./pages/Manager";
import UnauthorizedPage from "./pages/Unauthorized";
import { UsersLayout } from "./users";
import AppointmentEdit from "./appointments/AppointmentEdit";

function PrivateRoutes({ roles, children }) {
  const isLogged = useSelector((state) => state.auth?.isLogged);
  const userRoles = useSelector((state) => state.auth?.roles);

  if (!isLogged) {
    return <Navigate to='/auth/signin' state={{ from: customHistory.location }} />;
  }
  if ((roles && userRoles?.includes(roles)) || userRoles?.includes("ROLE_ADMIN")) {
    return <Outlet>{children}</Outlet>;
  }
  return null
}

function App() {
  customHistory.navigate = useNavigate();
  customHistory.location = useLocation();
  // 

  
  

  return (
    <>
      <DefaultNavbar />
      <DefaultAlert />
      <Routes>
        <Route exact path="/auth/*" element={<AuthLayout />} />

        <Route element={<PrivateRoutes roles='ROLE_MODERATOR'/>}>
        <Route path="/manager" element={<ManagerPage />} />
        {/* <Route path="/appointments/edit/:id" element={<AppointmentEdit />} /> */}
        </Route>

        <Route element={<PrivateRoutes roles='ROLE_ADMIN'/>}>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="users/*" element={<UsersLayout />} />
        <Route path="/appointments/edit/:id" element={<AppointmentEdit />}/>

        </Route>

        <Route element={<PrivateRoutes roles='ROLE_ADMIN'/>}>
        <Route path="/" element={<HomePage />} />
        </Route>

        <Route path="/about" element={<AboutPage />} />

        <Route path="*" element={<UnauthorizedPage />} />
      </Routes>
      <DefaultFooter />
    </>
  );
}

export default App;
