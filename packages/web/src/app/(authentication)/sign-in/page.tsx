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
import { useLogin } from "@/store/userStore";

function SignInPage() {
  const { login } = useLogin();

  const handleSubmit = async (values: SignInFormSchemaType) => {
    try {
      await login({
        username: values.username,
        password: values.password,
      });
      toast.success("Sign-in successful! Welcome back.");
    } catch {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="grid h-screen grid-cols-1 lg:grid-cols-2">
      <div className="hidden h-full flex-col items-center justify-center lg:flex">
        <div>
          <Logo size={250} />
          <h1 className="text-3xl">Your&apos;s Agentic Ai Librarians</h1>
        </div>
      </div>
      <div className="flex h-full flex-col items-center justify-center gap-2.5">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">
              🤗 Welcome back to TheCodex
            </CardTitle>
            <CardDescription className="text-sm">
              Sign in to your account and continue managing your data with
              TheCodex, your intelligent library assistant.
            </CardDescription>
          </CardHeader>
          <SignInForm
            defaultValues={{
              username: "",
              password: "",
            }}
            onSubmit={handleSubmit}
          />
        </Card>
        <p className="text-accent-foreground/60">
          Don&apos;t have an account?{" "}
          <Link href="/register">
            <b>Register now!</b>
          </Link>
        </p>
      </div>
    </div>
  );
}
export default SignInPage;
