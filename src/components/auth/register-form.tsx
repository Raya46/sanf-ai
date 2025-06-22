"use client";

import { signup } from "@/app/auth/actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import Link from "next/link";
import Image from "next/image";

const formData = {
  title: "Create an Account",
  description:
    "Join our platform to leverage AI-powered credit analysis and make smarter, data-driven decisions.",
};

export function RegisterForm() {
  const [errorMessage, dispatch] = useActionState(signup, undefined);

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

                  <SignUpButton />

                  {errorMessage && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
                      {errorMessage}
                    </div>
                  )}
                </form>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="underline text-primary">
                    Log in
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

function SignUpButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full h-12 bg-blue-600 rounded-lg font-bold text-lg"
      disabled={pending}
    >
      {pending ? "Creating Account..." : "Create an Account"}
    </Button>
  );
}
