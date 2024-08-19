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
import { useSelector } from "react-redux";
import { resetPassword } from "../../actions/user.action.js";

const ResetPassword = () => {
  const { loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("reset submit");
    dispatch(
      resetPassword({
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      })
    );
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
          <CardContent>
            <form onSubmit={handleSubmit}>
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
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            {loading ? (
              <ButtonLoading />
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default ResetPassword;
