import { useEffect, useState } from "react";
import styles from "./Login.module.css";
import PageNav from "../component/PageNav";
import { useAuth } from "../contexts/FakeAuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../component/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const { loginSignup, isAuthenticated, isLoading, error } = useAuth();
  const navigate = useNavigate();
  let isLogin;
  const location = useLocation();
  if (location.pathname === "/login") isLogin = true;
  else isLogin = false;

  function handleLoginSignup(e) {
    e.preventDefault();

    if (email && password) loginSignup(email, password, isLogin, displayName);
  }

  useEffect(
    function () {
      if (isAuthenticated) navigate("/app", { replace: true });
    },
    [isAuthenticated, navigate]
  );

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form}>
        {error && <div className={styles.err}>{error}</div>}
        {!isLogin && (
          <div className={styles.row}>
            <label htmlFor="name">Display Name</label>
            <input
              type="text"
              id="name"
              onChange={(e) => setDisplayName(e.target.value)}
              value={displayName}
            />
          </div>
        )}
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        {isLogin ? (
          <>
            <div className={styles.btn}>
              <Button type="primary" onclick={handleLoginSignup}>
                Login
              </Button>
            </div>
            <p className={styles.lastText}>
              Not a user <Link to="/signup">Sign-up</Link>
            </p>
          </>
        ) : (
          <>
            <div className={styles.btn}>
              <Button
                type="primary"
                disable={isLoading}
                onclick={handleLoginSignup}
              >
                {isLoading ? "Signing..." : "Sign-up"}
              </Button>
            </div>
            <p className={styles.lastText}>
              Already a user <Link to="/login">Login</Link>
            </p>
          </>
        )}
      </form>
    </main>
  );
}
