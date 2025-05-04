import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Paper, Box } from "@mui/material";
import PaymentSummary from "./PaymentSummary"; // Adjust the path as needed
import ReportPDF from "./ReportPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
const PopupModal = ({ isOpen, onClose, price,shiftingDate,userId,bookingId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date(shiftingDate)); // Default to today
  const [selectedSlot, setSelectedSlot] = useState("2:30 PM"); // Default to 2:30 PM
  const [totalPrice, setTotalPrice] = useState(0.0);
  const [startIndex, setStartIndex] = useState(0);
  // ✅ Define Available Pickup Slots
  const slots = ["9:30 AM", "2:30 PM", "5:00 PM"];

  // Generate next 4 days dynamically
  const generateDates = (startDate) => {
    return Array.from({ length: 10 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const isWeekend = date.getDay() === 6 || date.getDay() === 0;
      const adjustedPrice = isWeekend ? price * 1.05 : price;
      return { day: date.toLocaleDateString("en-US", { weekday: "short" }), dateText: date.toLocaleDateString("en-US", { day: "2-digit", month: "short" }), fullDate: date, basePrice: adjustedPrice, isWeekend };
    });
  };

  const [dates, setDates] = useState(generateDates(new Date(shiftingDate)));

  useEffect(() => {
    setDates(generateDates(new Date(shiftingDate)));
  }, [price, shiftingDate]);

  useEffect(() => {
    const selectedDateInfo = dates.find(date => date.fullDate.toDateString() === selectedDate.toDateString());
    if (!selectedDateInfo) {
      setTotalPrice(price);
      return;
    }
    let finalPrice = selectedDateInfo.basePrice;
    if (selectedSlot === "9:30 AM") {
      finalPrice *= 1.05;
    }
    setTotalPrice(finalPrice.toFixed(2));
  }, [selectedDate, selectedSlot, dates, price]);


  const reportData = {
    quotationNo: "QUBNG242539751",
    date: "25 Feb 2025",
    vehicleType: "PART LOAD / SHARED CONSIGNMENT",
    cft: "456.80",
    clientName: "Varun Gupta",
    clientAddress: "Benson Town, Bangalore - 560046",
    freightCharges: "₹ 97,650.00",
    sgst: "₹ 0.00",
    cgst: "₹ 0.00",
    igst: "₹ 0.00",
    total: "₹ 97,650.00",
    paymentTerms: ["100% payment before loading", "10% advance required"],
    terms: ["Freight charges based on actual volume"],
    exclusions: ["Any professional third-party services"],
  };



  const handleScrollRight = () => {
    if (startIndex + 4 < dates.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handleScrollLeft = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="lg">
    

      
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
          <Box sx={{ flex: 1, p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center" }}>Confirm Your Shifting Date & Slot</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 2 }}>Select Pickup Date:</Typography>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "center", alignItems: "center" }}>
              <Button onClick={handleScrollLeft} disabled={startIndex === 0}>◀</Button>
              {dates.slice(startIndex, startIndex + 4).map((item, index) => (
                <Paper key={index} elevation={selectedDate.toDateString() === item.fullDate.toDateString() ? 4 : 1} sx={{ p: 2, textAlign: "center", cursor: "pointer", borderRadius: 2, transition: "0.3s", border: selectedDate.toDateString() === item.fullDate.toDateString() ? "2px solid #1976d2" : "1px solid #ddd", bgcolor: selectedDate.toDateString() === item.fullDate.toDateString() ? "#e3f2fd" : "#fff", color: item.isWeekend ? "red" : "inherit", "&:hover": { boxShadow: 4, transform: "scale(1.05)" }, }} onClick={() => setSelectedDate(item.fullDate)}>
                  <Typography variant="body2" sx={{ fontWeight: "bold", color: item.isWeekend ? "red" : "inherit" }}>{item.day}</Typography>
                  <Typography variant="h6">{item.dateText}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold", color: "green" }}>₹ {item.basePrice}</Typography>
                </Paper>
              ))}
              <Button onClick={handleScrollRight} disabled={startIndex + 4 >= dates.length}>▶</Button>
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 3 }}>
              Select Pickup Slot:
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              {slots.map((slot, index) => (
                <Button
                  key={index}
                  variant={selectedSlot === slot ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => setSelectedSlot(slot)}
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                  }}
                >
                  {slot}
                </Button>
              ))}
            </Box>

            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 3 }}>Select from Calendar:</Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <DatePicker selected={selectedDate} onChange={(date) => { setSelectedDate(date); setDates(generateDates(date)); setStartIndex(0); }} minDate={new Date(shiftingDate)} className="date-picker" inline />
            </Box>
            <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold", mt: 3 }}>
              Total Price: <span style={{ color: selectedSlot === "9:30 AM" ? "red" : "green" }}>₹ {totalPrice}</span>
            </Typography>
          </Box>
           {/* Right Section: Payment Summary */}
           <Box sx={{ flex: 1, p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center" }}>
              Payment Summary
            </Typography>
            <PaymentSummary price={totalPrice} userId={userId} bookingId={bookingId} />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        {/* <Button onClick={() => alert(`Pickup confirmed on ${selectedDate.toLocaleDateString()} at ${selectedSlot}`)} variant="contained" color="primary">
          Confirm
        </Button> */}
        {/* PDF Download Button */}
        {/* <PDFDownloadLink document={<ReportPDF  />} fileName="Quotation_Report.pdf">
            {({ loading }) => (
              <Button variant="contained" color="primary">
                {loading ? "Generating PDF..." : "Download Report"}
              </Button>
            )}
          </PDFDownloadLink>  */}
      </DialogActions>
    </Dialog>
  );
};

export default PopupModal;
