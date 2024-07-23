import { auth } from "./_lib/auth";

export default async function Home() {
  const user = await auth();
  
  return (
    <span>
      name : {user?.username}
      <br />
      email: {user?.email}
    </span>
  );
}
