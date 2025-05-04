
import React, { useState } from "react";
import "../styles/Home.css";
import Modal from "../pages/Model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faRoute, faLocationArrow } from "@fortawesome/free-solid-svg-icons";


const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [shiftingDate, setShiftingDate] = useState("");
  const [ShiftingFrom, setShiftingFrom] = useState("");
  const [ShiftingTo, setShiftingTo] = useState("");
  const [MobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [shiftFromSuggestion, setShiftFromSuggestion] = useState([]);
  const [ShiftingToSuggetion, setShiftingToSuggetion] = useState([]);
  const [distance, setDistance] = useState(0); // New state for distance
  const [activeTab, setActiveTab] = useState('within');
  const [selectedCity, setSelectedCity] = useState(""); // Store the selected city

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setError("");
  };
  const showTab = (tab) => {
    setActiveTab(tab);
    setFromAddress('');
    setToAddress('');
  };

  // Function to fetch address suggestions from LocationIQ (with Autocomplete)
  const fetchAddressSuggestions = async (query, setSuggestions, selectedCity = "") => {
    if (query.length < 3) return; // Only fetch after 3+ characters

    // Append the selected city if available
    const searchQuery = selectedCity ? `${query}, ${selectedCity}` : query;

    const url = `https://us1.locationiq.com/v1/autocomplete?key=pk.b4e2b7e7c1b30fdf43ca13e28d713710&q=${searchQuery}`;
    const options = { method: 'GET', headers: { accept: 'application/json' } };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setSuggestions(data); // Set suggestions to state
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };


  // Function to fetch coordinates from LocationIQ API
  const fetchCoordinates = async (address) => {
    const url = `https://us1.locationiq.com/v1/search?key=pk.b4e2b7e7c1b30fdf43ca13e28d713710&q=${address}&format=json`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
      }
      return null;
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  // Function to calculate distance using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (deg) => (deg * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const handleCheckPrices = async (e) => {
    e.preventDefault();
    if (!fromAddress || !toAddress) {
      setError("Please fill both From Address and To Address.");
      return;
    }
    setError("");

    const fromCoords = await fetchCoordinates(fromAddress);
    const toCoords = await fetchCoordinates(toAddress);

    if (fromCoords && toCoords) {
      const dist = calculateDistance(fromCoords.lat, fromCoords.lon, toCoords.lat, toCoords.lon);
      setDistance(dist.toFixed(2));
    } else {
      setError("Could not fetch coordinates for the given addresses.");
    }

    openModal();
  };
  const handleCheckPrices1 = async (e) => {
    e.preventDefault();
    if (!fromAddress || !toAddress) {
      setError("Please fill both From Address and To Address.");
      return;
    }
    setError("");

    const fromCoords = await fetchCoordinates(fromAddress);
    const toCoords = await fetchCoordinates(toAddress);

    if (fromCoords && toCoords) {
      const dist = calculateDistance(fromCoords.lat, fromCoords.lon, toCoords.lat, toCoords.lon);
      setDistance(dist.toFixed(2));
    } else {
      setError("Could not fetch coordinates for the given addresses.");
    }

    openModal();
  };
  return (
    <div className="home">
      {/* Header Section */}
      <header className="header">
        <div className="logo">
          <img src="/logo.png" alt="Company Logo" />
          <h1>Packers and Movers</h1>
        </div>
        <nav className="nav-links">
          <a href="#services">Services</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
          <button className="login-btn" onClick={openModal}>
            Login
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="home-content">
        <div className="left-section">
          <div className="template-container">
            <img src="/template-banner.webp" alt="Movers and Packers" className="template-image" />
            <div className="overlay-text">
              <h1>Reliable Movers and Packers</h1>
              <p>We help you pack and relocate with ease and care.</p>
              <button className="cta-button">Learn More</button>
            </div>
          </div>
        </div>

        <div className="right-section">
          <div className="form-container">
            <h2>What's your moving plan?</h2>
            <div className="tabs">
              <button className={activeTab === 'within' ? 'active' : ''} onClick={() => showTab('within')}>Within City</button>
              <button className={activeTab === 'between' ? 'active' : ''} onClick={() => showTab('between')}>Between Cities</button>
            </div>
            { /*<p>Provide your details to get the best prices for your move.</p>*/}
            <form className="relocation-form">


              <div style={{ display: activeTab === 'within' ? 'block' : 'none' }}>
                <p>Select City</p>
                {/* Select city combo*/}
                <div className="form-group">
                  <select
                    required
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                  >
                    <option value="" disabled>Select City</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>

                </div>
                <p>Search your Locality</p>


              </div>
              <div style={{ display: activeTab === 'between' ? 'block' : 'none' }}>
                <p>Search your City</p>


                {error && <p className="error">{error}</p>}

              </div>
              <div className="form-group location-input">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="input-icon" />
                <input
                  type="text"
                  placeholder="Shifting From"
                  value={fromAddress}
                  onChange={(e) => {
                    setFromAddress(e.target.value);
                    if (activeTab === 'within') {
                      fetchAddressSuggestions(e.target.value, setShiftFromSuggestion, selectedCity);
                    } else {
                      fetchAddressSuggestions(e.target.value, setShiftFromSuggestion);
                    }
                  }}

                  required
                />
                {shiftFromSuggestion.length > 0 && (
                  <ul className="suggestions">
                    {shiftFromSuggestion.map((place, index) => (
                      <li key={index} onClick={() => {
                        setFromAddress(place.display_name);
                        setShiftFromSuggestion([]);
                      }}>
                        <FontAwesomeIcon icon={faLocationArrow} className="suggestion-icon" />
                        {place.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Route icon between fields */}
              <FontAwesomeIcon icon={faRoute} className="route-icon" />

              <div className="form-group location-input">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="input-icon" />
                <input
                  type="text"
                  placeholder="Shifting To"
                  value={toAddress}
                  onChange={(e) => {
                    setToAddress(e.target.value);
                    if (activeTab === 'within') {
                      fetchAddressSuggestions(e.target.value, setShiftingToSuggetion, selectedCity);
                    } else {
                      fetchAddressSuggestions(e.target.value, setShiftFromSuggestion);
                    }
                    fetchAddressSuggestions(e.target.value, setShiftingToSuggetion, selectedCity);
                  }}
                  required
                />
                {ShiftingToSuggetion.length > 0 && (
                  <ul className="suggestions">
                    {ShiftingToSuggetion.map((place, index) => (
                      <li key={index} onClick={() => {
                        setToAddress(place.display_name);
                        setShiftingToSuggetion([]);
                      }}>
                        <FontAwesomeIcon icon={faLocationArrow} className="suggestion-icon" />
                        {place.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Shifting Date */}
              <div className="form-group">
                <p>Select Shifting Date</p>
                <input
                  type="date"
                  placeholder="Shifting date"
                  value={shiftingDate}
                  onFocus={(e) => (e.target.type = 'date')}
                  onBlur={(e) => (e.target.type = 'text')}
                  onChange={(e) => setShiftingDate(e.target.value)}
                  required
                />
              </div>
              <button type="button" className="submit-btn" onClick={handleCheckPrices1}>
                Check Prices
              </button>

            </form>
          </div>
        </div>
      </main>

      {/* Modal Component */}
      <Modal isOpen={isModalOpen}
        closeModal={closeModal}
        distance={distance}
        activeTab={activeTab}
        shiftingDate={shiftingDate}
        fromAddress ={fromAddress}
        toAddress ={toAddress}
      />

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            <h2>Packers and Movers</h2>
          </div>
          <div className="footer-links">
            <a href="#terms">Terms & Conditions</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#faq">FAQs</a>
          </div>
          <div className="footer-contact">
            <p>Call Us: <strong>855-008-7858</strong></p>
            <p>Email: <a href="mailto:support@moverspackers.com">support@moverspackers.com</a></p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Packers and Movers. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
