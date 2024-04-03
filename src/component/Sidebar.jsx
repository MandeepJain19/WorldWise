import styles from "./Sidebar.module.css";
import Logo from "./Logo";
import AppNav from "./AppNav";
import { Outlet } from "react-router-dom";
import { useCities } from "../contexts/CityContext";
function Sidebar() {
  const { sidebarView, showSidebar, hideSidebar } = useCities();
  if (sidebarView) {
    return (
      <div className={styles.sidebar}>
        <div onClick={hideSidebar} className={styles.sidebarCloseBtn}>
          X
        </div>
        <Logo />
        <AppNav />

        <Outlet />
        <footer className={styles.footer}>
          <p className={styles.copyright}>
            &copy; Copyright {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    );
  } else {
    return (
      <div onClick={showSidebar} className={styles.sidebarBtn}>
        &#8594;
      </div>
    );
  }
}

export default Sidebar;
