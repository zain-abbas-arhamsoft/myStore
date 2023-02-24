import { baseUrl } from "helpers/baseUrl";
import Link from "next/link";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const userLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`${baseUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const getData = await res.json();
    // console.log("getData.error", getData.error);
    if (getData.error) {
      M.toast({ html: getData.error, classes: "red" });
    } else {
      M.toast({ html: getData.message, classes: "green" });
      // console.log("getData", getData);
      let user = getData.user;
      user = JSON.stringify(user);
      // console.log("getData user", getData.user);
      Cookies.set("token", getData.token);
      Cookies.set("user", user);

      router.push("/account");
    }
  };
  return (
    <div className="container card authCard center-align">
      <h3>Login</h3>
      <form onSubmit={(e) => userLogin(e)}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light #1565c0 blue darken-3"
          type="submit"
          name="action"
        >
          Login
          <i className="material-icons right">forward</i>
        </button>
        <Link href="/signup">
          <h5> Don't have a account?</h5>
        </Link>
      </form>
    </div>
  );
};
export default login;
