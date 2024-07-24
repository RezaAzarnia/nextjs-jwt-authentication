import { auth } from "./_lib/auth";

export default async function Home() {
  const user = await auth();

  return (
    <span>
      name : {user?.username}
      <br />
      email: {user?.email}
      <br />
      accessToken is :{" "}
      <div className="text-wrap max-w-96 overflow-auto ">
        <p>{user?.accessToken}</p>
      </div>
    </span>
  );
}
