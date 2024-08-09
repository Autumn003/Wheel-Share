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
// import Register from "@/components/Register"; // Update the path if needed
import Register from "../user/Register.jsx";
import Login from "../user/Login";

const Header = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <div className="h-20 sticky top-0 z-50 flex justify-between p-4 items-center bg-[rgba(0,0,0,0.50)] shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[6.8px]">
        <div> Wheel Share </div>
        <div className="flex justify-between w-[50%]">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="link" size="icon">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>Profile</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsRegisterOpen(true)}>
                SignUp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsLoginOpen(true)}>
                Login
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Register Dialog */}
      <Register isOpen={isRegisterOpen} onOpenChange={setIsRegisterOpen} />

      {/* You can duplicate the Register component if you have a separate Login dialog component */}
      <Login isOpen={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </>
  );
};

export default Header;
