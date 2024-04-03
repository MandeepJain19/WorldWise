import Sidebar from "../component/Sidebar";
import Map from "../component/Map";
import styles from "./AppLayout.module.css";
import User from "../component/User";
function AppLayout() {
  return (
    <div className={styles.app}>
      <Sidebar />
      <Map />
      <User />
    </div>
  );
}

export default AppLayout;
