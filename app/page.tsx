import { auth } from "./_lib/auth";

export default async function Home() {
  const user = await auth();

  return (
    <div className="max-w-7xl w-full p-8 mx-auto space-y-4">
      <div className="flex items-center gap-2">
        <h1 className="text-xl capitalize font-bold">name :</h1>
        <span>{user?.username}</span>
      </div>
      <div className="flex items-center gap-2">
        <h1 className="text-xl capitalize font-bold">email :</h1>
        <span>{user?.email}</span>
      </div>
      <div className="">
        <h1 className="text-xl capitalize font-bold">accessToken is :</h1>
        <p className="break-all">{user?.accessToken}</p>
      </div>
    </div>
  );
}
