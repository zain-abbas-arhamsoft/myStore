import Link from "next/link";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import cookie from "js-cookie";
const navbar = () => {
  const router = useRouter();
  const cookieUser = parseCookies();
  // console.log("cookieUser parse", cookieUser);
  // console.log("JSON parse", cookieUser.user);
  const user = cookieUser.user ? JSON.parse(cookieUser.user) : "";
  // console.log("final user", user);
  function isActive(route) {
    if (route == router.pathname) {
      return "active";
    }
  }
  return (
    <nav>
      <div className="nav-wrapper #1565c0 blue darken-3">
        <Link href="/" className="brand-logo left">
          MyStore
        </Link>
        <ul id="nav-mobile" className="right">
          <li className={isActive("/cart")}>
            <Link href="/cart">Cart</Link>
          </li>
          {user.role == "admin" ||
            (user.role == "root" && (
              <li className={isActive("/create")}>
                <Link href="/create">Create</Link>
              </li>
            ))}
          {user ? (
            <>
              <li className={isActive("/account")}>
                <Link href="/account">Account</Link>
              </li>
              <li>
                <button
                  className="btn red"
                  onClick={() => {
                    cookie.remove("token");
                    cookie.remove("user");
                    router.push("/");
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className={isActive("/login")}>
                <Link href="/login">Login</Link>
              </li>
              <li className={isActive("/signup")}>
                <Link href="/signup">Sign up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};
export default navbar;
