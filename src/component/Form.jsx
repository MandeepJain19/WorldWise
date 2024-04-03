import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import { useCities } from "../contexts/CityContext";
import { useNavigate } from "react-router-dom";
export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [isGeocodeLoading, setIsGeocodeLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [geocodingError, setGeocodingError] = useState("");
  const { createNewCity, isLoading } = useCities();
  const [lat, lng] = useUrlPosition();

  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();

    if (!date || !cityName) return;

    const newCity = {
      cityName,
      country,
      emoji: countryCode,
      date,
      notes,
      position: { lat, lng },
    };

    await createNewCity(newCity);
    navigate("/app/cities");
  }

  useEffect(
    function () {
      if (!(lat && lng)) return;
      async function getGeocode() {
        try {
          setIsGeocodeLoading(true);
          setGeocodingError("");
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          if (!data.countryCode)
            throw new Error(
              "That dosen't seems to be a city click somewhere else 😉"
            );
          setCityName(data.city);
          setCountry(data.countryName);
          setCountryCode(data.countryCode);
        } catch (err) {
          setGeocodingError(err.message);
        } finally {
          setIsGeocodeLoading(false);
        }
      }
      getGeocode();
    },
    [lat, lng]
  );

  if (isGeocodeLoading) return <Spinner />;
  if (!(lat && lng)) return <Message message="Click on map to get data" />;
  if (geocodingError) return <Message message={geocodingError} />;
  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>
          {
            <img
              src={`https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`}
              alt="flag"
            />
          }
        </span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          format="dd/MM/yyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
        {/* <button>Add</button>
        <button>&larr; Back</button> */}
      </div>
    </form>
  );
}

export default Form;
