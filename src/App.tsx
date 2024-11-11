import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./page/Home";
import Login from "./page/Login";
import Story from "./page/Story";
import Navbar from "./Components/Navbar";

const App = () => {
  const userinfo = localStorage.getItem("userinfo");

  const isAuthenticated = userinfo ? JSON.parse(userinfo) : null;

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/story"
          element={isAuthenticated ? <Story /> : <Navigate to={"/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
