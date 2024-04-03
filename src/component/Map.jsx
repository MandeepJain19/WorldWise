import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import Error from "./Error";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CityContext";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "../component/Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

function Map() {
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const { cities, showSidebar, sidebarView } = useCities();
  const {
    isLoading: isPositionLoading,
    position: geoLocationPosition,
    getPosition,
    error,
  } = useGeolocation();
  if (error) console.log(error);
  const [lat, lng] = useUrlPosition();
  const width = window.innerWidth;
  useEffect(
    function () {
      if (geoLocationPosition)
        setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
    },
    [geoLocationPosition]
  );

  useEffect(
    function () {
      if (lat && lng) setMapPosition([lat, lng]);
    },
    [lat, lng]
  );
  return (
    <div className={styles.mapContainer}>
      {error && <Error error={error} />}
      {!geoLocationPosition && width > 800 ? (
        <GetPositionButton
          getPosition={getPosition}
          isPositionLoading={isPositionLoading}
        />
      ) : (
        !sidebarView && (
          <GetPositionButton
            getPosition={getPosition}
            isPositionLoading={isPositionLoading}
          />
        )
      )}
      {/* {!geoLocationPosition &&(
        <Button type="position" onclick={getPosition}>
          {isPositionLoading ? "Loading..." : "Use your position"}
        </Button>
      )} */}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
            <ChangePosition position={mapPosition} />
            <DetectClick showSidebar={showSidebar} />
          </Marker>
        ))}
        {cities.length === 0 && <DetectClick showSidebar={showSidebar} />}
      </MapContainer>
    </div>
  );
}
/*CUSTOM COMPONENTS  */
function ChangePosition({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick({ showSidebar }) {
  const navigate = useNavigate();
  useMapEvent({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
      showSidebar();
    },
  });
}

function GetPositionButton({ getPosition, isPositionLoading }) {
  return (
    <Button type="position" onclick={getPosition}>
      {isPositionLoading ? "Loading..." : "Use your position"}
    </Button>
  );
}
export default Map;
