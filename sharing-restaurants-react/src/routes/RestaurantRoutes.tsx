import { Routes, Route } from "react-router-dom";
import Index from "@/page/restaurant/Index";

export function RestaurantRoutes() {
  return (
    <Routes>
      <Route index element={<Index />} />
      <Route path="create" element={<div>맛집 등록 모달</div>} />
      <Route path=":restaurantId" element={<div>맛집 조회 모달</div>} />
      <Route path=":restaurantId/edit" element={<div>맛집 수정 모달</div>} />
    </Routes>
  );
}
