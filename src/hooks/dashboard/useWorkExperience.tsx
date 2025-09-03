import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
const useWorkExperience = () => {
  type formType = {
    company: string;
    href: string;
    location: string;
    title: string;
    logoUrl: string;
    start: string;
    end: string;
    description: string;
  };

  const FormSchema = yup.object().shape({
    company: yup.string().required("فیلد اجباری"),
    href: yup.string().required("فیلد اجباری"),
    location: yup.string().required("فیلد اجباری"),
    title: yup.string().required("فیلد اجباری"),
    logoUrl: yup.string().required("فیلد اجباری"),
    start: yup.string().required("فیلد اجباری"),
    end: yup.string().required("فیلد اجباری"),
    description: yup.string().required("فیلد اجباری"),
  });

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<formType>({
    resolver: yupResolver(FormSchema),
    defaultValues: {
      company: "",
      href: "",
      location: "",
      title: "",
      logoUrl: "",
      start: "",
      end: "",
      description: "",
    },
  });

  return {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors, isDirty },
  };
};

export default useWorkExperience;
