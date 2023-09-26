import Spinner from "./Spinner";
import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import Message from "./Message";

function CountryList({ cities, isLoading }) {
    if (isLoading) {
        return <Spinner />;
    }

    if (cities.length === 0) {
        return (
            <Message message="Add your first city by clicking on a city in the map" />
        );
    }

    const countries = cities.reduce((array, city) => {
        if (array.some((country) => country.country === city.country)) {
            return array;
        } else {
            return [...array, { country: city.country, emoji: city.emoji }];
        }
    }, []);

    return (
        <ul className={styles.countryList}>
            {countries.map((country) => (
                <CountryItem country={country} key={country.country} />
            ))}
        </ul>
    );
}

export default CountryList;
