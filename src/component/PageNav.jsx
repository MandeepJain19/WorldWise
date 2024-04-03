import { NavLink } from "react-router-dom";
import styles from "./PageNav.module.css";
import Logo from "./Logo";
import { useCities } from "../contexts/CityContext";
function Pagenav() {
  // const widthStatus = window.innerWidth >= 960 ? true : false;
  // const [isMenuOpen, setIsMenuClose] = useState(false);
  const { isMenuOpen, showMenu, hideMenu } = useCities();

  return (
    <nav className={styles.nav}>
      <Logo />
      {isMenuOpen && (
        <ul>
          <li>
            <NavLink to="/" onClick={hideMenu}>
              HomePage
            </NavLink>
          </li>
          <li>
            <NavLink to="/product" onClick={hideMenu}>
              Product
            </NavLink>
          </li>
          <li>
            <NavLink to="/pricing" onClick={hideMenu}>
              Pricing
            </NavLink>
          </li>
          <li>
            <NavLink to="/signup" onClick={hideMenu}>
              Signup
            </NavLink>
          </li>
          <li>
            <NavLink to="/login" onClick={hideMenu} className={styles.ctaLink}>
              Login
            </NavLink>
          </li>
        </ul>
      )}
      {isMenuOpen ? (
        <div onClick={hideMenu} className={`${styles.Btn} ${styles.closeBtn}`}>
          X
        </div>
      ) : (
        <div onClick={showMenu} className={styles.Btn}>
          Menu
        </div>
      )}
    </nav>
  );
}

export default Pagenav;
