import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import CityItem from "./CityItem";
import Message from "./Message";
import { useCities } from "../contexts/CityContext";
function CityList() {
  const { cities, isLoading } = useCities();
  if (isLoading) <Spinner />;
  if (!cities.length)
    return (
      <Message message="Add you first city by clicking on city on the map" />
    );
  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
