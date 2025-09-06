import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import Index from "./page/Index";
import OAuth2Redirect from "./page/auth/OAuth2Redirect";
import { useAuth } from "./contexts/AuthContext";
import { Header } from "./components/Header";
import { RestaurantRoutes } from "./routes/RestaurantRoutes";

function App() {
  const navigate = useNavigate();
  const { token, user: authUser, logout } = useAuth();

  // 로그인 성공 시에만 isLoggedIn true
  const isLoggedIn = Boolean(authUser ?? token);
  const user = authUser ?? null; // authUser가 있으면 실제 user 전달

  const onLogoutClick = () => {
    logout();
    navigate("/"); // 로그아웃 후 메인 이동
  };
  const onAddRestaurantClick = () => navigate("/add");

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        user={user}
        onLogoutClick={onLogoutClick}
        onAddRestaurantClick={onAddRestaurantClick}
      />

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/index" element={<Index />} />
        <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
        <Route path="/profile" element={<div>My Page</div>} />

        {/* 맛집목록 */}
        <Route path="/restaurant/*" element={<RestaurantRoutes />} />
      </Routes>
    </>
  );
}

export default App;