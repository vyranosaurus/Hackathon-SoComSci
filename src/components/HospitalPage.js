import React, { useState, useEffect } from 'react';
// Assuming BottomNavigation.js is a separate component you will provide
// import BottomNavigation from './BottomNavigation'; // Placeholder import

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
        imageUrl: 'https://placehold.co/150x100/FF5733/FFFFFF?text=Cardiology'
    },
    {
        id: 'familymed',
        name: 'Family Med Doctor',
        rating: 4.9,
        description: 'Consult with a doctor for your general health needs. Physicians provide primary care for individuals and families of all ages.',
        // Placeholder image - replace with actual image URL or component
        imageUrl: 'https://placehold.co/150x100/33FF57/FFFFFF?text=Family+Med'
    },
    {
        id: 'rehab',
        name: 'Rehabilitation Doctor',
        rating: 4.8,
        description: 'Consult a specialist focused on restoring function and mobility. Rehab doctors treat conditions causing pain or limiting movement due to injury etc.',
        // Placeholder image - replace with actual image URL or component
        imageUrl: 'https://placehold.co/150x100/3357FF/FFFFFF?text=Rehab'
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

    // Load queue data from localStorage when the component mounts
    useEffect(() => {
        setAllQueueData(getQueueData(HOSPITAL_ID));
    }, []);

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
        <div className="mx-auto max-w-md h-screen flex flex-col bg-gray-100 overflow-hidden">
            {/* Header Section (Placeholder) */}
            <div className="p-4 bg-white shadow-md flex items-center justify-between">
                <div className="flex items-center">
                    {/* Location Icon Placeholder */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>123 Anywhere St., Any City</span>
                    {/* Dropdown Icon Placeholder */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                {/* Profile Picture Placeholder */}
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>

            {/* Hospital Banner Section (Placeholder) */}
            <div className="relative h-40 bg-cover bg-center" style={{ backgroundImage: `url('https://placehold.co/500x200/007BFF/FFFFFF?text=Philippine+General+Hospital')` }}>
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                    <h1 className="text-2xl font-bold text-center">Philippine General Hospital</h1>
                    <p className="text-sm mt-1">PGH: Healthcare for Every Filipino.</p>
                    <button className="mt-4 px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700">
                        Book Now!
                    </button>
                </div>
            </div>

            {/* Search Bar Section (Placeholder) */}
            <div className="p-4 bg-white shadow-md flex items-center">
                {/* Menu Icon Placeholder */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <input
                    type="text"
                    placeholder="Search for healthcare services..."
                    className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* Search Icon Placeholder */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            {/* Scrollable Service List Section */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {services.map(service => (
                    <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden flex">
                        {/* Service Image */}
                        <img src={service.imageUrl} alt={service.name} className="w-1/3 object-cover" />
                        {/* Service Details and Buttons */}
                        <div className="w-2/3 p-4 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center mb-2">
                                    <span className="text-yellow-500 mr-1">★</span>
                                    <span className="font-bold text-lg">{service.rating}</span>
                                    <h3 className="text-xl font-semibold ml-2">{service.name}</h3>
                                </div>
                                <p className="text-gray-600 text-sm">{service.description}</p>
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700"
                                    onClick={() => handleViewQueue(service)}
                                >
                                    VIEW QUEUE
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700"
                                    onClick={() => handleConsult(service)}
                                >
                                    CONSULT
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Consultation Form Modal */}
            {isFormModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                        <h2 className="text-xl font-bold mb-4">Book Consultation for {selectedService?.name}</h2>
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleFormChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="number" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="tel" // Use type="tel" for phone numbers
                                    id="number"
                                    name="number"
                                    value={formData.number}
                                    onChange={handleFormChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                             <div>
                                <label htmlFor="concern" className="block text-sm font-medium text-gray-700">Concern</label>
                                <textarea
                                    id="concern"
                                    name="concern"
                                    value={formData.concern}
                                    onChange={handleFormChange}
                                    rows="3"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                ></textarea>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="hasMedicalCard"
                                    name="hasMedicalCard"
                                    checked={formData.hasMedicalCard}
                                    onChange={handleFormChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="hasMedicalCard" className="ml-2 block text-sm text-gray-900">Have Medical Card?</label>
                            </div>

                            {formData.hasMedicalCard && (
                                <div className="space-y-4 bg-gray-50 p-4 rounded-md">
                                    <div>
                                        <label htmlFor="medicalCardCompany" className="block text-sm font-medium text-gray-700">Medical Card Company</label>
                                        <input
                                            type="text"
                                            id="medicalCardCompany"
                                            name="medicalCardCompany"
                                            value={formData.medicalCardCompany}
                                            onChange={handleFormChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            required={formData.hasMedicalCard}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="medicalCardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
                                        <input
                                            type="text"
                                            id="medicalCardNumber"
                                            name="medicalCardNumber"
                                            value={formData.medicalCardNumber}
                                            onChange={handleFormChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            required={formData.hasMedicalCard}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="medicalCardName" className="block text-sm font-medium text-gray-700">Name on Card</label>
                                        <input
                                            type="text"
                                            id="medicalCardName"
                                            name="medicalCardName"
                                            value={formData.medicalCardName}
                                            onChange={handleFormChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            required={formData.hasMedicalCard}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button" // Use type="button" to prevent default form submission
                                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm max-h-[80vh] flex flex-col">
                        <h2 className="text-xl font-bold mb-4">Queue for {selectedService?.name}</h2>
                        {currentQueue.length === 0 ? (
                            <p>No one in the queue yet.</p>
                        ) : (
                            <div className="overflow-y-auto flex-grow">
                                <ul className="divide-y divide-gray-200">
                                    {currentQueue.map((booking, index) => (
                                        <li key={index} className="py-4">
                                            <p><span className="font-semibold">Patient:</span> {booking.name}</p>
                                            <p><span className="font-semibold">Age:</span> {booking.age}</p>
                                            <p><span className="font-semibold">Concern:</span> {booking.concern}</p>
                                            {booking.hasMedicalCard && (
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Medical Card: {booking.medicalCardCompany} ({booking.medicalCardNumber}) - {booking.medicalCardName}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-1">Booked at: {new Date(booking.timestamp).toLocaleString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                         <div className="flex justify-end mt-6">
                             <button
                                type="button"
                                className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                         </div>
                    </div>
                </div>
            )}


            {/* Bottom Navigation Placeholder - Styled to be fixed at the bottom */}
            {/* You would replace this with your actual BottomNavigation component */}
            <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-md bg-white shadow-lg h-14 flex items-center justify-around border-t border-gray-200">
                 {/* Placeholder Icons/Links */}
                 <div className="text-center text-xs text-blue-600">
                     {/* Icon Placeholder */}
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l7 7m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home
                 </div>
                 <div className="text-center text-xs text-gray-500">
                     {/* Icon Placeholder */}
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Bookings
                 </div>
                 <div className="text-center text-xs text-gray-500">
                     {/* Icon Placeholder */}
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                 </div>
            </div>
        </div>
    );
}

export default HospitalPage;
