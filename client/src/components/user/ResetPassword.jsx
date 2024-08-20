import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ButtonLoading } from "../ui/loading-button";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../actions/user.action.js";
import { useNavigate, useParams } from "react-router-dom";
import { resetUserError } from "../../slices/user.slice.js";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const { token } = useParams();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      resetPassword({
        token,
        userData: {
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
      })
    )
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch(() => dispatch(resetUserError()));
  };

  return (
    <>
      <div className="flex p-16">
        <Card className="w-[350px] m-auto">
          <CardHeader>
            <CardTitle>Reset password</CardTitle>
            <CardDescription>
              Choose your new password & login agian.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input
                    id="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    type="password"
                    placeholder="Enter your new password"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your new password"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {loading ? (
                <ButtonLoading />
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
};

export default ResetPassword;
