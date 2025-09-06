// ...existing code...
import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface LoginFormProps {
  initialEmail?: string;
  onSubmit?: (email: string, password: string) => Promise<any> | void;
  errorMessage?: string | null;
}

export function LoginForm({
  initialEmail = "",
  onSubmit,
  errorMessage,
}: LoginFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    let ok = true;
    setEmailError(null);
    setPasswordError(null);
    setFormError(null);

    const emailTrim = email.trim();
    if (!emailTrim) {
      setEmailError("이메일을 입력하세요.");
      ok = false;
    } else {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(emailTrim)) {
        setEmailError("유효한 이메일을 입력하세요.");
        ok = false;
      }
    }

    if (!password) {
      setPasswordError("비밀번호를 입력하세요.");
      ok = false;
    } else if (password.length < 8) {
      setPasswordError("비밀번호는 최소 8자 이상이어야 합니다.");
      ok = false;
    }

    return ok;
  };

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const result = onSubmit?.(email.trim(), password);
      await Promise.resolve(result);
      setEmail("");
      setPassword("");
    } catch (err: any) {
      const msg =
        (err && (err.message || err.response?.data?.message || String(err))) ||
        "로그인에 실패했습니다.";
      setFormError(msg);
    } finally {
      setLoading(false);
    }
  };

  const onSocial = (provider: "google" | "kakao" | "naver") => {
    window.location.href = `/oauth2/authorization/${provider}`;
  };

  return (
    <form onSubmit={handle} className="space-y-4" noValidate>
      <div className="space-y-1">
        <div className="flex justify-center">
          {/* 서버에서 넘어온 에러 메시지(있으면 이메일 위에 표시) */}
          {errorMessage && (
            <p
              id="login-form-error"
              className="text-red-600 py-1 px-3 text-base rounded-md bg-red-100"
            >
              {errorMessage}
            </p>
          )}
        </div>

        <Label htmlFor="login-email">이메일</Label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Mail className="w-4 h-4" />
          </span>
          <Input
            id="login-email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(null);
            }}
            className="pl-10"
            aria-invalid={!!emailError}
            aria-describedby={
              emailError
                ? "login-email-error"
                : errorMessage
                ? "login-form-error"
                : undefined
            }
          />
        </div>
        {emailError && (
          <p id="login-email-error" className="mt-1 text-xs text-red-600">
            {emailError}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="login-password">비밀번호</Label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Lock className="w-4 h-4" />
          </span>
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError(null);
            }}
            className="pl-10"
            aria-invalid={!!passwordError || !!formError}
            aria-describedby={
              passwordError
                ? "login-password-error"
                : formError
                ? "login-form-error"
                : undefined
            }
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
        </div>
        {passwordError && (
          <p id="login-password-error" className="mt-1 text-xs text-red-600">
            {passwordError}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={loading}
      >
        {loading ? "로그인 중…" : "로그인"}
      </Button>

      {formError && (
        <p id="login-form-error" className="text-sm text-red-600 text-center">
          {formError}
        </p>
      )}

      <div className="flex items-center gap-3 my-2">
        <div className="h-px bg-gray-200 flex-1" />
        <span className="text-xs text-gray-500">또는</span>
        <div className="h-px bg-gray-200 flex-1" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => onSocial("google")}
          className="flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
        >
          Google
        </button>

        <button
          type="button"
          onClick={() => onSocial("kakao")}
          className="flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
        >
          Kakao
        </button>

        <button
          type="button"
          onClick={() => onSocial("naver")}
          className="flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
        >
          Naver
        </button>
      </div>
    </form>
  );
}
