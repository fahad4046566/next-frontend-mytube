"use client";

import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "@/lib/validation/auth";
import { useLogin } from "@/hooks/useAuth";
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
import { PasswordInput } from "@/components/shared/PasswordInput";

export default function LoginPage() {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
    mode: "all",
  });
  const { mutate: login, isPending } = useLogin();

  const onSubmit = (values) => {
    const identifier = values.identifier.trim();
    const isEmail = identifier.includes("@");
    login({
      [isEmail ? "email" : "username"]: identifier,
      password: values.password,
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Log in to your MyTube account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Controller
            control={control}
            name="identifier"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="identifier">Email or username</FieldLabel>
                <Input id="identifier" placeholder="you@example.com" {...field} />
                <FieldError errors={fieldState.error ? [fieldState.error] : []} />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <PasswordInput field={field} />
                <FieldError errors={fieldState.error ? [fieldState.error] : []} />
              </Field>
            )}
          />
          <Button type="submit" className="mt-2 w-full" disabled={isPending}>
            {isPending ? "Logging in..." : "Log in"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
