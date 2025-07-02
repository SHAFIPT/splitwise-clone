"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RootState } from "@/redux/store/store";

function withGuest<T extends object>(Component: React.ComponentType<T>) {
  const GuestOnlyComponent = (props: T) => {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user);

    useEffect(() => {
      if (user.isAuthenticated) {
        router.push("/dashboard"); // redirect to dashboard if already logged in
      }
    }, [user.isAuthenticated, router]);

    if (user.isAuthenticated) return null;

    return <Component {...props} />;
  };

  return GuestOnlyComponent;
}

export default withGuest;
