import styles from "./CountryItem.module.css";

function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      <span className={styles.emoji}>
        <img
          src={`https://flagcdn.com/24x18/${country.emoji.toLowerCase()}.png`}
          alt="flag"
        />
      </span>
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
