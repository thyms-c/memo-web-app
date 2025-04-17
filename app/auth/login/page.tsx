"use client";

import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { label, subtitle } from "@/components/primitives";
import { LoginFormValues, loginSchema } from "@/interfaces/User";

export default function AuthPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onLogin = async (data: LoginFormValues) => {
    setIsLoading(true);

    const response = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if (response?.ok) {
      router.push("/");

      return;
    } else {
      addToast({
        title: "Login failed",
        description: "Invalid username or password",
        color: "danger",
      });
    }

    setIsLoading(false);
  };

  return (
    <section className="container mx-auto flex max-w-xs flex-grow flex-col items-center justify-center space-y-3 px-6 lg:max-w-sm">
      <h1 className={subtitle({ size: "lg" })}>เข้าสู่ระบบ</h1>

      <Form className="w-full" onSubmit={handleSubmit(onLogin)}>
        <div className="!mb-2 flex w-full flex-col flex-wrap gap-5 md:mb-0 md:flex-nowrap">
          <Input
            {...register("username")}
            errorMessage={errors.username?.message}
            isInvalid={!!errors.username}
            label={<h1 className={label()}>บัญชีพนักงาน</h1>}
            labelPlacement="outside"
            placeholder="A0001"
          />

          <Input
            {...register("password")}
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password}
            label={<h1 className={label()}>รหัสผ่าน</h1>}
            labelPlacement="outside"
            placeholder="********"
            type="password"
          />
        </div>

        <Button
          className="w-full bg-foreground text-black"
          isLoading={isLoading}
          type="submit"
        >
          ค้นหา
        </Button>
      </Form>
    </section>
  );
}
