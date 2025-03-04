import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateLocation } from "../utils/locationSlice";
import { RxCross2 } from "react-icons/rx";
import { MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";


const SearchLocation = ({ setOpenSearch }) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchLocation();
  }, [searchInput]);

  // function to fetch searchLocation details
  const fetchLocation = async () => {
    const result = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchInput)}&format=json`);

    const json = await result.json();
    console.log(json);

    // *** to remove unnecessary suggestions ***
    if (json.length > 1) {
      const filteredSuggestion = json.filter((suggestion) => suggestion.display_name.match(/\b\d{6}\b/g));

      // if no-data have pin-code then atleast show 1 data
      if (filteredSuggestion == 0) {
        setSearchSuggestions([json[0]]);
      } else {
        setSearchSuggestions(filteredSuggestion);
      }

    } else {
      setSearchSuggestions(json);
    }
  }

  // function handle enter key
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (event.target.value !== '') {
        setSearchInput(event.target.value + ' india');
      }
    }
  }

  // function to handle Location select (to get latitude and longitude)
  const handleLocationSelect = (item) => {
    setOpenSearch(false)
    dispatch(updateLocation(item));
  }

  return (
    <div className="absolute top-0 left-0 w-[90vw] sm:w-[50vw] h-[100vh] scroll p-4 bg-slate-200 overflow-y-scroll">
      <RxCross2
        className="text-3xl absolute top-4 left-4 cursor-pointer hover:text-orange-500 "
        onClick={() => setOpenSearch(false)}
      />

      <form className="border-b-2 border-slate-300 mt-10">
        <input
          type="text"
          placeholder="Search for area, street name..."
          className="w-[100%] p-5 outline-none font-normal focus:border-2 focus:border-orange-500"
          onKeyDown={handleKeyDown}
        />
      </form>

      <ul className="mt-4">
        {searchSuggestions.length === 0 
          ? (
            <div className="my-2 border-b-2 border-slate-300 text-center">
              <p className="text-lg text-bold text-orange-500">No results found.</p>
              <p className="text-base font-normal"> Are you sure you entered the correct location ?</p>
            </div>

          )
          : (
            searchSuggestions.map((item) => {
              return (
                <Link to="/" key={item.place_id}>
                  <div
                    className="my-2 border-b-2 border-slate-300 cursor-pointer flex box-border"
                    onClick={() => handleLocationSelect(item)}
                  >
                    <MdLocationOn className="w-[5%] mt-1 text-orange-500" />
                    <div className="w-[95%] pl-2">
                      <li className="text-orange-500">{item.name}</li>
                      <li className="text-xs font-normal text-slate-600">{item.display_name}</li>
                    </div>
                  </div>
                </Link>
              )
            })
          )
        }
      </ul>

    </div>
  )
}

export default SearchLocation;