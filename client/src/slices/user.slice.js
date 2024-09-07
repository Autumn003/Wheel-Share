import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUser,
  forgetPassword,
  registerUser,
  resetPassword,
  updatePassword,
  updateUser,
  updateUserAvatar,
} from "../actions/user.action";
import { loginUser } from "../actions/user.action";
import { logoutUser } from "../actions/user.action";
import { toast } from "@/components/ui/use-toast";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },

  reducers: {
    resetUserError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(forgetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = null;
        toast({
          title: "Password Reset Email Sent",
          description: "Check your email to reset your password.",
          status: "success",
        });
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast({
          variant: "destructive",
          description: action.payload,
          status: "error",
        });
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        toast({
          title: "Password updated",
          description:
            "password updated successfully, login with new password.",
          status: "success",
        });
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast({
          variant: "destructive",
          description: action.payload,
          status: "error",
        });
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        toast({
          title: "Name & Email updated",
          description: "Your details has been updated.",
          status: "success",
        });
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast({
          variant: "destructive",
          description: action.payload,
          status: "error",
        });
      })
      .addCase(updateUserAvatar.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserAvatar.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        toast({
          title: "Profile Update",
          status: "success",
        });
      })
      .addCase(updateUserAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast({
          variant: "destructive",
          description: action.payload,
          status: "error",
        });
      })
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        // state.user = action.payload;
        toast({
          title: "Password Update",
          status: "success",
        });
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast({
          variant: "destructive",
          description: action.payload,
          status: "error",
        });
      });
  },
});

export const { resetUserError } = userSlice.actions;
export default userSlice.reducer;
