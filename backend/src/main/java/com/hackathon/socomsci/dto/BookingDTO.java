package com.hackathon.socomsci.dto;

import com.hackathon.socomsci.model.Booking;
import com.hackathon.socomsci.model.Hospital;
import com.hackathon.socomsci.model.OfferedService;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for Booking entity.
 * Avoids circular references during JSON serialization by using simplified DTOs
 * for nested Hospital and OfferedService objects.
 */
public class BookingDTO {
    private Long id;
    private String name;
    private Integer age;
    private String phoneNumber;
    private String concern;
    private String urgency;
    private Integer urgentPriorityScore;
    private LocalDateTime timestamp;
    private Boolean hasMedicalCard;
    private String medicalCardCompany;
    private String medicalCardNumber;
    private String medicalCardName;
    private LocalDateTime createdAt;
    
    // Simplified hospital information
    private String hospitalId;
    private String hospitalName;
    private String hospitalLocation;
    private String hospitalImageUrl;
    private Boolean hospitalIsFree;
    
    // Simplified service information
    private String serviceId;
    private String serviceName;
    private String serviceDescription;
    private Double serviceRating;
    private String serviceImageUrl;

    public BookingDTO() {
    }

    public BookingDTO(Booking booking) {
        this.id = booking.getId();
        this.name = booking.getName();
        this.age = booking.getAge();
        this.phoneNumber = booking.getPhoneNumber();
        this.concern = booking.getConcern();
        this.urgency = booking.getUrgency();
        this.urgentPriorityScore = booking.getUrgentPriorityScore();
        this.timestamp = booking.getTimestamp();
        this.hasMedicalCard = booking.getHasMedicalCard();
        this.medicalCardCompany = booking.getMedicalCardCompany();
        this.medicalCardNumber = booking.getMedicalCardNumber();
        this.medicalCardName = booking.getMedicalCardName();
        this.createdAt = booking.getCreatedAt();
        
        // Extract hospital data safely
        Hospital hospital = booking.getHospital();
        if (hospital != null) {
            this.hospitalId = hospital.getHospitalId();
            this.hospitalName = hospital.getName();
            this.hospitalLocation = hospital.getLocation();
            this.hospitalImageUrl = hospital.getImageUrl();
            this.hospitalIsFree = hospital.isFree();
        }
        
        // Extract service data safely
        OfferedService service = booking.getService();
        if (service != null) {
            this.serviceId = service.getServiceId();
            this.serviceName = service.getName();
            this.serviceDescription = service.getDescription();
            this.serviceRating = service.getRating();
            this.serviceImageUrl = service.getImageUrl();
        }
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getConcern() {
        return concern;
    }

    public void setConcern(String concern) {
        this.concern = concern;
    }

    public String getUrgency() {
        return urgency;
    }

    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }

    public Integer getUrgentPriorityScore() {
        return urgentPriorityScore;
    }

    public void setUrgentPriorityScore(Integer urgentPriorityScore) {
        this.urgentPriorityScore = urgentPriorityScore;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Boolean getHasMedicalCard() {
        return hasMedicalCard;
    }

    public void setHasMedicalCard(Boolean hasMedicalCard) {
        this.hasMedicalCard = hasMedicalCard;
    }

    public String getMedicalCardCompany() {
        return medicalCardCompany;
    }

    public void setMedicalCardCompany(String medicalCardCompany) {
        this.medicalCardCompany = medicalCardCompany;
    }

    public String getMedicalCardNumber() {
        return medicalCardNumber;
    }

    public void setMedicalCardNumber(String medicalCardNumber) {
        this.medicalCardNumber = medicalCardNumber;
    }

    public String getMedicalCardName() {
        return medicalCardName;
    }

    public void setMedicalCardName(String medicalCardName) {
        this.medicalCardName = medicalCardName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(String hospitalId) {
        this.hospitalId = hospitalId;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public String getHospitalLocation() {
        return hospitalLocation;
    }

    public void setHospitalLocation(String hospitalLocation) {
        this.hospitalLocation = hospitalLocation;
    }

    public String getHospitalImageUrl() {
        return hospitalImageUrl;
    }

    public void setHospitalImageUrl(String hospitalImageUrl) {
        this.hospitalImageUrl = hospitalImageUrl;
    }

    public Boolean getHospitalIsFree() {
        return hospitalIsFree;
    }

    public void setHospitalIsFree(Boolean hospitalIsFree) {
        this.hospitalIsFree = hospitalIsFree;
    }

    public String getServiceId() {
        return serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getServiceDescription() {
        return serviceDescription;
    }

    public void setServiceDescription(String serviceDescription) {
        this.serviceDescription = serviceDescription;
    }

    public Double getServiceRating() {
        return serviceRating;
    }

    public void setServiceRating(Double serviceRating) {
        this.serviceRating = serviceRating;
    }

    public String getServiceImageUrl() {
        return serviceImageUrl;
    }

    public void setServiceImageUrl(String serviceImageUrl) {
        this.serviceImageUrl = serviceImageUrl;
    }
}
