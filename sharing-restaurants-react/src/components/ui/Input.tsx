import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<"input">
>(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        // 레이아웃 / 사이징
        "h-9 w-full min-w-0 rounded-md px-3 py-1 text-base md:text-sm",

        // 배경 / 텍스트 / 플레이스홀더
        "bg-white text-gray-900 placeholder:text-gray-400",
        "dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500",

        // 테두리
        "border border-gray-300 dark:border-gray-700",

        // 파일 입력 스타일
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",

        // 선택 및 비활성
        "selection:bg-primary selection:text-primary-foreground",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",

        // 포커스 / 유효성
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",

        // 전환
        "transition-colors transition-shadow",

        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
