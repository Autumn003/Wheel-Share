import React from "react";
import { useSelector } from "react-redux";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";

const Profile = () => {
  const { name, email, createdAt, avatar } = useSelector(
    (state) => state.user.user
  );

  return (
    <>
      <div className="m-10">
        <div className="p-5 md:flex-row flex shadow-lg rounded-lg md:justify-between flex-col justify-center md:items-baseline">
          <div className="md:block flex flex-col items-center">
            <img
              className="w-24 h-24 rounded-full object-fit"
              src={avatar}
              alt={`${name}'s avatar`}
            />
            <div className="my-3 text-center md:text-start">
              <h2 className="text-xl font-semibold mt-2">
                {name.toUpperCase()}
              </h2>
              <p className="text-gray-600">{email}</p>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" defaultValue={name} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    defaultValue={email}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    type="password"
                    id="email"
                    placeHolder="Enter your correct password"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-800">Member Since</h3>
          <p className="text-gray-600">{new Date(createdAt).toDateString()}</p>
        </div>
      </div>
    </>
  );
};

export default Profile;
