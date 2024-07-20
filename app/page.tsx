import { getSession } from "./_lib/auth";
import { RegisterdUser } from "./_lib/types";

export default async function Home() {
  const user: RegisterdUser | undefined = await getSession();
  return (
    <span>
      name : {user?.username}
      <br />
      email: {user?.email}
    </span>
  );
}
