"use client";

import { login } from "@/app/auth/actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const formData = {
  title: "Credit Analyst Agent",
  description:
    "Your AI-powered assistant for comprehensive credit analysis. Streamline your workflow and make data-driven decisions with confidence.",
};

export function LoginForm() {
  const [errorMessage, dispatch] = useActionState(login, undefined);
  const searchParams = useSearchParams();
  const signupMessage = searchParams.get("message");

  return (
    <div className="bg-background flex flex-col md:flex-row justify-center w-full min-h-screen p-4 sm:p-10">
      <div className="bg-background w-full relative flex flex-col md:flex-row items-center">
        <div className="flex-1 flex justify-center items-center py-8">
          <Card className="border-none shadow-none w-full max-w-md mx-auto">
            <CardContent className="p-0">
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h1 className="font-bold text-3xl md:text-4xl">
                    {formData.title}
                  </h1>
                  <p className="text-xs max-w-xs mx-auto text-muted-foreground">
                    {formData.description}
                  </p>
                </div>

                <form action={dispatch} className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="font-medium text-base leading-6 block"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter Your Email"
                      className="h-10 rounded-md"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="font-medium text-base leading-6 block"
                    >
                      Password
                    </label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      className="h-10 rounded-md"
                      required
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" className="rounded-sm w-4 h-4" />
                      <label
                        htmlFor="remember"
                        className="font-normal text-xs text-muted-foreground"
                      >
                        Remember Me
                      </label>
                    </div>
                    <a href="#" className="font-semibold text-xs text-primary">
                      Forgot Password
                    </a>
                  </div>

                  <LoginButton />

                  {errorMessage && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
                      {errorMessage}
                    </div>
                  )}
                  {signupMessage && (
                    <p className="text-sm font-medium text-green-600">
                      {signupMessage}
                    </p>
                  )}
                </form>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="underline text-primary">
                    Sign up
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="hidden md:flex w-full rounded-2xl max-w-xl h-auto md:h-[628px] relative items-center justify-center p-10">
          <Image fill className="object-contain" alt="Intro" src="/intro.png" />
        </div>
      </div>
    </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full h-12 bg-blue-600 rounded-lg font-bold text-lg"
      disabled={pending}
    >
      {pending ? "Logging In..." : "Login"}
    </Button>
  );
}
