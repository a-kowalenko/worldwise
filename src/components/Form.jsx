// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "./Button";
import BackButton from "./BackButton";
import styles from "./Form.module.css";
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
    const { createCity, isLoading } = useCities();
    const navigate = useNavigate();
    const [lat, lng] = useUrlPosition();
    const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
    const [cityName, setCityName] = useState("");
    const [country, setCountry] = useState("");
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState("");
    const [emoji, setEmoji] = useState("");
    const [geocodingError, setGeocodingError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        if (!date || !cityName) {
            return;
        }

        const newCity = {
            cityName,
            country,
            emoji,
            date,
            notes,
            position: { lat, lng },
        };

        await createCity(newCity);
        navigate("/app/cities");
    }

    useEffect(
        function () {
            if (!lat || !lng) {
                return;
            }

            async function fetchCityData() {
                try {
                    setGeocodingError("");
                    setIsLoadingGeocoding(true);
                    const res = await fetch(
                        `${BASE_URL}?latitude=${lat}&longitude=${lng}`
                    );
                    const data = await res.json();
                    const name = `${data.city}${
                        data.city === data.locality ? "" : ` ${data.locality}`
                    }`;

                    if (!data.countryCode) {
                        throw new Error(
                            "That doesn't seem to be a city. Click somewhere else 🙃"
                        );
                    }

                    setCityName(name);
                    setCountry(data.countryName);
                    setEmoji(convertToEmoji(data.countryCode));
                } catch (err) {
                    setGeocodingError(err.message);
                } finally {
                    setIsLoadingGeocoding(false);
                }
            }

            fetchCityData();
        },
        [lat, lng]
    );

    if (!lat || !lng) {
        return <Message message={"Start by clicking on the map"} />;
    }

    if (isLoadingGeocoding) {
        return <Spinner />;
    }

    if (geocodingError) {
        return <Message message={geocodingError} />;
    }

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
                <span className={styles.flag}>{emoji}</span>
            </div>

            <div className={styles.row}>
                <label htmlFor="date">When did you go to {cityName}?</label>
                <DatePicker
                    id="date"
                    selected={date}
                    onChange={(date) => setDate(date)}
                    dateFormat={"dd.MM.yyyy"}
                />
            </div>

            <div className={styles.row}>
                <label htmlFor="notes">
                    Notes about your trip to {cityName}
                </label>
                <textarea
                    id="notes"
                    onChange={(e) => setNotes(e.target.value)}
                    value={notes}
                />
            </div>

            <div className={styles.buttons}>
                <BackButton />
                <Button type="primary">Add</Button>
            </div>
        </form>
    );
}

export default Form;
