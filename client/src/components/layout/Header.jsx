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
import { CirclePlus, Search } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const user = useSelector((state) => state.user.user);

  return (
    <>
      <div className="h-20 sticky top-0 z-50 flex justify-between p-4 items-center bg-[rgba(0,0,0,0.50)] shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[6.8px]">
        <div>
          <img src="/logo.png" alt="" className="h-32" />
        </div>
        <div className="flex justify-end md:space-x-4 w-[50%]">
          <Button
            className="md:gap-1 hover:text-sky-500 duration-200 ease-in"
            variant="ghost"
            onClick={() => navigate("/search-ride")}
          >
            <Search /> <span className="md:block hidden">Search Ride</span>
          </Button>
          <Button
            className="md:gap-1 hover:text-sky-500 duration-200 ease-in"
            variant="ghost"
            onClick={() => navigate("/create-ride")}
          >
            <CirclePlus /> <span className="md:block hidden">Create Ride</span>
          </Button>
          <ModeToggle className="p-4" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="link" size="icon">
                <Avatar>
                  <AvatarImage
                    src={user?.avatar || "/Profile.png"}
                    className="object-cover"
                  />
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
