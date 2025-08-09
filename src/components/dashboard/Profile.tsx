"use client";

import Loading from "@/app/[locale]/loading";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import yup from "yup";
import { Button } from "../ui/button";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

// You can move this to src/config/constants/global.ts or a dedicated config file

const Profile = () => {
  const lang = useLocale();
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getProfile = async () => {
    try {
      const res = await axios.get(`/api/${lang}/admin/profile`);
      return res.data;
    } catch (err: any) {
      setError("Failed to load profile");
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getProfile();
      setProfile(data);
      setLoading(false);
    };
    fetchData();
  }, [lang]);

  const FormSchema = yup.object().shape({
    username: yup.string().required().min(2).max(100),
  });

  const form = useForm<any>({
    resolver: yupResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  const onsubmit = () => {
    console.log("first");
  };

  if (loading) return <Loading />;
  if (error) return <section>{error}</section>;
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onsubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input width={"100%"} placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
};

export default Profile;
