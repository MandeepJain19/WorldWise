import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useReducer,
} from "react";
import { useEffect } from "react";

const CityContext = createContext();
// const URL = `http://localhost:5000`;
const URL = `https://worldwiseapp-default-rtdb.asia-southeast1.firebasedatabase.app/`;

function getWindowSize() {
  return window.screen.availWidth || window.screen.width;
}

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
  sidebarView: getWindowSize() <= 1200 ? false : true,
  isMenuOpen: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "findCurrentCity":
      return {
        ...state,
        isLoading: false,
        currentCity: state.cities.find((city) => city.id === action.payload),
      };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "reject":
      return { ...state, error: action.payload, isLoading: false };
    case "sidebar/open":
      return { ...state, sidebarView: true };
    case "sidebar/close":
      return { ...state, sidebarView: false };
    case "menu/open":
      return { ...state, isMenuOpen: true };
    case "menu/close":
      return { ...state, isMenuOpen: false };
    default:
      throw new Error("Unknown action type");
  }
}

function CityProvider({ children }) {
  const [
    { cities, isLoading, currentCity, sidebarView, isMenuOpen },
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${URL}cities.json`);
        const data = await res.json();
        const result = [];
        if (data !== null) {
          for (const el of Object.entries(data)) {
            
            const obj = {
              id: el[0],
              ...el[1],
            };
            result.push(obj);
          }
          
          dispatch({ type: "cities/loaded", payload: result });
        } else {
          console.log("error");
        }

        // setCities(data);
      } catch (err) {
        console.error(err.message);
        dispatch({ type: "rejected", payload: err.message });
      }
    }
    fetchCities();
  }, []);

  useLayoutEffect(function () {
    function handleWindowResize() {
      // const width = getWindowSize();
      const width = window.screen.availWidth || window.screen.width;
      if (width <= 1200 && sidebarView === true)
        dispatch({ type: "sidebar/close" });
      else if (width > 1200 && sidebarView === false)
        dispatch({ type: "sidebar/open" });
      if (width > 960 && isMenuOpen === false) dispatch({ type: "menu/open" });
    }
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });

  const getCity = useCallback(
    function getCity(id) {
      if (Number(id) === currentCity.id) return;
      dispatch({ type: "loading" });
      dispatch({ type: "findCurrentCity", payload: id });
    },
    [cities, currentCity.id]
  );

  async function createNewCity(newCity) {
    dispatch({ type: "loading" });

    try {
      if (!cities) return;
      const res = await fetch(`${URL}/cities.json`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      const result = {
        id: data.name,
        ...newCity,
      };
      dispatch({ type: "city/created", payload: result });
      // setCities((cities) => [...cities, data]);
    } catch (err) {
      console.error(err.message);
      dispatch({ type: "rejected", payload: err.message });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });

    try {
      await fetch(`${URL}/cities/${id}.json`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
      // setCities((cities) => cities.filter((city) => city.id !== id));
    } catch (err) {
      console.error("There is error in deliting city");
      dispatch({ type: "rejected", payload: err.message });
    }
  }

  function showSidebar() {
    dispatch({ type: "sidebar/open" });
  }
  function hideSidebar() {
    dispatch({ type: "sidebar/close" });
  }
  function showMenu() {
    dispatch({ type: "menu/open" });
  }
  function hideMenu() {
    if (getWindowSize() > 960) return;
    dispatch({ type: "menu/close" });
  }

  return (
    <CityContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createNewCity,
        deleteCity,
        showSidebar,
        hideSidebar,
        sidebarView,
        showMenu,
        hideMenu,
        isMenuOpen,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

function useCities() {
  const contexts = useContext(CityContext);
  if (contexts === undefined)
    throw new Error("City context used outside city provider");
  return contexts;
}

export { CityProvider, useCities };
