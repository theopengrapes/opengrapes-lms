import { Button, type ButtonProps } from "@/components/ui/Button";
import { signOut } from "@/lib/auth";

export function SignOutButton(props: ButtonProps) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <Button type="submit" variant="outline" {...props}>
        Sign out
      </Button>
    </form>
  );
}
