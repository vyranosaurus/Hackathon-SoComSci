package com.hackathon.socomsci.service;

import com.hackathon.socomsci.model.*;
import com.hackathon.socomsci.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class HospitalService {

    private final HospitalRepository hospitalRepository;

    private final ServiceRepository serviceRepository;

    @Autowired

    public HospitalService(HospitalRepository hospitalRepository, ServiceRepository serviceRepository) {
        this.hospitalRepository = hospitalRepository;
        this.serviceRepository = serviceRepository;
    }

    /*
     * @Autowired
     * public HospitalService(HospitalRepository hospitalRepository) {
     * this.hospitalRepository = hospitalRepository;
     * this.serviceRepository = null;
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

        return hospital.getServices();
    }

    public Hospital createHospital(Hospital hospital) {

        return hospitalRepository.save(hospital);
    }

    public Hospital updateHospital(String hospitalId, Hospital hospitalDetails) {
        Hospital hospital = hospitalRepository.findByHospitalId(hospitalId)
                .orElseThrow(() -> new RuntimeException("Hospital not found with ID: " + hospitalId));

        hospital.setName(hospitalDetails.getName());
        hospital.setLocation(hospitalDetails.getLocation());
        hospital.setImageUrl(hospitalDetails.getImageUrl());

        hospital.setFree(hospitalDetails.isFree());

        return hospitalRepository.save(hospital);
    }

    public Hospital toggleFreeStatus(String hospitalId) {
        Hospital hospital = hospitalRepository.findByHospitalId(hospitalId)
                .orElseThrow(() -> new RuntimeException("Hospital not found with ID: " + hospitalId));

        hospital.setFree(!hospital.isFree());

        return hospitalRepository.save(hospital);
    }
}
