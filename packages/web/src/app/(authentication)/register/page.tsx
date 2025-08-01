"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import RegisterForm, {
  RegisterFormSchemaType,
} from "@/app/(authentication)/register/form";
import { Logo } from "@/components/icon";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserActions } from "@/store/userStore";

function RegisterPage() {
  const router = useRouter();
  const { register } = useUserActions();

  const handleSubmit = async (values: RegisterFormSchemaType) => {
    try {
      await register({
        username: values.username,
        email: values.email,
        password: values.password,
      });
      toast.success("Registration successful! Please sign in to continue.");
      router.push("/sign-in");
    } catch {
      toast.error("Registration failed. Please try again.");
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
              🤗 Create an Account and Join us today.
            </CardTitle>
            <CardDescription className="text-sm">
              Create your account and start managing your data with TheCodex,
              your intelligent library assistant.
            </CardDescription>
          </CardHeader>
          <RegisterForm
            defaultValues={{
              username: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            onSubmit={handleSubmit}
          />
        </Card>
        <p className="text-accent-foreground/60">
          Already have an account?{" "}
          <Link href="/sign-in">
            <b>Sign in!</b>
          </Link>
        </p>
      </div>
    </div>
  );
}
export default RegisterPage;
