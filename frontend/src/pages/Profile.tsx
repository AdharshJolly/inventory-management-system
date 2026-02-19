import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Lock, Save, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    setProfileLoading(true);
    try {
      const res = await api.put("/auth/profile", data);
      // Update local storage and context
      const authData = JSON.parse(localStorage.getItem("ims_auth") || "{}");
      authData.user = res.data;
      localStorage.setItem("ims_auth", JSON.stringify(authData));

      toast.success("Profile updated successfully");
      // Force refresh of user data in context (simple way is window reload or updating context)
      window.location.reload();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setPasswordLoading(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password updated successfully. Please login again.");
      resetPassword();
      // Logout after password change for security
      setTimeout(() => {
        localStorage.removeItem("ims_auth");
        window.location.href = "/login";
      }, 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Account Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Manage your profile information and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">
            Profile Information
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Update your account's profile information and email address.
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-700/60 p-6">
            <form
              onSubmit={handleProfileSubmit(onProfileSubmit)}
              className="space-y-4"
            >
              <Input
                label="Full Name"
                {...registerProfile("name")}
                error={profileErrors.name?.message}
                placeholder="Your Name"
              />
              <Input
                label="Email Address"
                {...registerProfile("email")}
                error={profileErrors.email?.message}
                placeholder="your@email.com"
              />

              <div className="flex items-center gap-2.5 mt-4 p-3.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-700 dark:text-indigo-400 text-xs ring-1 ring-indigo-100 dark:ring-indigo-800/30">
                <ShieldCheck size={16} />
                <span>
                  Role:{" "}
                  <strong className="capitalize">
                    {user?.role?.replace("-", " ")}
                  </strong>
                </span>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  type="submit"
                  loading={profileLoading}
                  className="gap-2"
                >
                  <Save size={18} />
                  Save Profile
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="md:col-span-1">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">
            Security
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Ensure your account is using a long, random password to stay secure.
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-700/60 p-6">
            <form
              onSubmit={handlePasswordSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <Input
                label="Current Password"
                type="password"
                {...registerPassword("currentPassword")}
                error={passwordErrors.currentPassword?.message}
                placeholder="••••••••"
              />
              <div className="h-px bg-gray-100 dark:bg-gray-700/50 my-4" />
              <Input
                label="New Password"
                type="password"
                {...registerPassword("newPassword")}
                error={passwordErrors.newPassword?.message}
                placeholder="••••••••"
              />
              <Input
                label="Confirm New Password"
                type="password"
                {...registerPassword("confirmPassword")}
                error={passwordErrors.confirmPassword?.message}
                placeholder="••••••••"
              />

              <div className="flex justify-end mt-6">
                <Button
                  type="submit"
                  loading={passwordLoading}
                  className="gap-2"
                  variant="danger"
                >
                  <Lock size={18} />
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
