import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuth2Redirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    console.log("OAuth2 Redirect Token:", token);
    
    if (token) {
      localStorage.setItem("token", token); // JWT 저장
      navigate("/"); // 로그인 성공 후 홈으로 이동
    } else {
      navigate("/login"); // 실패 시 로그인 페이지
    }
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
}
