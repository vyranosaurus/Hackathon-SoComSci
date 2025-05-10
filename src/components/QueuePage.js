import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import '../QueuePage.css';
import { ArrowLeft } from "lucide-react";
import { FaExclamationTriangle, FaCheckCircle, FaClock, FaCalendarAlt, FaUserMd, FaBrain, FaRobot, FaLightbulb, FaTimes } from 'react-icons/fa';
import BottomNavigation from './BottomNavigation';

const BACKEND_API_URL = 'http://localhost:8080/api';

const QueuePage = () => {
    const navigate = useNavigate();
    const { hospitalId, serviceId } = useParams();
    const [bookings, setBookings] = useState([]);
    const [hospitalName, setHospitalName] = useState('Loading Hospital...');
    const [serviceName, setServiceName] = useState('Loading Service...');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBookingForDetails, setSelectedBookingForDetails] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [timeDisplayMode, setTimeDisplayMode] = useState('booked');

    useEffect(() => {
        const fetchQueueData = async () => {
            setIsLoading(true);
            setError(null);
            setBookings([]);
            setHospitalName('Loading Hospital...');
            setServiceName('Loading Service...');

            console.log(`Workspaceing queue data for hospital: ${hospitalId}, service: ${serviceId}`);

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
                    setHospitalName(`Hospital (${hospitalId})`);
                    setServiceName(`Service (${serviceId})`);
                    return;
                }

                const data = await response.json();
                console.log("Queue data received from backend:", data);

                const processedData = data.map((booking, index) => {
                    const simulatedWaitTime = `${(index + 1) * 5 + Math.floor(Math.random() * 10)} mins`;
                    const generatedAiNotes = booking.aiNotes || `AI assessment: ${booking.urgency} case.`;

                    return {
                        ...booking,
                        waitTime: simulatedWaitTime,
                        urgency: booking.urgency || 'Not specified',
                        concern: booking.concern || 'No concern specified',
                        timestamp: booking.timestamp,
                        aiScore: booking.urgentPriorityScore != null ? booking.urgentPriorityScore : (booking.urgency === 'Critical' ? 90 : booking.urgency === 'Urgent' ? 70 : 40),
                        aiNotes: generatedAiNotes,
                        bookingType: booking.bookingType || 'Online Booking'
                    };
                });

                setBookings(processedData);

                if (processedData.length > 0 && processedData[0].hospital && processedData[0].service) {
                    setHospitalName(processedData[0].hospital.name);
                    setServiceName(processedData[0].service.name);
                } else {
                    const fetchNames = async () => {
                        try {
                             const hospitalRes = await fetch(`${BACKEND_API_URL}/hospitals/${hospitalId}`);
                             if(hospitalRes.ok) { const hData = await hospitalRes.json(); setHospitalName(hData.name); }
                             const serviceRes = await fetch(`${BACKEND_API_URL}/services/${serviceId}`);
                             if(serviceRes.ok) { const sData = await serviceRes.json(); setServiceName(sData.name); }
                        } catch (nameError) { console.error("Could not fetch hospital/service names:", nameError); }
                    };
                    fetchNames();
                }

            } catch (error) {
                console.error("Error fetching queue data from backend:", error);
                setError(`Failed to connect to queue service: ${error.message}`);
                setBookings([]);
                setHospitalName(`Hospital (${hospitalId})`);
                setServiceName(`Service (${serviceId})`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQueueData();
        const refreshInterval = setInterval(fetchQueueData, 30000);
        return () => clearInterval(refreshInterval);

    }, [hospitalId, serviceId, BACKEND_API_URL]);

    const getStatusFromUrgency = (urgency) => {
        switch (urgency) {
            case 'Critical':
                return 'Critical';
            case 'Urgent':
                return 'Critical';
            case 'Not urgent':
                return 'Normal';
            case 'Not specified':
                return 'Normal';
            default:
                return 'Normal';
        }
    };

    const toggleTimeDisplayMode = () => {
        setTimeDisplayMode(prev => prev === 'booked' ? 'wait' : 'booked');
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';
        try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            console.error("Error formatting timestamp:", timestamp, e);
            return 'Invalid Time';
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        try {
            const date = new Date(timestamp);
            return date.toLocaleDateString();
        } catch (e) {
            console.error("Error formatting date:", timestamp, e);
            return 'Invalid Date';
        }
    };

    const handleViewDetails = (booking) => {
        setSelectedBookingForDetails(booking);
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setSelectedBookingForDetails(null);
        setIsDetailModalOpen(false);
    };

    return (
        <div className="container hospital-container queue-page-container">
            <header className="queue-header mt-6">
                <div className="back-arrow" onClick={() => navigate(`/hospital`)} style = {{marginRight: '2%'}}>
                    <ArrowLeft size={20} color="white" />
                </div>
                <h1 style = {{color: 'white', width: '100%', margin: 0}}>{serviceName}</h1>
                <button
                    className="actionButton"
                    onClick={toggleTimeDisplayMode}
                    title={timeDisplayMode === 'booked' ? "Show estimated wait time" : "Show booked time"}
                    style={{marginLeft: '1rem', color: 'white', backgroundColor:'rgba(0, 0, 0, 0)', border: 'none'}}
                >
                    <FaClock />
                </button>
            </header>
            <div className="horizontal-line"></div>
            <div className="queue-list-container">
                {isLoading ? (
                    <div className="loadingContainer">
                        <div className="spinner"></div>
                    </div>
                ) : error ? (
                    <div className="emptyState">
                        <FaExclamationTriangle className="emptyStateIcon" style={{color: 'red'}} />
                        <p className="emptyStateMessage">Error loading queue.</p>
                        <p className="emptyStateHint">{error}</p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="emptyState">
                    </div>
                ) : (
                    <div className="patientsList">
                        {bookings.map((booking, index) => {
                            const status = getStatusFromUrgency(booking.urgency);
                            return (
                                <div key={booking.id || `${index}-${booking.timestamp}`} className={`patientCard ${status === 'Critical' ? 'criticalPatientCard' : ''}`}>
                                    <div className="patientHeader">
                                        <div className="patientInfo">
                                            <div className={`patientAvatar ${status === 'Critical' ? 'criticalAvatar' : ''}`}>
                                                P
                                                    {index + 1}
                                                
                                            </div>
                                            
                                            <div className="patientDetails">
                                                <h3 className="patientName">
                                                    Anonymous User
                                                    <span className={`statusBadge ${status === 'Critical' ? 'criticalBadge' : 'normalBadge'}`} style={{marginLeft: '0.5rem'}}>
                                                        {status === 'Critical' && <FaExclamationTriangle className="statusIcon" />}
                                                        {status === 'Normal' && <FaCheckCircle className="statusIcon" />}
                                                        {booking.urgency || 'Normal'}
                                                    </span>
                                                </h3>
                                                <p className="patientCondition">
                                                    {booking.concern}
                                                </p>
                                                {booking.aiScore != null && (
                                                    <div className="aiScoreContainer">
                                                        <div
                                                            className="aiScoreBar"
                                                            style={{ width: `${booking.aiScore}%` }}
                                                        ></div>
                                                        <span className="aiScoreLabel">
                                                             <FaRobot className="aiScoreIcon" />
                                                            {booking.aiScore}% Urgency
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="patientMeta">
                                            <span className="patientTime">
                                                {timeDisplayMode === 'wait' ? (
                                                    <>
                                                        <FaClock className="timeIcon" />
                                                        {booking.waitTime || 'N/A'} wait
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaCalendarAlt className="timeIcon" />
                                                        {formatTimestamp(booking.timestamp)}
                                                    </>
                                                )}
                                            </span>
                                            {booking.bookingType && (
                                                <span className="bookingType">
                                                    <FaUserMd className="bookingIcon" />
                                                    {booking.bookingType}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {booking.aiNotes && (
                                        <div className="aiNotesSection">
                                            <p className="aiNotes">
                                                <FaBrain className="aiNotesIcon" />
                                                <span>{booking.aiNotes}</span>
                                            </p>
                                        </div>
                                    )}
                                    <div className="patientFooter">
                                        <span className="patientId">ID: #{booking.id ? booking.id.toString().padStart(4, '0') : 'N/A'}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <div className="hmodal-overlay">
                {}
            {isDetailModalOpen && ( 
                <div className="hmodal-overlay"> {}
                    {}
                    {selectedBookingForDetails && (
                        <div className="modal-content"> {}
                            {}
                            <h2 className="modal-title">Booking Details</h2> {}
                            <button type="button" className="close-modal-button" onClick={closeDetailModal}> {}
                                <FaTimes /> {}
                            </button>

                            {}
                            <div className="modal-details-body"> {}
                                {}
                                <p><strong>Urgency:</strong> {selectedBookingForDetails.urgency || 'Not specified'}</p>

                                {}
                                {selectedBookingForDetails.timestamp && (
                                    <p><strong>Booked At:</strong> {formatTimestamp(selectedBookingForDetails.timestamp)} on {formatDate(selectedBookingForDetails.timestamp)}</p> 
                                )}

                                {}
                                <p><strong>Concern:</strong> {selectedBookingForDetails.concern || 'No concern specified'}</p>

                                {}
                                {selectedBookingForDetails.age && (
                                    <p><strong>Age:</strong> {selectedBookingForDetails.age} years</p>
                                )}

                                {}
                                {selectedBookingForDetails.bookingType && (
                                    <p><strong>Booking Type:</strong> {selectedBookingForDetails.bookingType}</p>
                                )}

                                {}
                                {selectedBookingForDetails.waitTime && (
                                    <p><strong>Estimated Wait:</strong> {selectedBookingForDetails.waitTime}</p>
                                )}


                                {}
                                {selectedBookingForDetails.aiScore != null && (
                                    <div>
                                        <p><strong>AI Urgency Score:</strong> {selectedBookingForDetails.aiScore}%</p>
                                        {}
                                    </div>
                                )}

                                {}
                                {selectedBookingForDetails.aiNotes && (
                                    <div>
                                        <p><strong>AI Analysis Notes:</strong></p>
                                        <p>{selectedBookingForDetails.aiNotes}</p>
                                    </div>
                                )}


                                {}
                                {selectedBookingForDetails.hasMedicalCard && (
                                    <div className="medical-card-details-modal"> {}
                                        <p><strong>Medical Card:</strong> Yes</p>
                                        {}
                                        {}
                                        {}
                                        {}
                                    </div>
                                )}

                            </div>


                            {}
                            <button type="button" className="button close-modal-button" onClick={closeDetailModal}>Close</button> {}
                        </div>
                    )} {}
                </div>
            )} {}
            {}
            </div>
            <BottomNavigation />
        </div>
    );
};

export default QueuePage;