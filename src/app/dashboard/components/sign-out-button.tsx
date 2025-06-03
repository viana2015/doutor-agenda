"use client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

interface SignOutButtonProps {
  label: string;
}

const SignOutButton = ({ label }: SignOutButtonProps) => {
  const router = useRouter();
  return (
    <Button
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => router.push("/authentication"),
          },
        })
      }
    >
      {label || "Sair"}
    </Button>
  );
};

export default SignOutButton;
