// QueuePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import '../QueuePage.css'; // Make sure your CSS file is in the correct path
// import BottomNavigation from "./BottomNavigation"; // Assuming this component exists - Note: This component is imported but not used in the provided JSX.
import { ArrowLeft } from "lucide-react"; // Import icons
import BottomNavigation from './BottomNavigation';
// *** Define your backend API base URL ***
// !!! IMPORTANT: Update this with your actual backend URL and port !!!
const BACKEND_API_URL = 'http://localhost:8080/api'; // Default Spring Boot port

const QueuePage = () => {
    const navigate = useNavigate();
    // Get hospitalId and serviceId from URL parameters
    const { hospitalId, serviceId } = useParams();
    const [bookings, setBookings] = useState([]);
    // We can get names directly from the first booking if available or fetch separately
    const [hospitalName, setHospitalName] = useState('Loading Hospital...');
    const [serviceName, setServiceName] = useState('Loading Service...');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State to manage the detail view modal
    const [selectedBookingForDetails, setSelectedBookingForDetails] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);


    // Effect to fetch the queue data
    useEffect(() => {
        const fetchQueueData = async () => {
            setIsLoading(true);
            setError(null);
            setBookings([]); // Clear previous bookings
            setHospitalName('Loading Hospital...');
            setServiceName('Loading Service...');

            console.log(`Workspaceing queue data for hospital: ${hospitalId}, service: ${serviceId}`); // Corrected console log

            // Fetch queue data using both hospitalId and serviceId from URL params
            const queueEndpoint = `${BACKEND_API_URL}/queue/${hospitalId}/${serviceId}`;

            try {
                const response = await fetch(queueEndpoint);

                if (!response.ok) {
                    const errorBody = await response.text();
                    let errorDetail = { message: `HTTP Error: ${response.status}` };
                    try {
                        errorDetail = JSON.parse(errorBody);
                    } catch (parseError) {
                         errorDetail.message = `HTTP Error: ${response.status} - ${errorBody}`;
                    }
                    console.error("Backend API Error (Queue):", response.status, errorDetail);
                    setError(`Failed to load queue data: ${errorDetail.message || response.statusText}`);
                    setHospitalName(`Hospital (${hospitalId})`); // Fallback names on error
                    setServiceName(`Service (${serviceId})`);
                    return;
                }

                const data = await response.json();
                console.log("Queue data received from backend:", data);

                setBookings(data); // Set the state with the data from backend (already sorted)

                // Set hospital and service names from the fetched data if available
                // Assuming the backend includes nested hospital and service objects in the booking response
                // NOTE: Fetching names separately as a fallback is good practice if nested objects aren't guaranteed
                if (data.length > 0 && data[0].hospital && data[0].service) {
                    setHospitalName(data[0].hospital.name);
                    setServiceName(data[0].service.name);
                } else {
                    // Fallback if no data or backend didn't include nested objects
                    // You might want to fetch these separately if needed for the title
                    const fetchNames = async () => {
                        try {
                             // Assuming backend endpoints /api/hospitals/{hospitalId} and /api/services/{serviceId} exist
                             const hospitalRes = await fetch(`${BACKEND_API_URL}/hospitals/${hospitalId}`);
                             if(hospitalRes.ok) {
                                 const hData = await hospitalRes.json();
                                 setHospitalName(hData.name);
                             } else {
                                console.warn(`Could not fetch hospital name for ID: ${hospitalId}`);
                             }
                             const serviceRes = await fetch(`${BACKEND_API_URL}/services/${serviceId}`);
                             if(serviceRes.ok) {
                                 const sData = await serviceRes.json();
                                 setServiceName(sData.name);
                             } else {
                                console.warn(`Could not fetch service name for ID: ${serviceId}`);
                             }
                        } catch (nameError) {
                            console.error("Could not fetch hospital/service names:", nameError);
                        }
                    };
                   // Only try to fetch names if there was data returned (even if hospital/service nested objects were missing)
                   fetchNames(); // Call the fallback name fetch
                }


            } catch (error) {
                console.error("Error fetching queue data from backend:", error);
                setError(`Failed to connect to queue service: ${error.message}`);
                setBookings([]); // Clear bookings on error
                 setHospitalName(`Hospital (${hospitalId})`); // Fallback names on error
                setServiceName(`Service (${serviceId})`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQueueData();
    }, [hospitalId, serviceId, BACKEND_API_URL]); // Add hospitalId, serviceId, and BACKEND_API_URL to dependencies

    // Determine properties for the optional priority text tag (based on the 'urgency' field from backend)
    const getPriorityTag = (urgency) => {
        switch (urgency) {
            case 'Urgent':
                return { text: '#URGENT', className: 'tag-urgent', showIndicator: true };
            case 'Critical':
                return { text: '#CRITICAL', className: 'tag-critical', showIndicator: true };
            default: // Includes 'Not urgent' and 'Not specified'
                return { text: '', className: '', showIndicator: false }; // Don't show tag for non-urgent/unspecified
        }
    };
    // Determine urgency class for list item styling (based on the 'urgency' field from backend)
    const getUrgencyClass = (urgency) => {
        switch (urgency) {
            case 'Urgent': return 'item-urgent';
            case 'Critical': return 'item-critical';
            case 'Not urgent': return 'item-not-urgent'; // Add a class for not urgent if you want specific styling
            default: return ''; // Default for 'Not specified' or others
        }
    };
    // Function to get the display class/color for the numbered indicator based on the 'urgency' field
    const getUrgencyIndicatorClass = (urgency) => {
         switch (urgency) {
             case 'Urgent': return 'indicator-urgent';
             case 'Critical': return 'indicator-critical';
             case 'Not urgent': return 'indicator-not-urgent'; // A neutral color
             default: return 'indicator-default'; // Style for 'Not specified' or unknown
         }
     };

    // Helper function to format the timestamp
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';
        try {
            // Assuming timestamp is an ISO 8601 string from Java's LocalDateTime
            const date = new Date(timestamp);
            // Format as desired, e.g., "MMM dd, HH:mm"
            // Using toLocaleString provides a balance of date and time
             return date.toLocaleString(); // Example output: "1/1/2023, 10:30:00 AM"
             // Or just date: return date.toLocaleDateString();
             // Or just time: return date.toLocaleTimeString();
        } catch (e) {
            console.error("Error formatting timestamp:", timestamp, e);
            return 'Invalid Date';
        }
    };

    // Function to open the detail modal
    const handleViewDetails = (booking) => {
        setSelectedBookingForDetails(booking);
        setIsDetailModalOpen(true);
    };

    // Function to close the detail modal
    const closeDetailModal = () => {
        setSelectedBookingForDetails(null);
        setIsDetailModalOpen(false);
    };


    return (
        <div className="container hospital-container queue-page-container">
            {/* Header Section */}
            <header className="queue-header mt-6">
                     {/* Back arrow */}
                     {/* Navigate back to the specific hospital page if possible, or just home */}
                     {/* If you want to go back to the specific hospital's service list, you'd need to navigate to `/hospital/${hospitalId}` if you had such a route */}
                     <div className="back-arrow" onClick={() => navigate(`/hospital`)}> {/* Simple back to home for now */}
                          <ArrowLeft size={20} color="white" />
                     </div>
                     {/* Queue Title */}
                     <h1 style = {{color: 'white', width: '100%', margin: 0}}>{serviceName} Queue</h1> {/* Display Hospital and Service Name */}
                   </header>

                   <div className="horizontal-line"></div> {/* Visual separator */}

                   {/* Queue List Container - Scrollable Area */}
                   <div className="queue-list-container"> {/* Removed inline styles, using CSS class */}
                   {/* Conditional Rendering for Loading, Error, Empty, or List */}
                   {isLoading ? (
                       <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading queue...</p>
                   ) : error ? (
                       <p style={{ textAlign: 'center', marginTop: '20px', color: 'red' }}>Error: {error}</p>
                   ) : bookings.length === 0 ? (
                       <p style={{ textAlign: 'center', marginTop: '20px' }}>No bookings available for this service yet.</p>
                   ) : (
                        // Render the list if not loading, no error, and bookings exist
                         <ul className="patient-list"> {/* Use patient-list class as in your CSS */}
                             {/* Map through the already sorted bookings from backend */}
                             {bookings.map((booking, index) => {
                                  // Use the 'urgency' field (now populated by AI and sorted by backend) for display and styling
                                  const priority = getPriorityTag(booking.urgency); // Get priority details for the item
                                  const urgencyClass = getUrgencyClass(booking.urgency); // Get urgency-based CSS class for the list item
                                  const indicatorClass = getUrgencyIndicatorClass(booking.urgency); // Get class for indicator color

                                  return (
                                       // Use booking.id from backend as key
                                       // Add a click handler to open details, using the View button below instead
                                        <li key={booking.id || `${index}-${booking.timestamp}`} className={`patient-item ${urgencyClass}`}>
                                            {/* Patient Avatar and Numbered Indicator Section */}
                                            <div className="patient-avatar">
                                                {/* Patient avatar image */}
                                                <img
                                                     src="https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg" // Static avatar image URL
                                                      alt={"Patient Avatar"} // Use generic alt text for anonymity in list
                                                />
                                                {/* Numbered Indicator (Always Shows) - Class based on AI Urgency received from backend */}
                                                <div className={`priority-indicator ${indicatorClass}`}>
                                                     {index + 1} {/* Display the 1-based queue position number based on backend order */}
                                                </div>
                                            </div>

                                            {/* Patient Information Section (Anonymous in list) */}
                                            <div className="patient-info">
                                                 {/* Display "Anonymous User" or similar instead of name */}
                                                 <div className="patient-name">
                                                      Anonymous User {/* Display anonymous text */}
                                                      {/* This text tag (#URGENT, #CRITICAL) is conditional based on the 'urgency' field from backend */}
                                                     {priority.text && (
                                                          <span className={`patient-tag ${priority.className}`}>
                                                                {priority.text}
                                                          </span>
                                                      )}
                                                 </div>
                                                 {/* Patient's reported condition or concern */}
                                                 <div className="patient-condition">
                                                      {booking.concern}
                                                 </div>
                                                 {/* Urgency Level and Score (Optional to display) */}
                                                 {/* <div className="patient-urgency-details">
                                                      Urgency: {booking.urgency}
                                                      {booking.urgency === 'Urgent' && booking.urgentPriorityScore != null && (
                                                           <span> (Score: {booking.urgentPriorityScore})</span>
                                                      )}
                                                 </div> */}
                                            </div>

                                            {/* Booking Date Section - REMOVE FROM LIST VIEW */}
                                             {/* <div className="patient-date">
                                                  Booked: {formatTimestamp(booking.timestamp)}
                                               </div> */}

                                             {/* View Button (Optional - for viewing full booking details) */}
                                             <button
                                                      className="hview-button" // Using specific CSS class
                                                       // Call the new handleViewDetails function with the booking object
                                                       onClick={() => handleViewDetails(booking)}
                                                       type="button"
                                                   >
                                                        View
                                                   </button>

                                                </li>
                                  );
                             })}
                         </ul>
                    )
                    }
                   </div>

            {/* --- Booking Detail Modal --- */}
            {isDetailModalOpen && selectedBookingForDetails && (
                <div className="modal-overlay"> {/* Use a modal overlay */}
                    <div className="modal-content"> {/* Use modal content styling */}
                        <h2 className="modal-title">Booking Details</h2> {/* Title for the modal */}
                        {/* Do NOT display name for anonymity */}
                        {/* Do NOT display phone number */}

                        {/* Display Urgency/Severity */}
                        <p><strong>Urgency:</strong> {selectedBookingForDetails.urgency}</p>

                        {/* Display Booked Time and Date */}
                        {selectedBookingForDetails.timestamp && (
                             <p><strong>Booked At:</strong> {formatTimestamp(selectedBookingForDetails.timestamp)}</p>
                        )}

                        {/* Display Concern */}
                        <p><strong>Concern:</strong> {selectedBookingForDetails.concern}</p>

                        {/* Optional: Display Medical Card Details if they exist and you want them visible in the detail view */}
                        {selectedBookingForDetails.hasMedicalCard && (
                            <div className="medical-card-details-modal">
                                <p><strong>Medical Card:</strong> Yes</p>
                                {/* You might choose to display company/number/name here or keep them truly private */}
                                {/* <p>Company: {selectedBookingForDetails.medicalCardCompany}</p> */}
                                {/* <p>Number: {selectedBookingForDetails.medicalCardNumber}</p> */}
                                {/* <p>Name on Card: {selectedBookingForDetails.medicalCardName}</p> */}
                            </div>
                        )}


                        {/* Button to close the modal */}
                        <button type="button" className="button close-modal-button" onClick={closeDetailModal}>Close</button>
                    </div>
                </div>
            )}
            {/* --- End Booking Detail Modal --- */}


            {/* Bottom Navigation is now rendered globally in App.js or other root component */}
            <BottomNavigation />
        </div>
    );
};

export default QueuePage;