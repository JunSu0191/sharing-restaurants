import { ChefHat, LogIn, LogOut, User, Home, List, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { AuthModal } from "./auth/AuthModal";
import { useLocation, useNavigate } from "react-router-dom";

interface HeaderProps {
  isLoggedIn: boolean;
  user: { name: string; avatar?: string } | null;
  onLogoutClick: () => void;
  onAddRestaurantClick: () => void;
}

export function Header({
  isLoggedIn,
  user,
  onLogoutClick,
  onAddRestaurantClick,
}: HeaderProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentView = location.pathname;


  function onLoginClick() {
    setIsAuthModalOpen(true);
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <ChefHat className="w-8 h-8 text-primary" />
            <span className="text-xl font-semibold text-gray-900">
              맛집공유
            </span>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Button
              variant={currentView === "/" ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />홈
            </Button>
            <Button
              variant={currentView === "restaurant" ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("restaurant")}
              className="flex items-center gap-2"
            >
              <List className="w-4 h-4" />
              맛집목록
            </Button>

            {/* Add Restaurant Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onAddRestaurantClick}
              className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Plus className="w-4 h-4" />
              맛집등록
            </Button>
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {/* Mobile Add Restaurant Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onAddRestaurantClick}
              className="md:hidden flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Plus className="w-4 h-4" />
              등록
            </Button>

            {isLoggedIn && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 p-2"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="w-4 h-4 mr-2" />내 프로필
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogoutClick}>
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={onLoginClick}
                className="bg-primary hover:bg-primary/90"
              >
                <LogIn className="w-4 h-4 mr-2" />
                로그인
              </Button>
            )}
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
}
