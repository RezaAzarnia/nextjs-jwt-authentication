import LogoutButton from "./LogoutButton";
import Navigation from "./Navigation";
import { auth } from "../_lib/auth";
import Button from "./Button";

export default async function Navbar() {
  const user = await auth();
  return (
    <nav className="flex justify-between py-4 md:px-6 border-b border-gray-400 items-center">
      <Navigation />
      <div className="flex gap-2 items-center">
        {user ? (
          <>
            <span>{`Welcome ${user && user?.username}`}</span>
            <LogoutButton />
          </>
        ) : (
          <>
            <Button href="/login" variant="outline">
              login
            </Button>
            <Button href="/register" variant="solid">
              sign up
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
