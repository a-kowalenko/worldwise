import { createContext, useContext, useEffect, useReducer } from "react";

const BASE_URL = "http://localhost:8000";
const CityContext = createContext();

const initialState = {
    isLoading: false,
    cities: [],
    currentCity: {},
    error: "",
};

function reducer(state, action) {
    switch (action.type) {
        case "startLoading":
            return {
                ...state,
                isLoading: true,
            };
        case "stopLoading":
            return {
                ...state,
                isLoading: false,
            };
        case "cities/loaded":
            return {
                ...state,
                cities: action.payload,
                isLoading: false,
            };
        case "city/loaded":
            return {
                ...state,
                currentCity: action.payload,
                isLoading: false,
            };
        case "city/created":
            return {
                ...state,
                cities: [...state.cities, action.payload],
                isLoading: false,
                currentCity: action.payload,
            };
        case "city/deleted":
            return {
                ...state,
                cities: state.cities.filter(
                    (city) => city.id !== action.payload
                ),
                isLoading: false,
                currentCity: {},
            };
        case "rejected":
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            };
        default:
            throw new Error("Unknown action type.");
    }
}

function CityProvider({ children }) {
    // const [cities, setCities] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    // const [currentCity, setCurrentCity] = useState({});
    const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
        reducer,
        initialState
    );

    useEffect(function () {
        async function fetchCities() {
            try {
                dispatch({ type: "startLoading" });
                const res = await fetch(`${BASE_URL}/cities`);
                const data = await res.json();
                dispatch({ type: "cities/loaded", payload: data });
            } catch (err) {
                dispatch({
                    type: "rejected",
                    payload: "There was an error loading data",
                });
            }
        }

        fetchCities();
    }, []);

    async function getCity(id) {
        if (Number(id) === currentCity.id) {
            return;
        }
        try {
            dispatch({ type: "startLoading" });
            const res = await fetch(`${BASE_URL}/cities/${id}`);
            const data = await res.json();
            dispatch({ type: "city/loaded", payload: data });
        } catch (err) {
            dispatch({
                type: "rejected",
                payload: "There was an error loading the city",
            });
        }
    }

    async function createCity(newCity) {
        try {
            dispatch({ type: "startLoading" });
            const res = await fetch(`${BASE_URL}/cities`, {
                method: "POST",
                body: JSON.stringify(newCity),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();

            dispatch({ type: "city/created", payload: data });
        } catch (err) {
            dispatch({
                type: "rejected",
                payload: "There was an error creating the city",
            });
        }
    }

    async function deleteCity(id) {
        try {
            dispatch({ type: "startLoading" });
            await fetch(`${BASE_URL}/cities/${id}`, {
                method: "DELETE",
            });

            dispatch({ type: "city/deleted", payload: id });
        } catch (err) {
            dispatch({
                type: "rejected",
                payload: "There was an error deleting the city",
            });
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
                error,
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
