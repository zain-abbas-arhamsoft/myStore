import { baseUrl } from "helpers/baseUrl";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
const signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const userSignUp = async (e) => {
    e.preventDefault();
    const res = await fetch(`${baseUrl}/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
    const getData = await res.json();
    // console.log("response", res);
    // console.log("getData", getData);
    if (getData.error) {
      M.toast({ html: getData.error, classes: "red" });
    } else {
      M.toast({ html: getData.message, classes: "green" });
      router.push("/");
    }
  };
  return (
    <div className="container card authCard center-align">
      <h3>Sign up</h3>
      <form onSubmit={(e) => userSignUp(e)}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          Sign up
          <i className="material-icons right">forward</i>
        </button>
        <Link href="/login">
          <h5> Already have a account?</h5>
        </Link>
      </form>
    </div>
  );
};
export default signup;
