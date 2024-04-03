import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuthContext";
import styles from "./User.module.css";

function User() {
  const { userName, logout } = useAuth();
  const navigate = useNavigate();
  // const user = FAKE_USER;
  function handleLogout() {
    logout();
    navigate("/");
  }

  if (userName)
    return (
      <div className={styles.user}>
        <img src="https://i.pravatar.cc/100?u=zz" alt={userName} />
        <span>Welcome, {userName}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
}

export default User;
