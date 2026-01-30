"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const HIDDEN_ROUTES = ["/coming-soon"];

const ConditionalFooter: React.FC = () => {
  const pathname = usePathname();

  if (HIDDEN_ROUTES.includes(pathname)) {
    return null;
  }

  return <Footer />;
};

export default ConditionalFooter;

