"use client";

import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Image as ImageIcon } from "lucide-react";

import { profileSchema, passwordSchema } from "@/lib/validation/account";
import { useCurrentUser } from "@/hooks/useAuth";
import {
  useUpdateAccount,
  useChangePassword,
  useUpdateAvatar,
  useUpdateCoverImage,
} from "@/hooks/useAccount";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PasswordInput } from "@/components/shared/PasswordInput";

export default function ProfilePage() {
  const { data: user } = useCurrentUser();
  const { mutate: updateAccount, isPending: savingProfile } = useUpdateAccount();
  const { mutate: changePassword, isPending: changingPw } = useChangePassword();
  const { mutate: updateAvatar, isPending: uploadingAvatar } = useUpdateAvatar();
  const { mutate: updateCover, isPending: uploadingCover } =
    useUpdateCoverImage();

  const avatarInput = useRef(null);
  const coverInput = useRef(null);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: "", email: "" },
  });
  const pwForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { oldPassword: "", newPassword: "" },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        fullName: user.fullName || "",
        email: user.email || "",
      });
    }
  }, [user, profileForm]);

  const onSaveProfile = (values) => updateAccount(values);
  const onChangePw = (values) =>
    changePassword(values, {
      onSuccess: () => pwForm.reset({ oldPassword: "", newPassword: "" }),
    });

  const onAvatarPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("avatar", file);
    updateAvatar(fd);
    e.target.value = "";
  };
  const onCoverPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("coverImage", file);
    updateCover(fd);
    e.target.value = "";
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-bold">Account settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile media</CardTitle>
          <CardDescription>Your avatar and channel cover image.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-28 w-full overflow-hidden rounded-lg bg-muted">
            {user?.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.coverImage}
                alt="Cover"
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src={user?.avatar} alt={user?.username} />
              <AvatarFallback className="text-xl">
                {user?.fullName?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-wrap gap-2">
              <input
                ref={avatarInput}
                type="file"
                accept="image/*"
                hidden
                onChange={onAvatarPick}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploadingAvatar}
                onClick={() => avatarInput.current?.click()}
              >
                <Camera className="size-4" />
                {uploadingAvatar ? "Uploading..." : "Change avatar"}
              </Button>
              <input
                ref={coverInput}
                type="file"
                accept="image/*"
                hidden
                onChange={onCoverPick}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploadingCover}
                onClick={() => coverInput.current?.click()}
              >
                <ImageIcon className="size-4" />
                {uploadingCover ? "Uploading..." : "Change cover"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile details</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={profileForm.handleSubmit(onSaveProfile)}
            className="flex flex-col gap-4"
          >
            <Controller
              control={profileForm.control}
              name="fullName"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="fullName">Full name</FieldLabel>
                  <Input id="fullName" {...field} />
                  <FieldError
                    errors={fieldState.error ? [fieldState.error] : []}
                  />
                </Field>
              )}
            />
            <Controller
              control={profileForm.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input id="email" type="email" {...field} />
                  <FieldError
                    errors={fieldState.error ? [fieldState.error] : []}
                  />
                </Field>
              )}
            />
            <div>
              <Button type="submit" variant="crm" disabled={savingProfile}>
                {savingProfile ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={pwForm.handleSubmit(onChangePw)}
            className="flex flex-col gap-4"
          >
            <Controller
              control={pwForm.control}
              name="oldPassword"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="oldPassword">Current password</FieldLabel>
                  <PasswordInput id="oldPassword" field={field} />
                  <FieldError
                    errors={fieldState.error ? [fieldState.error] : []}
                  />
                </Field>
              )}
            />
            <Controller
              control={pwForm.control}
              name="newPassword"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="newPassword">New password</FieldLabel>
                  <PasswordInput id="newPassword" field={field} />
                  <FieldError
                    errors={fieldState.error ? [fieldState.error] : []}
                  />
                </Field>
              )}
            />
            <div>
              <Button type="submit" variant="crm" disabled={changingPw}>
                {changingPw ? "Updating..." : "Update password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
