
import { getSession } from "./_lib/auth";
import { RegisterdUser } from "./_lib/types";

export default async function Home() {
  console.log('//////////////////////////////////////////////////////////////');
  const user: RegisterdUser | undefined = await getSession();
  // console.log(user);
  // await getSession();
  return (
    <span>
      {/* <button onClick={getSession}>chnage</button> */}
      name : {user?.username}
      <br />
      email: {user?.email}
    </span>
  );
}
