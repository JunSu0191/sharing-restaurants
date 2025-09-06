import React, { useState, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";

const categories = ["전체", "한식", "중식", "일식", "양식", "카페/디저트", "이탈리안"];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState("전체");

  // 버튼 DOM ref 배열
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [highlightStyle, setHighlightStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  // 선택된 버튼 크기 측정해서 highlight 위치 업데이트
  useLayoutEffect(() => {
    const idx = categories.indexOf(selectedCategory);
    const btn = buttonRefs.current[idx];
    if (btn) {
      setHighlightStyle({
        left: btn.offsetLeft,
        width: btn.offsetWidth,
      });
    }
  }, [selectedCategory]);

  return (
    <main className="p-4">
      <div className="relative flex justify-start my-4">
        <div className="relative inline-flex bg-gray-100 rounded-xl p-1">
          <motion.div
            layout
            className="absolute top-1 bottom-1 rounded-xl bg-white shadow-md"
            animate={highlightStyle}
            transition={{ type: "spring", stiffness: 400, damping: 60 }}
          />
          {categories.map((cat, i) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                ref={(el) => { buttonRefs.current[i] = el; }}
                onClick={() => setSelectedCategory(cat)}
                className="relative z-10 px-4 py-2 text-sm font-medium"
              >
                <span className={isSelected ? "text-gray-900" : "text-gray-500"}>
                  {cat}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 여기서 다른 Index 페이지 콘텐츠 추가 가능 */}
      <div>맛집 목록 등 본문 내용</div>
    </main>
  );
}
