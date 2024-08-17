import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "../ui/loading-button.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "../../actions/user.action.js";
import { resetUserError } from "../../slices/user.slice.js";
import { ForgetPass } from "../index.js";

const Login = ({ isOpen, onOpenChange }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.user);
  const [isForgetPasswordOpen, setIsForgetPasswordOpen] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      loginUser({
        email: formData.email,
        password: formData.password,
      })
    );
  };

  useEffect(() => {
    if (isOpen && user) {
      navigate("/");
      onOpenChange(false);
    }
  }, [user, navigate, onOpenChange]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>LogIn</DialogTitle>
            <DialogDescription>
              If you don't have an account, please register.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="col-span-3"
                  type="email"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <DialogFooter className="mb-4">
              <div
                onClick={() => {
                  setIsForgetPasswordOpen(true), onOpenChange(false);
                }}
                className="text-blue-500"
              >
                Forget password?
              </div>
            </DialogFooter>
            <DialogFooter>
              {loading ? (
                <ButtonLoading />
              ) : (
                <Button type="submit">LogIn</Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <ForgetPass
        isOpen={isForgetPasswordOpen}
        onOpenChange={setIsForgetPasswordOpen}
      />
    </>
  );
};

export default Login;
