import React, { useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Login, Logout, Register } from "../index";

const Header = () => {
  const navigate = useNavigate();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const user = useSelector((state) => state.user.user);

  return (
    <>
      <div className="h-20 sticky top-0 z-50 flex justify-between p-4 items-center bg-[rgba(0,0,0,0.50)] shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[6.8px]">
        <div> Wheel Share </div>
        <div className="flex justify-end space-x-4 w-[50%]">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="link" size="icon">
                <Avatar>
                  <AvatarImage src={user?.avatar || "/Profile.png"} />
                  <AvatarFallback>Profile</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user ? (
                <>
                  <DropdownMenuItem onClick={() => navigate("profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsLogoutOpen(true)}>
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => setIsRegisterOpen(true)}>
                    SignUp
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsLoginOpen(true)}>
                    Login
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Dialogs */}
      <Register isOpen={isRegisterOpen} onOpenChange={setIsRegisterOpen} />
      <Login isOpen={isLoginOpen} onOpenChange={setIsLoginOpen} />
      <Logout isOpen={isLogoutOpen} onOpenChange={setIsLogoutOpen} />
    </>
  );
};

export default Header;
