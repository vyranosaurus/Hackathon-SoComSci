
// QueuePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import '../QueuePage.css'; // Make sure your CSS file is in the correct path
// import BottomNavigation from "./BottomNavigation"; // Assuming this component exists - Note: This component is imported but not used in the provided JSX.
import { ArrowLeft } from "lucide-react"; // Import icons

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

    // Effect to fetch the queue data
    useEffect(() => {
        const fetchQueueData = async () => {
            setIsLoading(true);
            setError(null);
            setBookings([]); // Clear previous bookings
            setHospitalName('Loading Hospital...');
            setServiceName('Loading Service...');

            console.log(`Workspaceing queue data for hospital: ${hospitalId}, service: ${serviceId}`);

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
                if (data.length > 0 && data[0].hospital && data[0].service) {
                    setHospitalName(data[0].hospital.name);
                    setServiceName(data[0].service.name);
                } else {
                    // Fallback if no data or backend didn't include nested objects
                    // You might want to fetch these separately if needed for the title
                    setHospitalName(`Hospital (${hospitalId})`); // Display IDs in title as fallback
                    setServiceName(`Service (${serviceId})`);
                    // Optional: Fetch hospital/service names separately if not included in bookings response
                    // This adds extra API calls, but ensures names are displayed if bookings response is minimal
                    const fetchNames = async () => {
                        try {
                             // Assuming backend endpoints /api/hospitals/{hospitalId} and /api/services/{serviceId} exist
                             const hospitalRes = await fetch(`${BACKEND_API_URL}/hospitals/${hospitalId}`);
                             if(hospitalRes.ok) {
                                 const hData = await hospitalRes.json();
                                 setHospitalName(hData.name);
                             }
                             const serviceRes = await fetch(`${BACKEND_API_URL}/services/${serviceId}`);
                             if(serviceRes.ok) {
                                 const sData = await serviceRes.json();
                                 setServiceName(sData.name);
                             }
                        } catch (nameError) {
                            console.error("Could not fetch hospital/service names:", nameError);
                            // Names remain fallback IDs set above
                        }
                    };
                   if (data.length > 0) { // Only try to fetch names if there was data returned (even if hospital/service nested objects were missing)
                        fetchNames(); // Call the fallback name fetch
                   }
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
            default:
                return { text: '', className: '', showIndicator: false };
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
            // Format as desired, e.g., "MMM dd, yyyy HH:mm"
            // Using toLocaleString provides a balance of date and time
             return date.toLocaleString(); // Example output: "1/1/2023, 10:30:00 AM"
             // Or just date: return date.toLocaleDateString();
             // Or just time: return date.toLocaleTimeString();
        } catch (e) {
            console.error("Error formatting timestamp:", timestamp, e);
            return 'Invalid Date';
        }
    };


    return (
        <div className="container hospital-container queue-page-container">
            {/* Header Section */}
            <header className="queue-header mt-6">
                     {/* Back arrow */}
                     {/* Navigate back to the specific hospital page if possible, or just home */}
                     {/* If you want to go back to the specific hospital's service list, you'd need to navigate to `/hospital/${hospitalId}` if you had such a route */}
                     <div className="back-arrow" onClick={() => navigate(`/`)}> {/* Simple back to home for now */}
                         <ArrowLeft size={20} color="white" />
                     </div>
                     {/* Queue Title */}
                     <h1>{hospitalName} - {serviceName} Queue</h1> {/* Display Hospital and Service Name */}
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
                                      <li key={booking.id || `${index}-${booking.timestamp}`} className={`patient-item ${urgencyClass}`}>
                                           {/* Patient Avatar and Numbered Indicator Section */}
                                           <div className="patient-avatar">
                                                {/* Patient avatar image */}
                                                <img
                                                    src="https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg" // Static avatar image URL
                                                     alt={booking.name} // Alt text for accessibility
                                                />
                                                {/* Numbered Indicator (Always Shows) - Class based on AI Urgency received from backend */}
                                                <div className={`priority-indicator ${indicatorClass}`}>
                                                     {index + 1} {/* Display the 1-based queue position number based on backend order */}
                                                </div>
                                            </div>

                                           {/* Patient Information Section */}
                                           <div className="patient-info">
                                                {/* Patient's name and the text-based priority tag (based on 'urgency') */}
                                                 <div className="patient-name">
                                                     {booking.name} {/* Patient's name */}
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

                                           {/* Booking Date Section */}
                                            <div className="patient-date">
                                                 {/* Display the booking timestamp formatted */}
                                                 {/* Ensure timestamp is parsed correctly if it's a string */}
                                                 Booked: {formatTimestamp(booking.timestamp)} {/* Use the formatting helper */}
                                             </div>

                                             {/* View Button (Optional - for viewing full booking details) */}
                                             {/* You would implement navigation or a modal to show full details */}
                                             <button
                                                      className="view-button" // Using specific CSS class
                                                      onClick={() => { console.log('View booking details for:', booking.name, booking); /* Add navigation or modal logic here */ }}
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

            </div>
         );
    };

export default QueuePage;