import { createContext, useContext, useEffect, useState } from "react";

const BASE_URL = "http://localhost:8000";
const CityContext = createContext();

function CityProvider({ children }) {
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentCity, setCurrentCity] = useState({});

    useEffect(function () {
        async function fetchCities() {
            try {
                setIsLoading(true);
                const res = await fetch(`${BASE_URL}/cities`);
                const data = await res.json();
                setCities(data);
            } catch (err) {
                alert("There was an error loading data");
            } finally {
                setIsLoading(false);
            }
        }

        fetchCities();
    }, []);

    async function getCity(id) {
        try {
            setIsLoading(true);
            const res = await fetch(`${BASE_URL}/cities/${id}`);
            const data = await res.json();
            setCurrentCity(data);
        } catch (err) {
            alert("There was an error loading the city");
        } finally {
            setIsLoading(false);
        }
    }

    async function createCity(newCity) {
        try {
            setIsLoading(true);
            const res = await fetch(`${BASE_URL}/cities`, {
                method: "POST",
                body: JSON.stringify(newCity),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();

            setCities((cities) => [...cities, data]);
        } catch (err) {
            alert("There was an error creating the city");
        } finally {
            setIsLoading(false);
        }
    }

    async function deleteCity(id) {
        try {
            setIsLoading(true);
            await fetch(`${BASE_URL}/cities/${id}`, {
                method: "DELETE",
            });

            setCities((cities) => cities.filter((city) => city.id !== id));
        } catch (err) {
            alert("There was an error deleting the city");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <CityContext.Provider
            value={{
                cities,
                isLoading,
                currentCity,
                getCity,
                createCity,
                deleteCity,
            }}
        >
            {children}
        </CityContext.Provider>
    );
}

function useCities() {
    const context = useContext(CityContext);
    if (!context) {
        throw new Error("CityContext cannot be used outside the CityProvider.");
    }

    return context;
}

export { CityProvider, useCities, BASE_URL };