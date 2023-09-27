import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMap,
    useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CityContext";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

function Map() {
    const { cities } = useCities();
    const [mapPosition, setMapPosition] = useState([40, 0]);
    const {
        isLoading: isLoadingPosition,
        position: geolocationPosition,
        getLocation,
    } = useGeolocation();

    const [lat, lng] = useUrlPosition();

    useEffect(
        function () {
            if (!geolocationPosition) {
                return;
            }
            const { lat, lng } = geolocationPosition;
            if (!lat || !lng) {
                return;
            }

            setMapPosition([lat, lng]);
        },
        [geolocationPosition]
    );

    useEffect(
        function () {
            if (!lat || !lng) {
                return;
            }
            setMapPosition([lat, lng]);
        },
        [lat, lng]
    );

    return (
        <div className={styles.mapContainer}>
            {!geolocationPosition && (
                <Button type="position" onClick={getLocation}>
                    {isLoadingPosition ? "Loading..." : "Use your position"}
                </Button>
            )}
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
                            <span>{city.emoji}</span>
                            <span>{city.cityName},</span>
                            <span>{city.country}</span>
                        </Popup>
                    </Marker>
                ))}
                <ChangeCenter position={mapPosition} />
                <DetectClick />
            </MapContainer>
        </div>
    );
}

function ChangeCenter({ position }) {
    const map = useMap();
    map.setView(position);
    return null;
}

function DetectClick() {
    const navigate = useNavigate();

    function handleClick(e) {
        const { lat, lng } = e.latlng;
        navigate(`form?lat=${lat}&lng=${lng}`);
    }

    useMapEvents({
        click: (e) => handleClick(e),
    });

    return null;
}

export default Map;
