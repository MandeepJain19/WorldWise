import styles from "./Button.module.css";
function Button({ children, type, onclick, disable }) {
  return (
    <button
      disabled={disable}
      onClick={onclick}
      className={`${styles.btn} ${styles[type]}`}
    >
      {children}
    </button>
  );
}

export default Button;
