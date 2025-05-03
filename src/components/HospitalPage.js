// HospitalPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../HospitalPage.css'; // Make sure your CSS file is in the correct path
import BottomNavigation from './BottomNavigation'; // Assuming this component exists
import { ArrowLeft, Search, Menu } from "lucide-react"; // Import icons

// *** Define your backend API base URL ***
// !!! IMPORTANT: Update this with your actual backend URL and port !!!
const BACKEND_API_URL = 'http://localhost:8080/api'; // Default Spring Boot port

function HospitalPage() {
    const navigate = useNavigate();

    const [hospitals, setHospitals] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [services, setServices] = useState([]); // Services for the selected hospital
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedServiceToBook, setSelectedServiceToBook] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        phoneNumber: '',
        concern: '',
        hasMedicalCard: false,
        medicalCardCompany: '',
        medicalCardNumber: '',
        medicalCardName: '',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingHospitals, setIsLoadingHospitals] = useState(true);
    const [isLoadingServices, setIsLoadingServices] = useState(false);
    const [hospitalError, setHospitalError] = useState(null);
    const [serviceError, setServiceError] = useState(null);

    // Effect to fetch the list of hospitals when the component mounts
    useEffect(() => {
        const fetchHospitals = async () => {
            setIsLoadingHospitals(true);
            setHospitalError(null);
            try {
                const response = await fetch(`${BACKEND_API_URL}/hospitals`);

                if (!response.ok) {
                    const errorBody = await response.text();
                    let errorDetail = { message: `HTTP Error: ${response.status}` };
                    try {
                        errorDetail = JSON.parse(errorBody);
                    } catch (parseError) {
                         errorDetail.message = `HTTP Error: ${response.status} - ${errorBody}`;
                    }
                    console.error("Backend API Error (Hospitals):", response.status, errorDetail);
                    setHospitalError(`Failed to load hospitals: ${errorDetail.message || response.statusText}`);
                    setHospitals([]);
                    return;
                }
                const data = await response.json();
                setHospitals(data);
            } catch (error) {
                console.error("Error fetching hospitals:", error);
                setHospitalError(`Failed to connect to backend: ${error.message}`);
                 setHospitals([]);
            } finally {
                setIsLoadingHospitals(false);
            }
        };

        fetchHospitals();
    }, [BACKEND_API_URL]); // Add BACKEND_API_URL to dependencies

    // Effect to fetch services when a hospital is selected
    useEffect(() => {
        if (selectedHospital) {
            const fetchServices = async () => {
                setIsLoadingServices(true);
                setServiceError(null);
                 setServices([]); // Clear previous services
                try {
                    // Fetch services using the hospitalId from the selected hospital
                    const response = await fetch(`${BACKEND_API_URL}/hospitals/${selectedHospital.hospitalId}/services`);
                    if (!response.ok) {
                         const errorBody = await response.text();
                         let errorDetail = { message: `HTTP Error: ${response.status}` };
                         try {
                             errorDetail = JSON.parse(errorBody);
                         } catch (parseError) {
                             errorDetail.message = `HTTP Error: ${response.status} - ${errorBody}`;
                         }
                         console.error("Backend API Error (Services):", response.status, errorDetail);
                         setServiceError(`Failed to load services: ${errorDetail.message || response.statusText}`);
                         setServices([]);
                         return;
                    }
                    const data = await response.json();
                    setServices(data);
                } catch (error) {
                    console.error("Error fetching services:", error);
                    setServiceError(`Failed to connect to service list: ${error.message}`);
                     setServices([]);
                } finally {
                    setIsLoadingServices(false);
                }
            };

            fetchServices();
        } else {
            setServices([]); // Clear services if no hospital is selected
        }
    }, [selectedHospital, BACKEND_API_URL]); // Rerun when selectedHospital or BACKEND_API_URL changes

    // Handle selecting a hospital from the list
    const handleSelectHospital = (hospital) => {
         setSelectedHospital(hospital);
         // Optionally scroll to the services section after selecting a hospital
         // const servicesSection = document.getElementById('services-section');
         // if(servicesSection) servicesSection.scrollIntoView({ behavior: 'smooth' });
    };

    const handleConsult = (service) => {
        if (!selectedHospital) {
            alert("Please select a hospital first.");
            return;
        }
        setSelectedServiceToBook(service);
        // Reset form data for a new booking
        setFormData({
            name: '', age: '', phoneNumber: '', concern: '',
            hasMedicalCard: false, medicalCardCompany: '', medicalCardNumber: '', medicalCardName: '',
        });
        setIsFormModalOpen(true);
    };

    const handleViewQueue = (service) => {
        if (!selectedHospital) {
             alert("Please select a hospital first.");
             return;
         }
        // Navigate to the queue page, passing hospital and service IDs in the URL
        navigate(`/queue/${selectedHospital.hospitalId}/${service.serviceId}`);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    // Handle submitting the booking form and sending data to the backend
    const handleSubmitBooking = async () => {
        if (!selectedHospital || !selectedServiceToBook) return; // Should not happen if modal is opened correctly

        // Basic form validation
        if (!formData.name || !formData.age || !formData.concern || !formData.phoneNumber) {
            alert("Please fill in all required fields (Name, Age, Phone Number, Concern).");
            return;
        }
         if (formData.hasMedicalCard && (!formData.medicalCardCompany || !formData.medicalCardNumber || !formData.medicalCardName)) {
             alert("Please fill in all medical card details.");
             return;
         }


        setIsSubmitting(true);
        console.log("Submitting booking data to backend:", formData);
        // Prepare the booking data to send to the backend
        const bookingDataToSend = {
            ...formData, // Includes name, age, phoneNumber, concern, medical card details
            // Hospital and Service are linked on the backend using the IDs from the path
            // timestamp is set server-side, no need to send from client
            // urgency and urgentPriorityScore are set by AI on backend
        };

        // --- Call your backend API endpoint to add the booking ---
        // Use hospitalId and serviceId from the selected items in the URL path
        const addBookingEndpoint = `${BACKEND_API_URL}/hospitals/${selectedHospital.hospitalId}/services/${selectedServiceToBook.serviceId}/bookings`;
        try {
            const response = await fetch(addBookingEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Include any necessary authentication headers for your backend
                },
                body: JSON.stringify(bookingDataToSend),
            });

            if (!response.ok) {
                 const errorBody = await response.text();
                 let errorDetail = { message: `HTTP Error: ${response.status}` };
                 try {
                     errorDetail = JSON.parse(errorBody);
                 } catch (parseError) {
                      errorDetail.message = `HTTP Error: ${response.status} - ${errorBody}`;
                 }
                 console.error("Backend API Error (Booking):", response.status, errorDetail);
                 alert(`Failed to submit booking: ${errorDetail.message || response.statusText}`);
                 setIsSubmitting(false);
                 return;
            }

            const result = await response.json();
            console.log("Booking successfully submitted:", result);
             // Optionally, navigate to the queue page after successful booking
            alert("Booking submitted successfully! Urgency classified and queue updated.");
             navigate(`/queue/${selectedHospital.hospitalId}/${selectedServiceToBook.serviceId}`);


        } catch (error) {
            console.error("Error calling backend API:", error);
            alert(`Failed to connect to booking service: ${error.message}`);
        } finally {
            setIsSubmitting(false);
            // Close the modal and reset the form regardless of backend success/failure
            setIsFormModalOpen(false);
            setFormData({
                name: '', age: '', phoneNumber: '', concern: '',
                hasMedicalCard: false, medicalCardCompany: '', medicalCardNumber: '', medicalCardName: '',
            });
            setSelectedServiceToBook(null);
        }
    };

    // Handle closing the modal
    const closeModal = () => {
        setIsFormModalOpen(false);
        setFormData({
            name: '', age: '', phoneNumber: '', concern: '',
            hasMedicalCard: false, medicalCardCompany: '', medicalCardNumber: '', medicalCardName: '',
        });
        setSelectedServiceToBook(null);
    };

     const handleBackToHospitals = () => {
         setSelectedHospital(null); // Go back to hospital list view
         setSearchTerm(''); // Clear search when going back
     };

    // Filter services based on search term
    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="hospital-container">
            {/* Header Section (Conditionally rendered) */}
            {!selectedHospital ? (
                 <header className="header">
                     {/* You can add back arrow here if there was a previous page before hospital list */}
                     <div className="location-info">
                        {/* Assuming your location icon is used here */}
                         <svg className="icon location-icon" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                         <span>Your Location Info Here</span> {/* Update this */}
                     </div>
                     <div className="profile-picture"></div> {/* Add profile picture or icon */}
                 </header>
            ) : (
                // Header for hospital+service view
                 <header className="queue-header mt-6" style={{ position: 'relative' }}>
                    {/* Back button */}
                    <div className="back-arrow" onClick={handleBackToHospitals} style={{ position: 'absolute', left: '1rem' }}>
                       <ArrowLeft size={20} color="white" />
                    </div>
                    <div style={{textAlign: 'center', flexGrow: 1}}>
                         <h1 style={{color: 'white', fontSize: '1.5rem', margin: 0}}>{selectedHospital.name}</h1>
                         {/* Location below name for clarity */}
                         <p style={{color: 'white', fontSize: '0.9rem', margin: '5px 0 0 0'}}>{selectedHospital.location}</p>
                    </div>
                </header>
            )}


            <div className="scrollable-content" style={{marginTop: selectedHospital ? '0rem' : '.5rem'}}> {/* Adjust margin based on header */}
                 {!selectedHospital ? (
                     // --- Display List of Hospitals ---
                     <>
                        {/* Hospital List Banner */}
                         <div className="hbanner" style={{backgroundImage: `url('https://images.unsplash.com/photo-1586096041783-d24933255a36?fit=crop&w=1000&q=80')` }}> {/* Generic Hospital Banner */}
                            <div className="banner-overlay"></div>
                            <div className="hbanner-content">
                                <h1 className="banner-title">Find a Hospital</h1>
                                <p className="banner-subtitle">Select a hospital to view services.</p>
                                {/* Book Now button is less relevant here */}
                            </div>
                        </div>

                        {/* Optional: Search bar for hospitals could go here */}
                        <div className="search-bar" style={{justifyContent: 'center', boxShadow: 'none'}}>
                             <p style={{margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#333'}}>Available Hospitals</p>
                         </div>


                        <div className="service-list"> {/* Reusing service-list class for hospital list styling */}
                             {isLoadingHospitals && <p style={{textAlign: 'center'}}>Loading hospitals...</p>}
                             {hospitalError && <p style={{textAlign: 'center', color: 'red'}}>Error loading hospitals: {hospitalError}</p>}
                             {!isLoadingHospitals && !hospitalError && hospitals.length === 0 && (
                                 <p style={{textAlign: 'center'}}>No hospitals available.</p>
                            )}
                             {hospitals.map(hospital => (
                                 <div key={hospital.id} className="service-card" onClick={() => handleSelectHospital(hospital)} style={{cursor: 'pointer'}}> {/* Use service-card for styling, make clickable */}
                                    <img src={hospital.imageUrl || 'https://via.placeholder.com/150'} alt={hospital.name} className="service-image" />
                                     <div className="service-details">
                                         <div>
                                            <h3 className="service-name">{hospital.name}</h3>
                                             <p className="service-description">{hospital.location}</p>
                                         </div>
                                         <div className="service-buttons" style={{justifyContent: 'flex-start'}}> {/* Adjust button alignment */}
                                             {/* Use handleSelectHospital to view services when clicking the button */}
                                             <button className="button consult-button" type="button" onClick={(e) => { e.stopPropagation(); handleSelectHospital(hospital); }}> {/* Prevent card click when button clicked */}
                                                 View Services
                                             </button>
                                         </div>
                                     </div>
                                 </div>
                             ))}
                         </div>
                    </>
                 ) : (
                     // --- Display Services for Selected Hospital ---
                     <>

                     <img
                                src={selectedHospital.imageUrl}
                                alt={`${selectedHospital.name} Image`}
                                className="hospital-detail-image" // Add a class for styling
                                style={{
                                    maxWidth: '100%', // Make image responsive
                                    height: 'auto',
                                    display: 'block', // Center the image
                                }}
                            />
                       <div className="horizontal-line"></div> {/* Visual separator */}

                       <div className="search-bar">
                           {/* Assuming menu icon was for a side drawer, if not needed remove */}
                            {/* <Menu className="icon menu-icon" /> */}
                            <Search className="icon search-icon" /> {/* Use search icon */}
                           <input
                               type="text"
                               placeholder={`Search services at ${selectedHospital.name}...`} // More specific placeholder
                               className="search-input"
                               value={searchTerm}
                               onChange={(e) => setSearchTerm(e.target.value)}
                           />
                       </div>

                         <div className="service-list" id="services-section"> {/* Services List for selected hospital */}
                             {isLoadingServices && <p style={{textAlign: 'center'}}>Loading services...</p>}
                             {serviceError && <p style={{textAlign: 'center', color: 'red'}}>Error loading services: {serviceError}</p>}
                              {!isLoadingServices && !serviceError && filteredServices.length === 0 ? (
                                <p style={{textAlign: 'center'}}>No services found matching your search or available at this hospital.</p>
                             ) : (
                                !isLoadingServices && !serviceError && filteredServices.map(service => (
                                     <div key={service.id} className="service-card" style={{cursor: 'default'}}> {/* Remove card cursor */}
                                         <img src={service.imageUrl || 'https://via.placeholder.com/100'} alt={service.name} className="service-image" />
                                         <div className="service-details">
                                             <div>
                                                 {/* Rating and Name */}
                                                 <div className="service-rating">
                                                    <span className="star-icon">★</span>
                                                     <span className="rating-value">{service.rating?.toFixed(1) || 'N/A'}</span>
                                                     <h3 className="service-name">{service.name}</h3>
                                                 </div>
                                                 {/* Description */}
                                                <p className="service-description">{service.description}</p>
                                             </div>
                                            {/* Buttons */}
                                             <div className="service-buttons">
                                                 <button
                                                    className="button queue-button"
                                                    type="button"
                                                     onClick={() => handleViewQueue(service)}
                                                  >
                                                     View Queue
                                                 </button>
                                                 <button
                                                      className="button consult-button"
                                                      type="button"
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
                       </>
                 )}
            </div>

            {/* Booking Modal (remains similar, but uses selectedServiceToBook and selectedHospital) */}
            {isFormModalOpen && (
                 <div className="modal-overlay">
                    <div className="modal-content">
                         <h2 className="modal-title">Book Consultation for {selectedServiceToBook?.name} at {selectedHospital?.name}</h2>
                         <form className="modal-form">
                            <div className="form-group">
                                  <label htmlFor="name" className="form-label">Name</label>
                                  <input type="text" id="name" name="name" value={formData.name} onChange={handleFormChange} className="form-input" required />
                            </div>
                              <div className="form-group">
                                  <label htmlFor="age" className="form-label">Age</label>
                                <input type="number" id="age" name="age" value={formData.age} onChange={handleFormChange} className="form-input" required min="0" max="120" /> {/* Added min/max */}
                              </div>
                              <div className="form-group">
                                <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                                  <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleFormChange} className="form-input" required />
                              </div>
                                <div className="form-group">
                                   <label htmlFor="concern" className="form-label">Concern / Reason for Visit</label> {/* More descriptive label */}
                                   <textarea id="concern" name="concern" value={formData.concern} onChange={handleFormChange} rows="3" className="form-input" required ></textarea>
                                    <p className="text-sm text-gray-600 mt-1 mb-2">
                                        (Urgency and queue position will be determined by AI upon submission)
                                    </p>
                               </div>

                                <div className="form-group checkbox-group">
                                    <input type="checkbox" id="hasMedicalCard" name="hasMedicalCard" checked={formData.hasMedicalCard} onChange={handleFormChange} className="form-checkbox" />
                                   <label htmlFor="hasMedicalCard" className="checkbox-label">Have Medical Card?</label>
                            </div>

                               {formData.hasMedicalCard && (
                                   <div className="medical-card-fields">
                                        <p style={{fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold'}}>Medical Card Details:</p> {/* Added title */}
                                        <div className="form-group">
                                           <label htmlFor="medicalCardCompany" className="form-label">Medical Card Company</label>
                                            <input type="text" id="medicalCardCompany" name="medicalCardCompany" value={formData.medicalCardCompany} onChange={handleFormChange} className="form-input" required={formData.hasMedicalCard} />
                                       </div>
                                       <div className="form-group">
                                            <label htmlFor="medicalCardNumber" className="form-label">Card Number</label>
                                            <input type="text" id="medicalCardNumber" name="medicalCardNumber" value={formData.medicalCardNumber} onChange={handleFormChange} className="form-input" required={formData.hasMedicalCard} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="medicalCardName" className="form-label">Name on Card</label>
                                           <input type="text" id="medicalCardName" name="medicalCardName" value={formData.medicalCardName} onChange={handleFormChange} className="form-input" required={formData.hasMedicalCard} />
                                        </div>
                                   </div>
                                )}

                            <div className="modal-buttons">
                                  <button type="button" className="button cancel-button" onClick={closeModal} disabled={isSubmitting}>Cancel</button>
                                   <button type="button" className="button submit-button" onClick={handleSubmitBooking} disabled={isSubmitting}>
                                        {isSubmitting ? 'Submitting...' : 'Submit Booking'}
                                   </button>
                              </div>
                         </form>
                       </div>
                 </div>
             )}
          <BottomNavigation/>
        </div>
    );
}

export default HospitalPage;