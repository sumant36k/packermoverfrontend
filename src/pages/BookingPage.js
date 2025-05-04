import "../styles/BookingPage.css";
import React, { useEffect, useState } from "react";
import PopupModal from "../pages/PopupModal";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import BookingDetailsCard from "./BookingDetailsCard";
const BookingPage = () => {
  const [activeTab, setActiveTab] = useState("Sofas & Seating"); // Default active tab
  //const [selectedItems, setSelectedItems] = useState({}); // Store selected items and their quantities
  const [selectedItems, setSelectedItems] = useState([]); // ✅ Now an array

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inventory, setInventory] = useState([]); // Store inventory items categorized
  const [searchParams] = useSearchParams();
  const distance = searchParams.get("distance"); // Extract 'distance' from the URL query parameter
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalCFT, setTotalCFT] = useState(0); // Store total CFT
  // Fetch inventory data from API
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        console.log("Fetching inventory..."); // Debug log
        const response = await axios.get("https://localhost:7148/api/inventory/GetAllInventory");
        if (response.status === 200) {
          console.log("Inventory Data:", response.data); // Debugging fetched data

          // Organize data by category
          const groupedData = organizeInventoryByCategory(response.data);
          setInventory(groupedData);

        }
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    fetchInventory();
  }, []);
  useEffect(() => {
    const calculatedCFT = selectedItems.reduce(
      (total, item) => total + item.quantity * item.sizeCFT,
      0
    );
    setTotalCFT(calculatedCFT);
  }, [selectedItems]);
  useEffect(() => {
    if (distance > 100 && totalCFT > 100) {
      const fetchPrice = async () => {
        if (!distance || totalCFT <= 0) {
          console.warn("Skipping price fetch: invalid distance or CFT value.");
          return;
        }

        setLoading(true);
        try {
          const dist = parseInt(distance, 10);  // Ensure it's an integer
          const cft = parseInt(totalCFT, 10);   // Ensure it's an integer

          console.log("Fetching price for:", { distance: dist, cftTotal: cft }); // Debugging log
          const response = await axios.get(
            `https://localhost:7148/api/Price/GetPrice?distance=${dist}&cftTotal=${cft}`
          );
          if (response.status === 200) {
            console.log("Price received:", response.data);
            setPrice(response.data.price);
          } else {
            console.error("Failed to fetch price: Unexpected response status", response.status);
          }
        } catch (error) {
          console.error("Error fetching price:", error.response?.data || error.message);
        }
        setLoading(false);
      };

      fetchPrice();
    }

  }, [selectedItems]); // ✅ Fetch price when distance or totalCFT changes


  // Function to organize inventory by category
  const organizeInventoryByCategory = (data) => {
    return data.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push({ itemID: item.itemID, name: item.name, sizeCFT: item.sizeCFT }); // Store both itemID and name
      return acc;
    }, {});
  };

  // Function to handle tab change
  const handleTabChange = (category) => {
    setActiveTab(category);
  };

  // Function to handle adding an item
  // const handleAddItem = (itemID) => {
  //   setSelectedItems((prevState) => ({
  //     ...prevState,
  //     [itemID]: (prevState[itemID] || 0) + 1, // Increment quantity
  //   }));
  // };
  const handleAddItem = (itemID) => {
    setSelectedItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.itemID === itemID);

      if (existingItem) {
        return prevItems.map((item) =>
          item.itemID === itemID ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        const selectedItem = Object.values(inventory)
          .flat()
          .find((item) => item.itemID === itemID);

        if (!selectedItem) return prevItems;

        return [...prevItems, { ...selectedItem, quantity: 1 }];
      }
    });
  };



  const handleRemoveItem = (itemID) => {
    setSelectedItems((prevItems) => {
      return prevItems
        .map((item) =>
          item.itemID === itemID
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0); // Remove items with 0 quantity
    });
  };


  const handleDropdownChange = (itemID, value) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.itemID === itemID ? { ...item, quantity: parseInt(value, 10) } : item
      )
    );
  };



  // Function to handle continue button click and submit booking
  const handleContinue = async () => {
    const userID = localStorage.getItem("userID"); // Get user ID from localStorage
    if (!userID) {
      alert("Please log in first!");
      return;
    }

    // Placeholder values for now (these should be dynamically selected by the user)
    const sourceAddressID = 1; // TODO: Replace with actual selected source address ID
    const destinationAddressID = 2; // TODO: Replace with actual selected destination address ID
    const pickupDate = new Date().toISOString(); // Format as needed
    const pickupTimeSlotID = 1; // TODO: Replace with actual selected time slot
    const totalAmount = 100.0; // TODO: Replace with actual calculation
    const bookingAmountPaid = 0.0; // TODO: Replace with actual payment data

    const bookingDetails = {
      userID: parseInt(userID, 10),
      sourceAddressID,
      destinationAddressID,
      pickupDate,
      pickupTimeSlotID,
      status: "Pending",
      totalAmount,
      bookingAmountPaid,
      bookingItemList: Object.keys(selectedItems).map((itemId) => ({
        //itemID: parseInt(itemId, 10),
        // quantity: selectedItems[itemId],
        itemID: selectedItems[itemId].itemID,
        quantity: selectedItems[itemId].quantity,
      })),
    };

    // Log JSON before sending
    console.log("Sending booking details:", JSON.stringify(bookingDetails, null, 2));

    try {
      const response = await axios.post(
        "https://localhost:7148/api/booking/CreateBooking",
        bookingDetails,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        alert("Booking successfully created!");
        setIsModalOpen(true); // Open modal on successful booking
      } else {
        alert("Failed to create booking. Please try again.");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Error creating booking.");
    }
  };

  // List of categories from API data
  const categories = Object.keys(inventory || {});

  return (
    <div className="booking-page">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src="/logo.png" alt="Company Logo" />
          <h1>Packers and Movers</h1>
        </div>
        <nav className="nav-links">
          <a href="#services">Services</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
          <button className="login-btn">Login</button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="tabs-container">
        <div className="left-pane">
          <h2>Search for a household item to add</h2>
          <div className="tabs">
            {categories.map((category) => (
              <button
                key={category}
                className={`tab-button ${activeTab === category ? "active" : ""}`}
                onClick={() => handleTabChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="tab-content">
            {inventory[activeTab]?.map((item, index) => {
              const selectedItem = selectedItems.find((selected) => selected.itemID === item.itemID);

              return (
                <div key={index} className="item-row">
                  <span>{item.name}</span> {/* Display Name */}
                  <div className="item-controls">
                    <select
                      className="dropdown"
                      value={selectedItem ? selectedItem.quantity : 1}
                      onChange={(e) => handleDropdownChange(item.itemID, e.target.value)}
                    >
                      {[1, 2, 3, 4, 5].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <button className="minus-btn" onClick={() => handleRemoveItem(item.itemID)}>
                      -
                    </button>
                    <span className="quantity">{selectedItem ? selectedItem.quantity : 0}</span>
                    <button className="plus-btn" onClick={() => handleAddItem(item.itemID)}>
                      +
                    </button>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </main>

      {/* Booking Details Section at the Bottom */}
    
       
       
        <BookingDetailsCard
  selectedItems={selectedItems}
  price={price}
  handleContinue={handleContinue}
/>
        {/* Continue Button */}
        <button className="continue-btn" onClick={handleContinue}>
          Continue
        </button>
      

      {/* Popup Modal */}
      <PopupModal isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        price={price}
      />

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Packers and Movers. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default BookingPage;
