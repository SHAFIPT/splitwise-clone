"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function withAuth<T extends object>(Component: React.ComponentType<T>) {
  const AuthenticatedComponent = (props: T) => {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user);
    
    useEffect(() => {
      if (!user.isAuthenticated) {
        router.push("/login");
      }
    }, [user.isAuthenticated, router]);

    if (!user.isAuthenticated) return null;

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
}

export default withAuth;
