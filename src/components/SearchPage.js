
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../SearchPage.css'; 
import BottomNavigation from './BottomNavigation'; 
import { FaArrowLeft, FaSearch, FaChevronRight, FaClock, FaHospital } from "react-icons/fa"; 
import { ArrowLeft, Search, MapPin, Phone, Clock, User, AlertCircle, CreditCard, X } from "lucide-react"; 
const BACKEND_API_URL = 'http://localhost:8080/api';

function SearchPage() {
    const navigate = useNavigate();
    
    const [hospitals, setHospitals] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoadingHospitals, setIsLoadingHospitals] = useState(true);
    const [isLoadingServices, setIsLoadingServices] = useState(false);
    const [hospitalError, setHospitalError] = useState(null);
    const [serviceError, setServiceError] = useState(null);

    
    const mockHospitals = [
        { 
            id: 1, 
            hospitalId: 1,
            name: "General Hospital",
            location: "123 Main St, City"
        },
        { 
            id: 2, 
            hospitalId: 2,
            name: "Community Medical Center",
            location: "456 Oak Ave, Town"
        },
        { 
            id: 3, 
            hospitalId: 3,
            name: "University Hospital",
            location: "789 Campus Dr, College"
        }
    ];

    
    const mockServices = [
        {
            id: 1,
            serviceId: 1,
            name: "Emergency Room",
            description: "24/7 emergency care services",
            queueSize: 12,
            estimatedWaitTime: "30-45"
        },
        {
            id: 2,
            serviceId: 2,
            name: "Cardiology",
            description: "Heart health and cardiovascular care",
            queueSize: 5,
            estimatedWaitTime: "15-20"
        },
        {
            id: 3,
            serviceId: 3,
            name: "Pediatrics",
            description: "Medical care for children and infants",
            queueSize: 3,
            estimatedWaitTime: "10-15"
        }
    ];

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
    };

    
    const handleBackToHospitals = () => {
        setSelectedHospital(null);
        setSearchTerm('');
    };

    
    const handleViewService = (service) => {
        if (!selectedHospital) return;
        navigate(`/queue/${selectedHospital.hospitalId}/${service.serviceId}`);
    };

    
    const filteredHospitals = hospitals.filter(hospital =>
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    
    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    
    const getCapacityLevel = (queueSize) => {
        if (queueSize < 5) return 'low';
        if (queueSize < 10) return 'medium';
        return 'high';
    };

    return (
        <div className="search-container">
            {}
            <header className="search-header">
                {selectedHospital && (
                    <div className="back-button" onClick={handleBackToHospitals}>
                        <FaArrowLeft size={16} />
                    </div>
                )}
                <h1 className="search-title" style= {{display: 'flex', width: '90%',}}>
        
                     
                    {selectedHospital ? `Services` : 'Check Queues'}
                </h1>
            </header>

            {}
            <div className="search-bar">
                <input
                    type="text"
                    className="search-input"
                    style = {{paddingLeft: '10%'
                    }}
                    placeholder={selectedHospital ? "Search services..." : "Search hospitals..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="search-icon" />
            </div>

            {}
            <div className="search-content">
                {!selectedHospital ? (
                    
                    <div className="search-results">
                        <h2 className="results-title">Available Hospitals</h2>
                        
                        {isLoadingHospitals && (
                            <div className="loading-message">Loading hospitals...</div>
                        )}
                        
                        {hospitalError && (
                            <div className="error-message">{hospitalError}</div>
                        )}
                        
                        {!isLoadingHospitals && !hospitalError && filteredHospitals.length === 0 && (
                            <div className="no-results">No hospitals found matching "{searchTerm}"</div>
                        )}
                        
                        {filteredHospitals.map(hospital => (
                            <div 
                                key={hospital.id} 
                                className="search-result-item hospital-item"
                                onClick={() => handleSelectHospital(hospital)}
                            >
                                <div className="result-content">
                                    <div className="result-image">
                                        <FaHospital size={20} />
                                    </div>
                                    <div className="result-details">
                                        <h3 className="result-name" style = {{width : '90%'}}>{hospital.name}{hospital.free && <span className="free-tag">#Free</span>}</h3>

                                        <p className="result-location">{hospital.location}</p>
                                    </div>
                                </div>
                                <FaChevronRight size={16} color="#8B0000" />
                            </div>
                        ))}
                    </div>
                ) : (
                    
                    <div className="search-results">
                        <h2 className="results-title">Services at {selectedHospital.name}</h2>
                        
                        {isLoadingServices && (
                            <div className="loading-message">Loading services...</div>
                        )}
                        
                        {serviceError && (
                            <div className="error-message">{serviceError}</div>
                        )}
                        
                        {!isLoadingServices && !serviceError && filteredServices.length === 0 && (
                            <div className="no-results">
                                {searchTerm ? 
                                    `No services found matching "${searchTerm}"` : 
                                    "No services available at this hospital"
                                }
                            </div>
                        )}
                        
                        {filteredServices.map(service => {
                            const capacityLevel = getCapacityLevel(service.queueSize || 0);
                            return (
                                <div 
                                    key={service.id} 
                                    className="search-result-item service-item"
                                    onClick={() => handleViewService(service)}
                                >
                                    <div className="result-content">
                                        <div className="result-image">
                                            {service.icon || service.name.charAt(0)}
                                        </div>
                                        <div className="result-details">
                                            <h3 className="result-name">{service.name}</h3>
                                            <p className="result-description">{service.description || "No description available"}</p>
                                            
                                            <div className="service-capacity">
                                                <div className="capacity-bar">
                                                    <div className={`capacity-fill capacity-${capacityLevel}`}></div>
                                                </div>
                                                <span className="capacity-text">
                                                    {capacityLevel === 'low' ? 'Low wait' : 
                                                    capacityLevel === 'medium' ? 'Medium wait' : 'High wait'}
                                                </span>
                                            </div>
                                            
                                            <div className="wait-time">
                                                <FaClock className="wait-time-icon" />
                                                {service.estimatedWaitTime || "15-30"} mins wait
                                            </div>
                                        </div>
                                    </div>
                                    <FaChevronRight size={16} color="#8B0000" />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <BottomNavigation />
        </div>
    );
}

export default SearchPage;