// SearchPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../SearchPage.css'; // Import the SearchPage CSS file
import BottomNavigation from './BottomNavigation'; // Import the BottomNavigation component
import { Search, ArrowLeft, ChevronRight } from "lucide-react"; // Import icons

// Backend API base URL - update this with your actual backend URL
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

    // Fetch hospitals when component mounts
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
    }, []);

    // Fetch services when a hospital is selected
    useEffect(() => {
        if (selectedHospital) {
            const fetchServices = async () => {
                setIsLoadingServices(true);
                setServiceError(null);
                setServices([]);
                try {
                    const response = await fetch(`${BACKEND_API_URL}/hospitals/${selectedHospital.hospitalId}`);
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
    }, [selectedHospital]);

    // Handle hospital selection
    const handleSelectHospital = (hospital) => {
        setSelectedHospital(hospital);
        setSearchTerm(''); // Reset search when changing hospitals
    };

    // Handle going back to hospital list
    const handleBackToHospitals = () => {
        setSelectedHospital(null);
        setSearchTerm('');
    };

    // Handle view service details - UPDATED to use the correct routing format
    const handleViewService = (service) => {
        if (!selectedHospital) return;
        // Updated to use the format: /queue/{hospitalId}/{serviceId}
        navigate(`/queue/${selectedHospital.hospitalId}/${service.serviceId}`);
    };

    // Filter hospitals based on search term
    const filteredHospitals = hospitals.filter(hospital =>
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter services based on search term
    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="search-container">
            {/* Header Section */}
            <header className="search-header">
                {selectedHospital && (
                    <div className="back-button" onClick={handleBackToHospitals}>
                        <ArrowLeft size={20} color="#f4f4f4" />
                    </div>
                )}
                <h1 className="search-title">
                    {selectedHospital ? `Search ${selectedHospital.name}` : 'Search Hospitals'}
                </h1>
            </header>

            {/* Search Bar - Added margin-top to fix z-overlap issue */}
            <div className="search-bar" style={{ marginTop: '20px' }}>
                <Search className="search-icon" size={20} color="#6b7280" />
                <input
                    type="text"
                    className="search-input"
                    placeholder={selectedHospital ? "Search services..." : "Search hospitals..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Main Content Area */}
            <div className="search-content">
                {!selectedHospital ? (
                    // Hospital Search Results
                    <div className="search-results">
                        <h2 className="results-title">Hospitals</h2>
                        
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
                                    <img 
                                        src={hospital.imageUrl || 'https://via.placeholder.com/80'} 
                                        alt={hospital.name} 
                                        className="result-image"
                                    />
                                    <div className="result-details">
                                        <h3 className="result-name">{hospital.name}</h3>
                                        <p className="result-location">{hospital.location}</p>
                                    </div>
                                </div>
                                <ChevronRight size={20} color="#6b7280" />
                            </div>
                        ))}
                    </div>
                ) : (
                    // Service Search Results for Selected Hospital
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
                        
                        {filteredServices.map(service => (
                            <div 
                                key={service.id} 
                                className="search-result-item service-item"
                                onClick={() => handleViewService(service)}
                            >
                                <div className="result-content">
                                    <img 
                                        src={service.imageUrl || 'https://via.placeholder.com/80'} 
                                        alt={service.name} 
                                        className="result-image"
                                    />
                                    <div className="result-details">
                                        <div className="service-rating">
                                            <span className="star-icon">★</span>
                                            <span className="rating-value">{service.rating?.toFixed(1) || 'N/A'}</span>
                                        </div>
                                        <h3 className="result-name">{service.name}</h3>
                                        <p className="result-description">{service.description}</p>
                                    </div>
                                </div>
                                <ChevronRight size={20} color="#6b7280" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <BottomNavigation />
        </div>
    );
}

export default SearchPage;