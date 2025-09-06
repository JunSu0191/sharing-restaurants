import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { useMutation } from "@tanstack/react-query";
import { authApi, LoginRequest, RegisterRequest } from "@/api/auth";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import React from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginErrorMessage, setLoginErrorMessage] = React.useState<string | null>(null);
  // const [signupErrorMessage, setSignupErrorMessage] = React.useState<string | null>(null);

  const handleLogin = (email: string, password: string) => {
    loginMutation.mutate({ email, password });
  };

  const handleSignup = (name: string, email: string, password: string) => {
    signupMutation.mutate({ name, email, password });
  };

  const signupMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: () => {
      onClose();
      navigate("/");
    },
    onError: (err: any) => {
      console.log("err", err);
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => login(data.email, data.password),
    onSuccess: () => {
      onClose();
      navigate("/");
    },
    onError: (err: any) => {
      setLoginErrorMessage("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
      console.log("err", err);
      
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md duration-200">
        <DialogHeader>
          <DialogTitle className="text-center text-primary">
            맛집공유에 오신 것을 환영합니다!
          </DialogTitle>
          <DialogDescription className="text-center">
            로그인하여 더 많은 기능을 이용해보세요.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">로그인</TabsTrigger>
            <TabsTrigger value="signup">회원가입</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-6">
            <LoginForm onSubmit={handleLogin}
              errorMessage={loginErrorMessage}
            />
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-6">
            <SignupForm
              onSubmit={handleSignup}
              isPending={signupMutation.isPending}
            />
          </TabsContent>
        </Tabs>

        <div className="text-center text-xs text-gray-500 mt-4">
          회원가입 시{" "}
          <a href="#" className="text-primary hover:underline">
            이용약관
          </a>{" "}
          및{" "}
          <a href="#" className="text-primary hover:underline">
            개인정보처리방침
          </a>
          에 동의하게 됩니다.
        </div>
      </DialogContent>
    </Dialog>
  );
}
