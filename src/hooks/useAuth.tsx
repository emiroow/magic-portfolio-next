"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";

type LoginForm = {
  email: string;
  password: string;
};

const useAuth = () => {
  const t = useTranslations("auth.login");
  const locale = useLocale();
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") || `/${locale}/dashboard`;

  const schema = yup.object().shape({
    email: yup
      .string()
      .required(t("requiredField", { default: "This field is required" }))
      .email(t("invalidEmail", { default: "Invalid email" })),
    password: yup
      .string()
      .required(t("requiredField", { default: "This field is required" })),
  });

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isDirty },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const mutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl,
      });
      if (!res) throw new Error("NO_RESPONSE");
      if (res.error) {
        throw new Error(res.error);
      }
      return res;
    },
    onSuccess: (res) => {
      // res.url may be null in some cases; fall back to callbackUrl
      const url = res.url || callbackUrl;
      // Hard redirect to ensure session cookie is set
      window.location.href = url;
    },
    onError: () => {
      setError("root", {
        message: t("invalidCredentials", {
          default: "Invalid email or password",
        }),
      });
    },
  });

  const onSubmit = (data: LoginForm) => mutation.mutate(data);

  return {
    handleSubmit,
    register,
    onSubmit,
    errors,
    isDirty,
    isPending: mutation.status === "pending",
  };
};

export default useAuth;
