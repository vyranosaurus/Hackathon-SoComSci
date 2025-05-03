import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import '../HospitalPage.css'; // Assuming your CSS is here
import BottomNavigation from "./BottomNavigation"; // Assuming this component exists
import { ArrowLeft, ChevronDown } from "lucide-react"; // Assuming you might use these icons elsewhere

// Mock navigate function for demonstration outside a router environment
const mockNavigate = (path) => {
    console.log(`Navigating to: ${path}`);
};

const HOSPITAL_ID = 'pgh-manila'; // Define the hospital ID

// Function to get queue data from localStorage
const getQueueData = (hospitalId) => {
    const data = localStorage.getItem(`hospitalQueue_${hospitalId}`);
    try {
        // Parse the JSON data from localStorage, return empty object if null/undefined or parsing fails
        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.error("Error parsing queue data from localStorage:", error);
        return {}; // Return empty object in case of parsing error
    }
};

// Define available services and their display names
const services = [
    { id: 'cardiology', name: 'Cardiologist' },
    { id: 'familymed', name: 'Family Med Doctor' },
    { id: 'rehab', name: 'Rehabilitation Doctor' },
];

// Helper to find service name by ID
const findServiceName = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : `Unknown Service (${serviceId})`;
};

const QueuePage = () => {
    // Use useNavigate hook for actual navigation in a React Router setup
    // const navigate = useNavigate();
    // Using mockNavigate for standalone example/demonstration
    const navigate = mockNavigate;

    const { serviceId } = useParams(); // Get serviceId from URL parameters provided by React Router

    const [allBookings, setAllBookings] = useState({});
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [serviceName, setServiceName] = useState('Loading...');

    // Effect to fetch and filter/sort data when serviceId changes
    useEffect(() => {
        console.log(`Workspaceing queue data for hospital: ${HOSPITAL_ID} for service: ${serviceId}`);
        // Retrieve all hospital bookings from localStorage
        const allHospitalBookings = getQueueData(HOSPITAL_ID);
        setAllBookings(allHospitalBookings); // Store all bookings (though not directly used after filtering)

        // Find the human-readable name for the current serviceId
        const currentServiceName = findServiceName(serviceId);
        setServiceName(currentServiceName); // Set the service name state

        // Get the list of bookings specifically for the current serviceId, default to empty array
        const bookingsForThisService = allHospitalBookings[serviceId] || [];

        // Add serviceName to each booking and sort them.
        // Sorting is crucial to determine the "position in the queue" (index).
        const bookingsWithServiceName = bookingsForThisService.map(booking => ({
            ...booking,
            serviceName: currentServiceName // Add service name for potential future use
        })).sort((a, b) => {
            // Define the desired order of urgency levels
            const urgencyOrder = { 'Critical': 1, 'Urgent': 2, 'Not urgent': 3, 'Not specified': 4, '': 4 };

            // Compare bookings first by urgency level
            // Use fallback (|| 4) for urgency not matching defined levels
            const urgencyComparison = (urgencyOrder[a.urgency || ''] || 4) - (urgencyOrder[b.urgency || ''] || 4);

            // If urgency levels are different, sort by urgency
            if (urgencyComparison !== 0) return urgencyComparison;

            // If urgency levels are the same, sort by timestamp (earliest first)
            return new Date(a.timestamp) - new Date(b.timestamp);
        });

        // Set the state with the filtered and sorted bookings
        setFilteredBookings(bookingsWithServiceName);

    }, [serviceId]); // Dependency array: rerun this effect whenever serviceId changes

    // Determine properties for the optional priority text tag
    // The showIndicator property is no longer used to control the visibility of the numbered circle
    const getPriorityTag = (urgency) => {
        switch (urgency) {
            case 'Urgent':
                // showIndicator is true for Urgent (still useful for item-urgent class or other logic)
                return { text: '#URGENT', className: 'tag-urgent', showIndicator: true };
            case 'Critical':
                 // showIndicator is true for Critical (still useful for item-critical class or other logic)
                return { text: '#CRITICAL', className: 'tag-critical', showIndicator: true };
            default:
                // showIndicator is false for all other cases
                return { text: '', className: '', showIndicator: false };
        }
    };

    // Determine urgency class for list item styling
    const getUrgencyClass = (urgency) => {
        switch (urgency) {
            case 'Urgent': return 'item-urgent';
            case 'Critical': return 'item-critical';
            default: return ''; // No special class for non-urgent/critical
        }
    };

    return (
      <div className="container hospital-container queue-page-container">
        {/* Header Section */}
        <header className="queue-header mt-6">
               {/* Back arrow */}
               <div className="back-arrow" onClick={() => navigate("/")}>
            <ArrowLeft size={20} color="white" />
          </div>
               {/* Queue Title */}
               <h1>{serviceName} Queue</h1> {/* Display the dynamically set service name */}
           </header>

           <div className="horizontal-line"></div> {/* Visual separator */}

           {/* Queue List Container - Scrollable Area */}
           <div className="queue-list-container"
               style={{
                   flexGrow: 1, // Allows this div to take up remaining space
                   overflowY: 'auto', // Enables vertical scrolling if content overflows
                   padding: '0 1rem', // Add horizontal padding
                   boxSizing: 'border-box' // Include padding in element's size calculation
               }}
           >
            {/* Conditional rendering: Show message if no bookings, otherwise show the list */}
            {filteredBookings.length === 0 ? (
                <p style={{ textAlign: 'center', marginTop: '20px' }}>No bookings available for this service yet.</p>
            ) : (
                <ul className="patient-list">
                    {/* Map through the sorted and filtered bookings */}
                    {filteredBookings.map((booking, index) => {
                        const priority = getPriorityTag(booking.urgency); // Get priority details for the item
                        const urgencyClass = getUrgencyClass(booking.urgency); // Get urgency-based CSS class

                        return (
                           <li key={`${booking.serviceId}-${index}-${booking.timestamp}`} className={`patient-item ${urgencyClass}`}>
                                {/* Patient Avatar and Numbered Indicator Section */}
                                <div className="patient-avatar">
                                    {/* Patient avatar image */}
                                    <img
                                        src="https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg" // Static avatar image URL
                                        alt={booking.name} // Alt text for accessibility
                                        style={{ borderRadius: '50%', width: '40px', height: '40px', objectFit: 'cover' }} // Inline styles for avatar shape and size
                                    />

                                    {/* Numbered Priority Indicator (Always Shows for ALL items) */}
                                    {/* This div now shows the queue position number and is always present */}
                                     <div className="priority-indicator">
                                         {index + 1} {/* Display the 1-based queue position number here */}
                                     </div>
                                     {/* The conditional rendering logic has been removed for the numbered indicator */}
                                </div>

                                {/* Patient Information Section */}
                                <div className="patient-info">
                                   {/* Patient's name and the text-based priority tag */}
                                   <div className="patient-name">
                                     {booking.name} {/* Patient's name */}
                                     {/* This text tag (#URGENT, #CRITICAL) is still conditional */}
                                     {priority.text && (
                                        <span className={`patient-tag ${priority.className}`}>
                                            {priority.text} {/* The priority text (e.g., #URGENT, #CRITICAL) */}
                                        </span>
                                     )}
                                   </div>
                                   {/* Patient's reported condition or concern */}
                                   <div className="patient-condition">{booking.concern}</div>
                                </div>

                                {/* Booking Date Section */}
                                <div className="patient-date">
                                   {/* Display the booking timestamp formatted as a local date */}
                                   {new Date(booking.timestamp).toLocaleDateString()}
                                </div>

                                {/* View Button */}
                                <button
                                        className="bg-red-800 text-white px-4 py-1 rounded-md font-medium" // Example Tailwind CSS classes for styling
                                        onClick={() => { console.log('View booking details for:', booking.name, booking); }} // Action when button is clicked
                                        type="button" // Specify button type
                                      >
                                        View {/* Button text */}
                                      </button>
                           </li>
                        );
                    })}
                </ul>
            )}
           </div>

           {/* Bottom Navigation Component */}
           <BottomNavigation /> {/* Assuming this component is for navigation */}
        </div>
    );
};

export default QueuePage;