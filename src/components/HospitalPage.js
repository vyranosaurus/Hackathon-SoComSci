import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../HospitalPage.css'; // Assuming your CSS is here
import BottomNavigation from './BottomNavigation';

// !!! WARNING !!!
// STORING API KEYS DIRECTLY IN FRONTEND CODE IS EXTREMELY INSECURE.
// THIS IS FOR DEMONSTRATION PURPOSES ONLY.
// FOR A REAL APPLICATION, USE A BACKEND TO CALL THE GEMINI API.
const GEMINI_API_KEY = 'LAGAY NYO GEMINI KEY DITO'; // <--- REPLACE WITH YOUR ACTUAL API KEY
// !!! WARNING !!!

// Define a unique ID for this hospital.
const HOSPITAL_ID = 'pgh-manila';

// Helper function to get data from localStorage
const getQueueData = (hospitalId) => {
    const data = localStorage.getItem(`hospitalQueue_${hospitalId}`);
    try {
        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.error("Error parsing queue data from localStorage:", error);
        return {};
    }
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
        imageUrl: 'https://www.concilio.com/wp-content/uploads/cardiologie-concilio-votre-conciergerie-medicale_718x452.jpg?x44843'
    },
    {
        id: 'familymed',
        name: 'Family Med Doctor',
        rating: 4.9,
        description: 'Consult with a doctor for your general health needs. Physicians provide primary care for individuals and families of all ages.',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdG5w64b42a0Oo4yL1nNdAESYpt8N97Yylyg&s'
    },
    {
        id: 'rehab',
        name: 'Rehabilitation Doctor',
        rating: 4.8,
        description: 'Consult a specialist focused on restoring function and mobility. Rehab doctors treat conditions causing pain or limiting movement due to injury etc.',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE_n2KiII2j14bQI9dszr8MCFa9PexrCIGrg&s'
    },
];

// Async function to call Gemini API directly from frontend
// !!! WARNING: INSECURE PRACTICE FOR PRODUCTION / SENSITIVE DATA !!!
const classifyConcernWithGemini = async (concern) => {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
        console.error("Gemini API key is not set.");
        alert("Gemini API key is not configured.");
        return null; // Return null to indicate failure or missing key
    }
    if (!concern || concern.trim() === '') {
        console.warn("No concern provided for classification.");
        return 'Not specified'; // Or a default urgency if concern is empty
    }

    // The endpoint for Gemini API text generation
    // Ensure the model name is correct if you're using a different one
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-001:generateContent?key=${GEMINI_API_KEY}`; // Or gemini-1.0-pro, etc.

    // Prompt the model to classify into your exact categories
    const prompt = `Classify the following medical concern into one of these exact categories: 'Not urgent', 'Urgent', 'Critical'. Respond ONLY with the category name. Do not include any other text or punctuation. Concern: "${concern.trim()}"`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                // Optional: Add generation config for stricter output
                generationConfig: {
                     temperature: 0, // Aim for deterministic output
                     maxOutputTokens: 20 // Limit output length
                }
            }),
        });

        if (!response.ok) {
            const errorDetail = await response.json();
            console.error("Gemini API error:", response.status, errorDetail);
            const errorMessage = errorDetail.error ? errorDetail.error.message : 'Unknown API error';
            // Alert the user about the API failure
            alert(`Gemini API call failed: ${response.status} - ${errorMessage}. Booking will be marked as 'Not specified'.`);
            return 'Not specified'; // Return a default or error value if API fails
        }

        const data = await response.json();
        console.log("Gemini API Response:", data);

        // Attempt to extract the classification text
        const classificationText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (classificationText) {
            // Normalize the classification text to match your predefined categories
            const lowerCaseClassification = classificationText.toLowerCase();

             // Check for exact matches or clear inclusion
            if (lowerCaseClassification === 'critical') return 'Critical';
            if (lowerCaseClassification === 'urgent') return 'Urgent';
            if (lowerCaseClassification === 'not urgent') return 'Not urgent';

            // If the response doesn't exactly match, log a warning and return a default
            console.warn("Gemini returned unexpected classification format:", classificationText);
            alert(`AI returned unexpected classification "${classificationText}". Booking will be marked as 'Not specified'.`);
            return 'Not specified'; // Handle cases where the AI response is not one of your categories
        } else {
            // Handle cases where the response structure is not as expected
            console.warn("Gemini response did not contain expected text content structure.", data);
             alert("AI classification failed: Unexpected response format. Booking will be marked as 'Not specified'.");
            return 'Not specified';
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
         alert(`Failed to call Gemini API: ${error.message}. Booking will be marked as 'Not specified'.`);
        return 'Not specified'; // Return a default or error value if fetch fails
    }
};


function HospitalPage() {
    const navigate = useNavigate();

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        number: '',
        concern: '',
        // Removed urgency field from formData state
        hasMedicalCard: false,
        medicalCardCompany: '',
        medicalCardNumber: '',
        medicalCardName: '',
    });
    const [allQueueData, setAllQueueData] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [isClassifying, setIsClassifying] = useState(false);


    useEffect(() => {
        setAllQueueData(getQueueData(HOSPITAL_ID));
    }, []);

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleConsult = (service) => {
        setSelectedService(service);
         // Reset form data (urgency field is no longer in state)
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
        setIsFormModalOpen(true);
    };

    const handleViewQueue = (service) => {
        navigate(`/queue/${service.id}`);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    // Handle submitting the booking form AND trigger AI classification
    const handleSubmitBooking = async () => {
        if (!selectedService) return;

        // Basic form validation
        if (!formData.name || !formData.age || !formData.concern || !formData.number) {
             alert("Please fill in all required fields (Name, Age, Phone Number, Concern).");
             return;
        }

        setIsClassifying(true); // Start classifying indicator
        console.log("Initiating AI classification for concern:", formData.concern);

        // Call the AI classification function
        const aiClassifiedUrgency = await classifyConcernWithGemini(formData.concern);

        setIsClassifying(false); // End classifying indicator

        // Use the AI classification result for the booking urgency
        // If classification failed or returned null/undefined, use 'Not specified' or handle as an error
        const finalUrgency = aiClassifiedUrgency || 'Not specified'; // Default to 'Not specified' if AI fails


        // Create a new booking entry
        const newBooking = {
            ...formData, // Includes name, age, number, concern, medical card details
            hospitalId: HOSPITAL_ID, // Store the hospital ID
            serviceId: selectedService.id, // Store the service ID
            timestamp: new Date().toISOString(), // Add a timestamp
            urgency: finalUrgency, // <-- Set the urgency field using the AI classification
            // aiUrgency field is now redundant as it's the main urgency
        };

        // Update the queue data state and localStorage
        const updatedQueueData = { ...allQueueData };
        if (!updatedQueueData[selectedService.id]) {
            updatedQueueData[selectedService.id] = [];
        }
        updatedQueueData[selectedService.id].push(newBooking);

        setAllQueueData(updatedQueueData);
        saveQueueData(HOSPITAL_ID, updatedQueueData);
        console.log("Booking submitted with AI classified urgency:", finalUrgency, newBooking);

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

        // Optionally navigate to the queue page after booking
        // navigate(`/queue/${selectedService.id}`); // Uncomment if you want to auto-navigate
    };

    // Handle closing the modal
    const closeModal = () => {
        setIsFormModalOpen(false);
         // Reset form data when form modal closes
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
    };

    return (
        <div className="hospital-container">

            {/* Scrollable Content Area */}
            <div className="scrollable-content" style={{marginTop:'.5rem'}}>
             {/* Header Section */}
             <div className="header">
                 <div className="location-info">
                     <svg xmlns="http://www.w3.org/2000/svg" className="icon location-icon" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                     </svg>
                     <span1>Taft Ave, Ermita, Manila, 1000 Metro Manila</span1>
                 </div>
                 <div className="profile-picture"></div>
             </div>

             {/* Hospital Banner Section */}
             <div className="hbanner" style={{alignItems: 'center', justifyContent: 'center',width: '100%', margin:'0rem', height: '30%', backgroundImage: `url('https://i0.wp.com/up.edu.ph/wp-content/uploads/2020/03/20200323-Philippine-General-Hospital_0.jpg?fit=1398%2C1048&ssl=1')` }}>
                 <div className="banner-overlay" style ={{alignItems: 'center', justifyContent: 'center', inset: 0}}></div>
                 <div className="hbanner-content" style ={{alignItems: 'center', justifyContent: 'center', inset: 0}}>
                     <h1 className="banner-title">Philippine General Hospital</h1>
                     <p className="banner-subtitle">PGH: Healthcare for Every Filipino.</p>
                      <button className="book-now-button" type="button" onClick={() => alert('Select a service below to book!')}>
                          Book Now!
                      </button>
                 </div>
             </div>
             {/* Search Bar Section */}
             <div className="search-bar">
                 <svg xmlns="http://www.w3.org/2000/svg" className="icon menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                 </svg>
                 <input
                     type="text"
                     placeholder="Search for healthcare services..."
                     className="search-input"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                 />
                 <svg xmlns="http://www.w3.org/2000/svg" className="icon search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                 </svg>
             </div>

             {/* Service List Section */}
             <div className="service-list">
                 {filteredServices.length === 0 ? (
                     <p>No services found matching your search.</p>
                 ) : (
                     filteredServices.map(service => (
                         <div key={service.id} className="service-card">
                             <img src={service.imageUrl} alt={service.name} className="service-image" />
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
            </div> {/* Closing scrollable-content div */}


            {/* Consultation Form Modal */}
            {isFormModalOpen && (
                 <div className="modal-overlay">
                     <div className="modal-content">
                         <h2 className="modal-title">Book Consultation for {selectedService?.name}</h2>
                         <form className="modal-form">
                              {/* Removed Urgency Level Dropdown */}
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
                                       type="tel"
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
                                       disabled={isClassifying} // Disable cancel while classifying
                                   >
                                       Cancel
                                   </button>
                                   <button
                                        type="button"
                                        className="button submit-button"
                                        onClick={handleSubmitBooking}
                                        disabled={isClassifying} // Disable submit button while classifying
                                   >
                                        {isClassifying ? 'Classifying...' : 'Submit Booking'}
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