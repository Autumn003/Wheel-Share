import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localPath) => {
  try {
    if (!localPath) {
      console.log("did not get the localpath of file");
      return null;
    }
    const response = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
      folder: "wheelShare/avatars",
      width: 550,
      crop: "scale",
    });
    fs.unlinkSync(localPath);

    return response;
  } catch (error) {
    fs.unlinkSync(localPath);
    console.log("failure to upload file on cloudinary");
    return null;
  }
};

export { uploadOnCloudinary };
