"use client";

import Link from "next/link";
import { toast } from "sonner";

import SignInForm, {
  SignInFormSchemaType,
} from "@/app/(authentication)/sign-in/form";
import { Logo } from "@/components/icon";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { $api } from "@/lib/api/client";
import { useUserActions } from "@/store/userStore";

function SignInPage() {
  const { setUser } = useUserActions();
  const { mutate, isSuccess, isPending } = $api.useMutation(
    "post",
    "/auth/login",
    {
      onSuccess(data) {
        toast.success("Sign-in successful! Welcome back.");
        setUser(data.user);
        window.location.href = "/home";
      },
      onError(error: unknown) {
        const message =
          typeof error === "object" && error !== null && "detail" in error
            ? (error as { detail?: string }).detail
            : undefined;
        toast.error(message || "Sign-in failed. Please try again.");
      },
    },
  );

  return (
    <div className="grid h-screen grid-cols-1 lg:grid-cols-2">
      <div className="hidden h-full flex-col items-center justify-center lg:flex">
        <div>
          <Logo size={250} />
          <h1 className="text-3xl">Make every data, Askable</h1>
        </div>
      </div>
      <div className="flex h-full flex-col items-center justify-center gap-2.5">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">🤗 Welcome back.</CardTitle>
            <CardDescription className="text-sm">
              Welcome to TheCodex, Your not so Library that help you managed the
              data.
            </CardDescription>
          </CardHeader>
          <SignInForm
            defaultValues={{
              username: "",
              password: "",
            }}
            onSubmit={(values: SignInFormSchemaType) =>
              mutate({
                body: {
                  ...values,
                },
              })
            }
            disabled={isSuccess || isPending}
            isPending={isPending}
          />
        </Card>
        <p className="text-accent-foreground/60">
          Don’t have an account?{" "}
          <Link href="/register">
            <b>Sign up!</b>
          </Link>
        </p>
      </div>
    </div>
  );
}
export default SignInPage;
