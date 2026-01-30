"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

const HIDDEN_ROUTES = ["/coming-soon"];

const ConditionalHeader: React.FC = () => {
  const pathname = usePathname();

  if (HIDDEN_ROUTES.includes(pathname)) {
    return null;
  }

  return <Header />;
};

export default ConditionalHeader;

