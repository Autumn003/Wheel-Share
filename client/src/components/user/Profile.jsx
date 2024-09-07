import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import {
  updatePassword,
  updateUser,
  updateUserAvatar,
} from "@/actions/user.action";
import { ButtonLoading } from "../ui/loading-button";
import { Pencil } from "lucide-react";

const Profile = () => {
  const dispatch = useDispatch();
  const { name, email, createdAt, avatar } = useSelector(
    (state) => state.user.user
  );
  const { loading } = useSelector((state) => state.user);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  const [avatarFile, setAvatarFile] = useState(null);
  const [formData, setFormData] = useState({
    name: name,
    email: email,
    password: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
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

    dispatch(
      updateUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
    ).then(() => setIsDialogOpen(false));
  };

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleAvatarSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    dispatch(updateUserAvatar(formData))
      .unwrap()
      .then(() => setIsAvatarDialogOpen(false));
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.id]: e.target.value,
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    dispatch(
      updatePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      })
    ).then(() => setPasswordDialogOpen(false));
  };

  return (
    <>
      <div className="m-10">
        <div className="p-5 md:flex-row flex shadow-lg rounded-lg md:justify-between flex-col justify-center md:items-baseline">
          <div className="md:block flex flex-col items-center">
            <div className="flex items-baseline gap-1">
              <img
                className="w-24 h-24 rounded-full object-cover"
                src={avatar || "/Profile.png"}
                alt={`${name}'s avatar`}
              />
              <Dialog
                open={isAvatarDialogOpen}
                onOpenChange={setIsAvatarDialogOpen}
              >
                <DialogTrigger asChild>
                  <Pencil className=" size-8 p-[6px] rounded-md cursor-pointer hover:bg-secondary duration-150" />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Chane iamge</DialogTitle>
                    <DialogDescription>
                      Choose an image to changes your profile image. Click save
                      when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAvatarSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="">
                        <Input
                          type="file"
                          id="avatar"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="col-span-3 bg-secondary border border-primary cursor-pointer"
                        />
                      </div>

                      <DialogFooter>
                        {loading ? (
                          <ButtonLoading />
                        ) : (
                          <Button type="submit">Save changes</Button>
                        )}
                      </DialogFooter>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="my-3 text-center md:text-start">
              <h2 className="text-xl font-semibold mt-2">
                {name.toUpperCase()}
              </h2>
              <p className="text-gray-600">{email}</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      defaultValue={name}
                      onChange={handleChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={email}
                      className="col-span-3"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Password
                    </Label>
                    <Input
                      type="password"
                      id="password"
                      onChange={handleChange}
                      placeholder="Enter your correct password"
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>

                <DialogFooter>
                  {loading ? (
                    <ButtonLoading />
                  ) : (
                    <Button type="submit">Save changes</Button>
                  )}
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-800">Member Since</h3>
          <p className="text-gray-600">{new Date(createdAt).toDateString()}</p>
        </div>
        <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              onClick={() => setPasswordDialogOpen(true)}
            >
              Change Password
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Change your password and get access with your new password only.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePasswordSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-6 items-center gap-4">
                  <Label
                    htmlFor="oldPassword"
                    className="text-center col-span-2"
                  >
                    Old Password
                  </Label>
                  <Input
                    id="oldPassword"
                    type="password"
                    onChange={handlePasswordChange}
                    placeholder="Enter your old password"
                    className="col-span-4"
                    required
                  />
                </div>
                <div className="grid grid-cols-6 items-center gap-4">
                  <Label
                    htmlFor="newPassword"
                    className="text-center col-span-2"
                  >
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    className="col-span-4"
                    placeholder="Enter your new password"
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-6 items-center gap-[14px]">
                  <Label
                    htmlFor="Confirm password"
                    className="text-center col-span-2"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    onChange={handlePasswordChange}
                    placeholder="Confirm your password"
                    className="col-span-4"
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                {loading ? (
                  <ButtonLoading />
                ) : (
                  <Button type="submit">Save changes</Button>
                )}
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Profile;
