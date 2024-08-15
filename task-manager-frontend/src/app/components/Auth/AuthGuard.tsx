"use client"; // Marking this file as client-side

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext";

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
