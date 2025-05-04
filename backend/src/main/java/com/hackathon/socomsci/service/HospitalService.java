package com.hackathon.socomsci.service;

import com.hackathon.socomsci.model.*;
import com.hackathon.socomsci.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service; // Import the @Service annotation

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service // This is the Spring @Service annotation
public class HospitalService {

    private final HospitalRepository hospitalRepository;
    // Correctly reference the repository type, not the model class
    private final ServiceRepository serviceRepository; // You might not need this injected here unless you use it
                                                       // elsewhere

    @Autowired
    // Include ServiceRepository if needed in this service, otherwise remove from
    // constructor
    public HospitalService(HospitalRepository hospitalRepository, ServiceRepository serviceRepository) {
        this.hospitalRepository = hospitalRepository;
        this.serviceRepository = serviceRepository; // Keep if used later, otherwise remove
    }

    // If you don't use serviceRepository in HospitalService, simplify the
    // constructor:
    /*
     * @Autowired
     * public HospitalService(HospitalRepository hospitalRepository) {
     * this.hospitalRepository = hospitalRepository;
     * this.serviceRepository = null; // Or remove the field
     * }
     */

    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    public Optional<Hospital> getHospitalByHospitalId(String hospitalId) {
        return hospitalRepository.findByHospitalId(hospitalId);
    }

    public Set<com.hackathon.socomsci.model.OfferedService> getServicesByHospitalId(String hospitalId) {
        Hospital hospital = hospitalRepository.findByHospitalId(hospitalId)
                .orElseThrow(() -> new RuntimeException("Hospital not found with ID: " + hospitalId));
        // Accessing getServices() here will trigger the fetch if it's Lazy loaded
        // Ensure the return type is the Set of your model.Service
        return hospital.getServices();
    }

    // Create a new hospital
    public Hospital createHospital(Hospital hospital) {
        // Make sure isFree field is included
        // If not explicitly set, it will default to false
        return hospitalRepository.save(hospital);
    }

    // Update an existing hospital
    public Hospital updateHospital(String hospitalId, Hospital hospitalDetails) {
        Hospital hospital = hospitalRepository.findByHospitalId(hospitalId)
                .orElseThrow(() -> new RuntimeException("Hospital not found with ID: " + hospitalId));
        
        hospital.setName(hospitalDetails.getName());
        hospital.setLocation(hospitalDetails.getLocation());
        hospital.setImageUrl(hospitalDetails.getImageUrl());
        
        // Update isFree status
        hospital.setFree(hospitalDetails.isFree());
        
        return hospitalRepository.save(hospital);
    }
    
    // Toggle isFree status for a hospital
    public Hospital toggleFreeStatus(String hospitalId) {
        Hospital hospital = hospitalRepository.findByHospitalId(hospitalId)
                .orElseThrow(() -> new RuntimeException("Hospital not found with ID: " + hospitalId));
        
        // Toggle the current status
        hospital.setFree(!hospital.isFree());
        
        return hospitalRepository.save(hospital);
    }
}
