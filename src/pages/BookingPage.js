import "../styles/BookingPage.css";
import React, { useEffect, useState } from "react";
import PopupModal from "../pages/PopupModal";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import BookingDetailsCard from "./BookingDetailsCard";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, Paper, Select, MenuItem, IconButton, Stack, TextField, Divider, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Add, Remove, Category } from "@mui/icons-material";
import { Elevator, LocalShipping, LocationOn } from "@mui/icons-material"; // Icons
const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);
const BookingPage = (selectedDate) => {
  const [activeTab, setActiveTab] = useState("Sofas & Seating"); // Default active tab
  //const [selectedItems, setSelectedItems] = useState({}); // Store selected items and their quantities
  const [selectedItems, setSelectedItems] = useState([]); // ✅ Now an array
  const [step, setStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inventory, setInventory] = useState([]); // Store inventory items categorized
  const [inventoryData, setInventoryData] = useState([]);// Store inventory items categorized
  const [searchParams] = useSearchParams();
  const distance = searchParams.get("distance"); // Extract 'distance' from the URL query parameter
  const priceCalculateCitywise = searchParams.get("activeTab");
  const shiftingDate = searchParams.get("shiftingDate");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalCFT, setTotalCFT] = useState(0); // Store total CFT
  const [floor, setFloor] = useState(1); // Stores selected floor
  const [selectedFloors, setSelectedFloors] = useState([]); // Stores selected floors
  const [selectedDistances, setSelectedDistances] = useState([]); // Stores selected road distances
  const [serviceLift, setServiceLift] = useState(null); // "yes" or "no"
  const [selectedFloor, setSelectedFloor] = useState(null); // Stores selected floor
  const [vanAccessible, setVanAccessible] = useState(null); // "yes" or "no"
  const [roadDistance, setRoadDistance] = useState(null); // Stores selected road distance
  const [roadDetails, setRoadDetails] = useState(""); // Stores road condition details
  const [bookings, setBookings] = useState([]);
  const [bookingId,setBookingId]=useState(0);
  // Handles floor selection
  const userId = localStorage.getItem("userID"); // Retrieve saved userID
  const addressId=localStorage.getItem("addressID"); // Retrieve saved userID
   // Fetch inventory data from API
   useEffect(() => {
    const fetchInventory = async () => {
      try {
        console.log("Fetching inventory..."); // Debug log
        const response = await axios.get("https://localhost:7148/api/inventory/GetAllInventory");
        if (response.status === 200) {
          console.log("Inventory Data:", response.data); // Debugging fetched data
          setInventoryData(response.data);
          // Organize data by category
          const groupedData = organizeInventoryByCategory(response.data);
          setInventory(groupedData);
          setStep(2);

        }
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    fetchInventory();
  }, []);
  const handleFloorChange = (floor) => {
    setSelectedFloors((prev) =>
      prev.includes(floor) ? prev.filter((f) => f !== floor) : [...prev, floor]
    );
  };
  useEffect(() => {
    if (step === 2) {
      fetchBookings(userId);
    }
  }, [step]);

  const fetchBookings = async (userId) => {
    try {
      const response = await axios.get(`https://localhost:7148/api/Booking/GetBookings/${userId}`);
      if (response.status === 200) {
        console.log("booking received:", response.data);
        setBookings(response.data);
        setStep(3);


      } else {
       // console.error("Failed to fetch booking details: Unexpected response status", response.status);
      }

    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };
  // Handles road distance selection
  const handleDistanceChange = (distance) => {
    setSelectedDistances((prev) =>
      prev.includes(distance) ? prev.filter((d) => d !== distance) : [...prev, distance]
    );
  };
  // Populate selectedItems when both bookings and inventory are available
  useEffect(() => {
    populateSelectedItems();
  }, [step]); // Listen to changes in both bookings and inventory
  const populateSelectedItems = async () => {
    // if (bookings?.bookingItems && inventory?.Appliances)
    if (step===3) 
       {
      const latestBooking = bookings; // Assuming you want to take the latest booking
      const items = latestBooking?.bookingItems; // Use optional chaining to safely access bookingItem

      if (items) { // Check if items exist and has items
        if (inventory) { // Validate if inventory exists and has items
          // Map over booking items to set selectedItems with quantity and sizeCFT


          const populatedItems = items.map((item) => {
            // Search in the flattened array
            const inventoryItem = inventoryData.find(
              (invItem) => invItem?.itemID === item.itemID
            );

            return {
              itemID: item.itemID,
              name: inventoryItem.name,
              quantity: item.quantity,
              sizeCFT: inventoryItem ? inventoryItem.sizeCFT : 0,
            };
          });

          setSelectedItems(populatedItems);
        } else {
          console.log("Inventory is not defined or empty.");
        }
      } else {
        console.log("No items found in the latest booking.");
      }
    } else {
      console.log("Bookings is not defined.");
    }
  }
 
  useEffect(() => {
    calculatedCFT();
  }, [selectedItems]);

  const calculatedCFT = () => {
    const calculatedCFT = selectedItems.reduce(
      (total, item) => total + item.quantity * item.sizeCFT,
      0
    );
    setTotalCFT(calculatedCFT);
  }
  useEffect(() => {

    calculatePrice();

  }, [distance,totalCFT]); // ✅ Fetch price when distance or totalCFT changes
  const calculatePrice = () => {
    if ((distance > 100 && totalCFT > 100) || (distance > 0 && priceCalculateCitywise === "within" && totalCFT > 100)) {
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
            `https://localhost:7148/api/Price/GetPrice?distance=${dist}&cftTotal=${cft}&activeTab=${priceCalculateCitywise}`
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
  }
  // Price calculation based on service lift and van accessibility
  useEffect(() => {
    let updatedPrice = price; // Use existing price as base

    // Add ₹200 per floor if service lift is not available
    if (serviceLift === "no" && selectedFloor) {
      updatedPrice += selectedFloor * 200;
    }

    // Add ₹500 if van is not accessible and distance is selected
    if (vanAccessible === "no" && roadDistance) {
      updatedPrice += 500;
    }

    setPrice(updatedPrice);
  }, [serviceLift, selectedFloor, vanAccessible, roadDistance]);

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
    // const userID = localStorage.getItem("userID"); // Get user ID from localStorage
    // if (!userID) {
    //   alert("Please log in first!");
    //   return;
    // }

    // Placeholder values for now (these should be dynamically selected by the user)
    const sourceAddressID = addressId; // TODO: Replace with actual selected source address ID
    const destinationAddressID = addressId; // TODO: Replace with actual selected destination address ID
    const pickupDate = new Date(shiftingDate).toISOString(); // Format as needed
    const pickupTimeSlotID = 1; // TODO: Replace with actual selected time slot
    const totalAmount = price // TODO: Replace with actual calculation
    const bookingAmountPaid = 0.0; // TODO: Replace with actual payment data

    const bookingDetails = {
      userID: parseInt(userId, 10),
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
        setBookingId(response.data.bookingID);
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
    <Card sx={{ mx: "auto", p: 2, boxShadow: 4, borderRadius: 3, bgcolor: "#f9f9f9" }}>
      <CardContent>
        <header className="header">
          <div className="logo">
            <img src="/logo.png" alt="Company Logo" />
            <h1>Movers & Packers</h1>
          </div>
          <nav className="nav-links">
            <a href="#services">Services</a>
            <a href="#about">About Us</a>
            <a href="#contact">Contact</a>
            <button className="login-btn">Login</button>
          </nav>
        </header>
      </CardContent>

      <CardContent>
        {/* Heading */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
          <Category sx={{ color: "primary.main", mr: 1 }} />
          <Typography
            variant="h6"
            sx={{ color: "primary.main", fontWeight: "bold", textAlign: "center" }}
          >
            Search for a Household Item to Add
          </Typography>
        </Box>

        {/* Category Tabs */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center", mb: 3 }}>
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeTab === category ? "contained" : "outlined"}
              color="primary"
              onClick={() => handleTabChange(category)}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: 2,
                px: 2,
                py: 1,
              }}
            >
              {category}
            </Button>
          ))}
        </Box>

        {/* Inventory List */}
        <Paper
          elevation={3}
          sx={{ p: 3, borderRadius: 3, bgcolor: "#fafafa" }}
        >
          {inventory[activeTab]?.map((item, index) => {
            const selectedItem = selectedItems.find((selected) => selected.itemID === item.itemID);

            return (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  p: 1.5, // Compact padding
                  borderRadius: "12px",
                  bgcolor: "#fff",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.08)", // Soft shadow
                  mb: 1.5, // Space between items
                }}
              >
                {/* Item Name - Bold, International Font */}
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    fontSize: "14px",
                    flex: 1,
                    color: "#333", // Darker text for contrast
                  }}
                >
                  {item.name}
                </Typography>

                {/* Quantity Selector - Subtle, Well-Aligned */}
                <Select
                  value={selectedItem ? selectedItem.quantity : 1}
                  onChange={(e) => handleDropdownChange(item.itemID, e.target.value)}
                  size="small"
                  sx={{
                    minWidth: 55,
                    bgcolor: "#f9f9f9",
                    borderRadius: "8px",
                    boxShadow: "inset 0px 0px 4px rgba(0,0,0,0.1)", // Inner depth effect
                    fontSize: "13px",
                    fontWeight: 500,
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>

                {/* Increment & Decrement Buttons */}
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveItem(item.itemID)}
                    sx={{
                      bgcolor: "#fee2e2",
                      "&:hover": { bgcolor: "#fecaca" },
                      transition: "0.2s",
                    }}
                  >
                    <Remove fontSize="small" />
                  </IconButton>

                  {/* Quantity Display - Subtle, Balanced */}
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "14px", minWidth: "20px", textAlign: "center" }}>
                    {selectedItem ? selectedItem.quantity : 0}
                  </Typography>

                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleAddItem(item.itemID)}
                    sx={{
                      bgcolor: "#e0f2fe",
                      "&:hover": { bgcolor: "#bae6fd" },
                      transition: "0.2s",
                    }}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>

            );
          })}
        </Paper>
      </CardContent>
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}> {/* Reduced vertical gap */}

          {/* Section 1: Service Lift */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
              <Elevator sx={{ color: "primary.main", fontSize: 20 }} /> {/* Smaller icon */}
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "primary.main" }}>
                Is a Service Lift Available?
              </Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <ToggleButtonGroup
              value={serviceLift}
              exclusive
              onChange={(event, newValue) => setServiceLift(newValue)}
              sx={{ justifyContent: "center" }}
            >
              {["yes", "no"].map((option) => (
                <ToggleButton
                  key={option}
                  value={option}
                  size="small"
                  sx={{ px: 2, minWidth: 60, fontSize: "0.8rem" }} // Reduced width and padding
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          {/* Floor Selection */}
          {serviceLift === "no" && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}>
                Select the Floor
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <ToggleButtonGroup
                value={selectedFloor}
                exclusive
                onChange={(event, newValue) => setSelectedFloor(newValue)}
                sx={{ flexWrap: "wrap", gap: 0.5, justifyContent: "center" }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((floor) => (
                  <ToggleButton
                    key={floor}
                    value={floor}
                    size="small"
                    sx={{ px: 1.5, minWidth: 50, fontSize: "0.75rem" }}
                  >
                    {floor}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          )}

          {/* Section 2: Van Accessibility */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
              <LocalShipping sx={{ color: "primary.main", fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "primary.main" }}>
                Can the Van Reach Your House?
              </Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <ToggleButtonGroup
              value={vanAccessible}
              exclusive
              onChange={(event, newValue) => setVanAccessible(newValue)}
              sx={{ justifyContent: "center" }}
            >
              {["yes", "no"].map((option) => (
                <ToggleButton
                  key={option}
                  value={option}
                  size="small"
                  sx={{ px: 2, minWidth: 60, fontSize: "0.8rem" }}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          {/* Road Distance & Details */}
          {vanAccessible === "no" && (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                <LocationOn sx={{ color: "primary.main", fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "primary.main" }}>
                  Distance from the House
                </Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <ToggleButtonGroup
                value={roadDistance}
                exclusive
                onChange={(event, newValue) => setRoadDistance(newValue)}
                sx={{ flexWrap: "wrap", gap: 0.5, justifyContent: "center" }}
              >
                {["0-50m", "0-100m", "0-150m", "0-200m", "0-250m", "0-300m", "0-350m", "0-400m", "0-450m", "0-500m"].map((distance) => (
                  <ToggleButton
                    key={distance}
                    value={distance}
                    size="small"
                    sx={{ px: 1, minWidth: 70, fontSize: "0.75rem" }}
                  >
                    {distance}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>

              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "primary.main", mt: 2, mb: 1 }}>
                Enter Road Details
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <TextField
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                placeholder="Provide details..."
                value={roadDetails}
                onChange={(e) => setRoadDetails(e.target.value)}
                sx={{ fontSize: "0.8rem" }}
              />
            </Box>
          )}
        </Box>
      </CardContent>

      <CardContent>
        <BookingDetailsCard
          selectedItems={selectedItems}
          price={price}
          handleContinue={handleContinue}
          serviceLift={serviceLift}
          selectedFloor={selectedFloor}
          vanAccessible={vanAccessible}
          roadDistance={roadDistance}
        />

        {/* <CardActions>
        
          <button className="continue-btn" onClick={handleContinue}>
            Continue
          </button>
        </CardActions> */}



        {/* Popup Modal */}
        <PopupModal isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          price={price}
          shiftingDate={shiftingDate}
          userId={userId}
          bookingId={bookingId}
        />

        {/* Footer */}
        <footer className="footer">
          <p>&copy; 2024 Movers & Packers. All Rights Reserved.</p>
        </footer>
      </CardContent>


    </Card>

  );
};

export default BookingPage;
