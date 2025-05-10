
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../HospitalPage.css'; 
import BottomNavigation from './BottomNavigation'; 
import { ArrowLeft, Search, MapPin, Phone, Clock, User, AlertCircle, CreditCard, X } from "lucide-react"; 
import { Link } from 'react-router-dom';



const BACKEND_API_URL = 'http://localhost:8080/api'; 

function HospitalPage() {
    const navigate = useNavigate();

    const [hospitals, setHospitals] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [services, setServices] = useState([]); 
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
                console.log("Fetched Hospitals Data:", data);
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
    }, [BACKEND_API_URL]); 

    
    useEffect(() => {
        if (selectedHospital) {
            const fetchServices = async () => {
                setIsLoadingServices(true);
                setServiceError(null);
                 setServices([]); 
                try {
                    
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
            setServices([]); 
        }
    }, [selectedHospital, BACKEND_API_URL]); 

    
    const handleSelectHospital = (hospital) => {
           setSelectedHospital(hospital);
           setSearchTerm(''); 
           window.scrollTo(0, 0);
    };

    const handleConsult = (service) => {
        if (!selectedHospital) {
            alert("Please select a hospital first.");
            return;
        }
        setSelectedServiceToBook(service);
        
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
        
        navigate(`/queue/${selectedHospital.hospitalId}/${service.serviceId}`);
    };

     const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    
    const handleSubmitBooking = async () => {
        if (!selectedHospital || !selectedServiceToBook) return; 

        
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
        
        const bookingDataToSend = {
            ...formData, 
            
            
            
        };

        
        
        const addBookingEndpoint = `${BACKEND_API_URL}/hospitals/${selectedHospital.hospitalId}/services/${selectedServiceToBook.serviceId}/bookings`;
        try {
            const response = await fetch(addBookingEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    
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
             
             alert("Booking submitted successfully! Urgency classified and queue updated.");
             navigate(`/queue/${selectedHospital.hospitalId}/${selectedServiceToBook.serviceId}`);


        } catch (error) {
            console.error("Error calling backend API:", error);
            alert(`Failed to connect to booking service: ${error.message}`);
        } finally {
            setIsSubmitting(false);
            
            setIsFormModalOpen(false);
            setFormData({
                name: '', age: '', phoneNumber: '', concern: '',
                hasMedicalCard: false, medicalCardCompany: '', medicalCardNumber: '', medicalCardName: '',
            });
            setSelectedServiceToBook(null);
        }
    };

    
    const closeModal = () => {
        setIsFormModalOpen(false);
        setFormData({
            name: '', age: '', phoneNumber: '', concern: '',
            hasMedicalCard: false, medicalCardCompany: '', medicalCardNumber: '', medicalCardName: '',
        });
        setSelectedServiceToBook(null);
    };

     const handleBackToHospitals = () => {
         setSelectedHospital(null); 
         setSearchTerm(''); 
         window.scrollTo(0, 0);
     };

    
    const filteredHospitals = hospitals.filter(hospital =>
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

     
     
    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className="hospital-container">
            {}
            {!selectedHospital ? (
                   <header className="search-header" style = {{position: 'absolute', zIndex: 1,
                    width: '100%'
                   }
                   }> {}
                       {}
                        {/* <div className="back-button" onClick={handleBackToPreviousPage}>
                           <ArrowLeft size={20} color="white" />
                        </div> */}
                       {}
                       <div className="back-arrow" 
          onClick={() => navigate("/home")} style={{ position: 'absolute', left: '1rem', marginRight: '2%' }}>
                           <ArrowLeft size={20} color="white" />
                        </div>
                        <div className="search-title" style = {{marginLeft: '10%'}}>Find Hospitals</div> {}
                        {}
                       {}
                   </header>
            ) : (
                
                   <header className="queue-header mt-6" style={{ position: 'absolute', zIndex: 1, width: '100%' }}>
                       {}
                        <div className="back-arrow" onClick={handleBackToHospitals} style={{ position: 'absolute', left: '1rem' }}>
                           <ArrowLeft size={20} color="white" />
                        </div>
                       <div style={{textAlign: 'center', flexGrow: 1}}>
                            <h1 style={{color: 'white', fontSize: '1.5rem', margin: 0}}>{selectedHospital.name}</h1>
                            {}
                            <p style={{color: 'white', fontSize: '0.9rem', margin: '5px 0 0 0'}}>{selectedHospital.location}</p>
                       </div>
                        {}
                       {}
                   </header>
            )}


            <div className="scrollable-content" style={{marginTop: selectedHospital ? '4rem' : '0rem'}}> {}
                 {!selectedHospital ? (
                     
                     <>
                         {}
                          <div className="hbanner" style={{backgroundImage: `url('https://j6n3r3q2.delivery.rocketcdn.me/wp-content/uploads/2020/11/ICU_1.jpg')`, height: '250px', marginTop : '2%' }}> {/* Generic Hospital Banner */}
                             <div className="banner-overlay"></div>
                             <div className="hbanner-content">
                                 <h1 className="banner-title">Find a Hospital</h1>
                                 <p className="banner-subtitle">Select a hospital to view services.</p>
                             </div>
                         </div>

                         {}
                         <div className="search-bar-container" style={{margin: '.5rem',   boxShadow: '0 2px 4px rgba(0, 0, 0, .1)', width: '100%', marginLeft: 0, marginTop: 0, borderRadius: 0, height: '10%'}}> {}
                             <Search className="icon search-icon"/> {}
                            <input
                            style = {{paddingLeft: '10%'}}
                                 type="text"
                                 placeholder="Search for hospitals..." 
                                className="search-input" 
                                 value={searchTerm}
                                 onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>


                         {}
                         <div className="search-results-list" style = {{paddingLeft: '3%', paddingRight: '3%'}}> {}
                             {isLoadingHospitals && <p style={{textAlign: 'center'}}>Loading hospitals...</p>}
                             {hospitalError && <p style={{textAlign: 'center', color: 'red'}}>Error loading hospitals: {hospitalError}</p>}
                              {!isLoadingHospitals && !hospitalError && filteredHospitals.length === 0 && (
                                  <p style={{textAlign: 'center'}}>No hospitals found matching your search.</p>
                              )}
                             {!isLoadingHospitals && !hospitalError && filteredHospitals.map(hospital => (
                                  <div key={hospital.id} className="search-result-item hospital-item" style = {{margin: 0}} onClick={() => handleSelectHospital(hospital)}> {}
                                      <div className="result-content"> {}
                                         <img src={hospital.imageUrl || 'https://via.placeholder.com/150'} alt={hospital.name} className="result-image" /> {/* Use result-image class */}
                                          <div className="result-details"> {}
                                              <h3 className="result-name" style = {{ width: '98%'}}>{hospital.name}
                                              {hospital.free && <span className="free-tag"> #FREE</span>}</h3> {}
                                              <p className="result-location">{hospital.location}</p> {}
                                         </div>
                                      </div>
                                      <ArrowLeft size={16} color="#6b7280" style={{transform: 'rotate(180deg)'}} /> {}
                                  </div>
                              ))}
                         </div>
                     </>
                 ) : (
                     
                     <>
                        {}
                        <div style={{position: 'relative'}}>
                            <img
                                src={selectedHospital.imageUrl || 'https://via.placeholder.com/500x250?text=Hospital'}
                                alt={`${selectedHospital.name} Image`}
                                className="hospital-detail-image" 
                                style={{
                                    width: '100%', 
                                    height: 'auto',
                                    maxHeight: '260px',
                                    objectFit: 'cover',
                                    display: 'block', 
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                                padding: '40px 16px 12px 16px',
                            }}>
                                <p style={{color: 'white', fontSize: '0.8rem', margin: 0}}>
                                    <Clock size={12} className="inline mr-1" /> Open: 24/7
                                </p>
                            </div>
                        </div>
                         {}
                         <div className="hsearch-bar"> {}
                            {}
                            {}
                            <Search className="icon search-icon" /> {}
                           <input
                                type="text"
                                placeholder={`Search services at ${selectedHospital.name}...`} 
                               className="search-input" 
                                value={searchTerm}
                                style = {{paddingLeft: '10%'}}
                                onChange={(e) => setSearchTerm(e.target.value)}
                           />
                       </div>

                         {}
                         <div className="service-list" id="services-section"> {}
                             {isLoadingServices && <p style={{textAlign: 'center'}}>Loading services...</p>}
                             {serviceError && <p style={{textAlign: 'center', color: 'red'}}>Error loading services: {serviceError}</p>}
                              {!isLoadingServices && !serviceError && filteredServices.length === 0 ? (
                                 <p style={{textAlign: 'center'}}>No services found matching your search or available at this hospital.</p>
                             ) : (
                                 !isLoadingServices && !serviceError && filteredServices.map(service => (
                                      <div key={service.id} className="service-card" style={{cursor: 'default'}}> {}
                                          <img src={service.imageUrl || 'https://via.placeholder.com/100'} alt={service.name} className="service-image" /> {/* Original service-image class */}
                                           <div className="service-details"> {}
                                               <div>
                                                    {}
                                                    <div className="service-rating">
                                                         <span className="star-icon">★</span>
                                                         <span className="rating-value">{service.rating?.toFixed(1) || 'N/A'}</span>
                                                         <h3 className="service-name">{service.name}</h3> {}
                                                    </div>
                                                    {}
                                                   <p className="service-description">{service.description}</p> {}
                                               </div>
                                                {}
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

            {}
            {isFormModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                         <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid #e0e0e0'}}>
                            <h2 style={{margin: 0, fontSize: '1.1rem', fontWeight: '600'}}>Book Consultation</h2>
                            <button 
                                onClick={closeModal} 
                                style={{background: 'none', border: 'none', cursor: 'pointer', padding: '4px'}}
                                aria-label="Close modal"
                            >
                                <X size={20} color="#555" />
                            </button>
                        </div>
                        
                        <div style={{padding: '12px 16px', backgroundColor: '#f8f8f8', borderBottom: '1px solid #e0e0e0'}}>
                            <p style={{margin: '0 0 4px 0', fontSize: '0.9rem', fontWeight: '500'}}>{selectedServiceToBook?.name}</p>
                            <p style={{margin: '0', fontSize: '0.8rem', color: '#666'}}>{selectedHospital?.name}</p>
                        </div>
                        
                        <form className="modal-form">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">
                                    <User size={14} className="inline mr-1" /> Full Name
                                </label>
                                <input type="text" id="name" name="name" value={formData.name} onChange={handleFormChange} className="form-input" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="age" className="form-label">Age</label>
                                <input type="number" id="age" name="age" value={formData.age} onChange={handleFormChange} className="form-input" required min="0" max="120" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phoneNumber" className="form-label">
                                    <Phone size={14} className="inline mr-1" /> Phone Number
                                </label>
                                <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleFormChange} className="form-input" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="concern" className="form-label">
                                    <AlertCircle size={14} className="inline mr-1" /> Concern / Symptoms
                                </label>
                                <textarea id="concern" name="concern" value={formData.concern} onChange={handleFormChange} rows="3" className="form-input" required></textarea>
                                <p style={{margin: '4px 0 0 0', fontSize: '0.8rem', color: '#666', fontStyle: 'italic'}}>
                                    Urgency will be determined by AI based on your symptoms
                                </p>
                            </div>

                            <div className="form-group checkbox-group">
                                <input type="checkbox" id="hasMedicalCard" name="hasMedicalCard" checked={formData.hasMedicalCard} onChange={handleFormChange} className="form-checkbox" />
                                <label htmlFor="hasMedicalCard" className="checkbox-label">
                                    <CreditCard size={14} className="inline mr-1" /> I have a medical card
                                </label>
                            </div>

                            {formData.hasMedicalCard && (
                                <div className="medical-card-fields">
                                    <p style={{fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500'}}>Medical Card Details</p>
                                    <div className="form-group">
                                        <label htmlFor="medicalCardCompany" className="form-label">Insurance Provider</label>
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
                                    {isSubmitting ? 'Processing...' : 'Submit Booking'}
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