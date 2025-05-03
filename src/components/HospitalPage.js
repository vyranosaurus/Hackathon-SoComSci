import React, { useState, useEffect } from 'react';
import '../HospitalPage.css'; // Import the dedicated CSS file
import BottomNavigation from './BottomNavigation';

// Assuming BottomNavigation.js is a separate component you will provide
// import BottomNavigation from './BottomNavigation'; // Placeholder import

// Note: For a real React app, you should add the Google Fonts link
// in your public/index.html file's <head> section:
// <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">

// Define a unique ID for this hospital.
// In a real multi-hospital app, this would likely come from props or context.
// CHANGE THIS ID FOR EACH HOSPITAL FILE DUPLICATION
const HOSPITAL_ID = 'pgh-manila';

// Helper function to get data from localStorage
const getQueueData = (hospitalId) => {
    const data = localStorage.getItem(`hospitalQueue_${hospitalId}`);
    return data ? JSON.parse(data) : {};
};

// Helper function to save data to localStorage
const saveQueueData = (hospitalId, data) => {
    localStorage.setItem(`hospitalQueue_${hospitalId}`, JSON.stringify(data));
};

// Sample service data - replace with actual data if needed
const services = [
    {
        id: 'cardiology',
        name: 'Cardiologist',
        rating: 4.8,
        description: 'Consult with a heart specialist. Cardiologists diagnose, treat, and prevent conditions affecting your heart and blood vessels.',
        // Placeholder image - replace with actual image URL or component
        imageUrl: 'https://www.concilio.com/wp-content/uploads/cardiologie-concilio-votre-conciergerie-medicale_718x452.jpg?x44843'
    },
    {
        id: 'familymed',
        name: 'Family Med Doctor',
        rating: 4.9,
        description: 'Consult with a doctor for your general health needs. Physicians provide primary care for individuals and families of all ages.',
        // Placeholder image - replace with actual image URL or component
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdG5w64b42a0Oo4yL1nNdAESYpt8N97Yylyg&s'
    },
    {
        id: 'rehab',
        name: 'Rehabilitation Doctor',
        rating: 4.8,
        description: 'Consult a specialist focused on restoring function and mobility. Rehab doctors treat conditions causing pain or limiting movement due to injury etc.',
        // Placeholder image - replace with actual image URL or component
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE_n2KiII2j14bQI9dszr8MCFa9PexrCIGrg&s'
    },
    // Add more services as needed
];

function HospitalPage() {
    // State for managing the consultation form modal
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    // State for managing the queue display modal
    const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);
    // State to store the currently selected service for booking/queue
    const [selectedService, setSelectedService] = useState(null);
    // State for form input values
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        number: '',
        concern: '',
        hasMedicalCard: false,
        medicalCardCompany: '',
        medicalCardNumber: '',
        medicalCardName: '',
    });
    // State to store the queue data for the selected service
    const [currentQueue, setCurrentQueue] = useState([]);
    // State to store all queue data for this hospital from localStorage
    const [allQueueData, setAllQueueData] = useState({});
    // State for the search input value
    const [searchTerm, setSearchTerm] = useState('');

    // Load queue data from localStorage when the component mounts
    useEffect(() => {
        setAllQueueData(getQueueData(HOSPITAL_ID));
    }, []);

    // Filter services based on search term
    // This calculation runs every time searchTerm or services changes.
    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle opening the consultation form modal
    const handleConsult = (service) => {
        setSelectedService(service);
        setIsFormModalOpen(true);
    };

    // Handle opening the queue display modal
    const handleViewQueue = (service) => {
        setSelectedService(service);
        // Filter queue data for the specific hospital and service
        const serviceQueue = allQueueData[service.id] || [];
        setCurrentQueue(serviceQueue);
        setIsQueueModalOpen(true);
    };

    // Handle form input changes
    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    // Handle submitting the booking form
    const handleSubmitBooking = () => {
        if (!selectedService) return;

        // Create a new booking entry
        const newBooking = {
            ...formData,
            hospitalId: HOSPITAL_ID, // Store the hospital ID
            serviceId: selectedService.id, // Store the service ID
            timestamp: new Date().toISOString(), // Add a timestamp
        };

        // Update the queue data state and localStorage
        const updatedQueueData = { ...allQueueData };
        if (!updatedQueueData[selectedService.id]) {
            updatedQueueData[selectedService.id] = [];
        }
        updatedQueueData[selectedService.id].push(newBooking);

        setAllQueueData(updatedQueueData);
        saveQueueData(HOSPITAL_ID, updatedQueueData);

        // Close the modal and reset the form
        setIsFormModalOpen(false);
        setFormData({
            name: '',
            age: '',
            number: '',
            concern: '',
            hasMedicalCard: false,
            medicalCardCompany: '',
            medicalCardNumber: '',
            medicalCardName: '',
        });
        setSelectedService(null);
    };

    // Handle closing any modal
    const closeModal = () => {
        setIsFormModalOpen(false);
        setIsQueueModalOpen(false);
        // Reset form data when form modal closes
        if (!isQueueModalOpen) {
             setFormData({
                name: '',
                age: '',
                number: '',
                concern: '',
                hasMedicalCard: false,
                medicalCardCompany: '',
                medicalCardNumber: '',
                medicalCardName: '',
            });
        }
        // Reset current queue when queue modal closes
        if (!isFormModalOpen) {
            setCurrentQueue([]);
        }
        // Keep selectedService for potential re-opening or context
        // setSelectedService(null); // Might want to keep it if user views queue after booking
    };

    return (
        // Main container with max-width and height for mobile view
        <div className="hospital-container">
            {/* Header Section (Placeholder) */}
            <div className="header">
                <div className="location-info">
                    {/* Location Icon Placeholder */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon location-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span1>Taft Ave, Ermita, Manila, 1000 Metro Manila</span1>

                </div>
                {/* Profile Picture Placeholder */}
                <div className="profile-picture"></div>
            </div>

            {/* Hospital Banner Section - Now full image */}
            <div className="hbanner" style={{alignItems: 'center', justifyContent: 'center',width: '97%', margin:'.5rem', height: '30%', backgroundImage: `url('https://i0.wp.com/up.edu.ph/wp-content/uploads/2020/03/20200323-Philippine-General-Hospital_0.jpg?fit=1398%2C1048&ssl=1')` }}>
                <div className="banner-overlay" style ={{alignItems: 'center', justifyContent: 'center', inset: 0}}></div>
                <div className="hbanner-content" style ={{alignItems: 'center', justifyContent: 'center', inset: 0}}>
                    <h1 className="banner-title">Philippine General Hospital</h1>
                    <p className="banner-subtitle">PGH: Healthcare for Every Filipino.</p>
                    <button className="book-now-button">
                        Book Now!
                    </button>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="scrollable-content"  style={{marginTop:'.5rem'}}>
                {/* Search Bar Section */}
                <div className="search-bar">
                    {/* Menu Icon Placeholder */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search for healthcare services..."
                        className="search-input"
                        value={searchTerm} // Bind input value to searchTerm state
                        onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm state on change
                    />
                    {/* Search Icon Placeholder */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Service List Section - Now displays filteredServices */}
                <div className="service-list">
                    {filteredServices.length === 0 ? (
                        <p>No services found matching your search.</p>
                    ) : (
                        filteredServices.map(service => (
                            <div key={service.id} className="service-card">
                                {/* Service Image */}
                                <img src={service.imageUrl} alt={service.name} className="service-image" />
                                {/* Service Details and Buttons */}
                                <div className="service-details">
                                    <div>
                                        <div className="service-rating">
                                            <span className="star-icon">★</span>
                                            <span className="rating-value">{service.rating}</span>
                                            <h3 className="service-name">{service.name}</h3>
                                        </div>
                                        <p className="service-description">{service.description}</p>
                                    </div>
                                    <div className="service-buttons">
                                        <button
                                            className="button queue-button" // Added 'button' class
                                       
                                            onClick={() => handleViewQueue(service)}
                                        >
                                            View Queue
                                        </button>
                                        <button
                                            className="button consult-button" // Added 'button' class
                                            onClick={() => handleConsult(service)}
                                        >
                                            Consult
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>


            {/* Consultation Form Modal */}
            {isFormModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">Book Consultation for {selectedService?.name}</h2>
                        <form className="modal-form">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="age" className="form-label">Age</label>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleFormChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="number" className="form-label">Phone Number</label>
                                <input
                                    type="tel" // Use type="tel" for phone numbers
                                    id="number"
                                    name="number"
                                    value={formData.number}
                                    onChange={handleFormChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                             <div className="form-group">
                                <label htmlFor="concern" className="form-label">Concern</label>
                                <textarea
                                    id="concern"
                                    name="concern"
                                    value={formData.concern}
                                    onChange={handleFormChange}
                                    rows="3"
                                    className="form-input"
                                    required
                                ></textarea>
                            </div>
                            <div className="form-group checkbox-group">
                                <input
                                    type="checkbox"
                                    id="hasMedicalCard"
                                    name="hasMedicalCard"
                                    checked={formData.hasMedicalCard}
                                    onChange={handleFormChange}
                                    className="form-checkbox"
                                />
                                <label htmlFor="hasMedicalCard" className="checkbox-label">Have Medical Card?</label>
                            </div>

                            {formData.hasMedicalCard && (
                                <div className="medical-card-fields">
                                    <div className="form-group">
                                        <label htmlFor="medicalCardCompany" className="form-label">Medical Card Company</label>
                                        <input
                                            type="text"
                                            id="medicalCardCompany"
                                            name="medicalCardCompany"
                                            value={formData.medicalCardCompany}
                                            onChange={handleFormChange}
                                            className="form-input"
                                            required={formData.hasMedicalCard}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="medicalCardNumber" className="form-label">Card Number</label>
                                        <input
                                            type="text"
                                            id="medicalCardNumber"
                                            name="medicalCardNumber"
                                            value={formData.medicalCardNumber}
                                            onChange={handleFormChange}
                                            className="form-input"
                                            required={formData.hasMedicalCard}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="medicalCardName" className="form-label">Name on Card</label>
                                        <input
                                            type="text"
                                            id="medicalCardName"
                                            name="medicalCardName"
                                            value={formData.medicalCardName}
                                            onChange={handleFormChange}
                                            className="form-input"
                                            required={formData.hasMedicalCard}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="modal-buttons">
                                <button
                                    type="button"
                                    className="button cancel-button"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button" // Use type="button" to prevent default form submission
                                    className="button submit-button"
                                    onClick={handleSubmitBooking}
                                >
                                    Submit Booking
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

             {/* Queue Display Modal */}
            {isQueueModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content queue-modal-content">
                        <h2 className="modal-title">Queue for {selectedService?.name}</h2>
                        {currentQueue.length === 0 ? (
                            <p>No one in the queue yet.</p>
                        ) : (
                            <div className="queue-list">
                                <ul className="queue-items">
                                    {currentQueue.map((booking, index) => (
                                        <li key={index} className="queue-item">
                                            <p><span className="queue-item-label">Patient:</span> {booking.name}</p>
                                            <p><span className="queue-item-label">Age:</span> {booking.age}</p>
                                            <p><span className="queue-item-label">Concern:</span> {booking.concern}</p>
                                            {booking.hasMedicalCard && (
                                                <p className="queue-item-medical-card">
                                                    Medical Card: {booking.medicalCardCompany} ({booking.medicalCardNumber}) - {booking.medicalCardName}
                                                </p>
                                            )}
                                            <p className="queue-item-timestamp">Booked at: {new Date(booking.timestamp).toLocaleString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                         <div className="modal-buttons">
                             <button
                                type="button"
                                className="button cancel-button"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                         </div>
                    </div>
                </div>
            )}


            <BottomNavigation/>
        </div>
    );
}

export default HospitalPage;
