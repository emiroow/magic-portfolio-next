import { Fragment } from "react";

interface Props {
  children: React.ReactNode;
  locale?: string;
}

const MainProvider = async ({ children, locale }: Props) => {
  return <Fragment>{children}</Fragment>;
};

export default MainProvider;
