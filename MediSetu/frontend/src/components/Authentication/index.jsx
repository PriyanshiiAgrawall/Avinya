"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SignInAndSignUp = () => {
  const router = useRouter();

  // Optional: redirect to login or register depending on desired default
  useEffect(() => {
    router.push("/login"); // or "/register" if you prefer
  }, [router]);

  return null; // No UI needed
};

export default SignInAndSignUp;
