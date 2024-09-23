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
import { useNavigate } from "react-router-dom";
import { getRideDetails } from "@/actions/ride.action";
import { MetaData } from "..";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    name,
    email,
    createdAt,
    avatar,
    ridesHistory,
    _id: userId,
  } = useSelector((state) => state.user.user);

  const { loading } = useSelector((state) => state.user);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  const [avatarFile, setAvatarFile] = useState(null);
  const [formData, setFormData] = useState({
    name: name,
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

  const handleRideClick = (id) => {
    if (id) {
      getRideDetails(id);
      navigate(`/ride/${id}`);
    } else {
      console.log("Ride id not found");
    }
  };

  return (
    <>
      <MetaData title="Your profile | Wheel Share" />
      <div className="m-10">
        <div className="p-5 md:flex-row flex shadow-lg rounded-lg md:justify-between flex-col justify-center ">
          <div className="flex flex-col items-center">
            <Dialog
              open={isAvatarDialogOpen}
              onOpenChange={setIsAvatarDialogOpen}
            >
              <DialogTrigger asChild>
                <div className="relative rounded-full overflow-hidden cursor-pointer hover:scale-105 duration-200 ease-in-out">
                  <img
                    className="w-28 h-28 rounded-full object-cover border p-1 border-primary relative"
                    src={avatar || "/Profile.png"}
                    alt={`${name}'s avatar`}
                  />
                  <Pencil className="absolute text-gray-300  bottom-0 py-1 size-7 bg-[rgba(0,0,0,0.40)] w-full " />
                </div>
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
            <div className="my-3 text-center md:text-start">
              <h2 className="text-xl font-semibold mt-2">
                {name.toUpperCase()}
              </h2>
              <p className="text-gray-600">{email}</p>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-5">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-800">
                Member Since
              </h3>
              <p className="text-gray-600">
                {new Date(createdAt).toDateString()}
              </p>
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
            <Dialog
              open={passwordDialogOpen}
              onOpenChange={setPasswordDialogOpen}
            >
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
                    Change your password and get access with your new password
                    only.
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
        </div>
        <div className="mt-5">
          <h2 className="text-2xl font-semibold">Published Rides</h2>
          <div className="mt-3 cursor-pointer">
            {ridesHistory.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {ridesHistory
                  .filter((ride) => ride.driver === userId)
                  .map((ride) => (
                    <div
                      key={ride._id}
                      className="p-4 border rounded-lg shadow-md md:flex justify-between"
                      onClick={() => handleRideClick(ride.rideId)}
                    >
                      <div>
                        <p className="">
                          From:{" "}
                          <span className="text-gray-400">
                            {ride.source.name}
                          </span>
                        </p>
                        <p className="">
                          To:{" "}
                          <span className="text-gray-400">
                            {ride.destination.name}
                          </span>
                        </p>
                      </div>
                      <p className="text-gray-500">
                        {new Date(ride.departureTime).toDateString()}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex items-center justify-center md:h-56 h-24">
                <h3 className="text-secondary text-xl font-semibold">
                  No rides published yet.
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
