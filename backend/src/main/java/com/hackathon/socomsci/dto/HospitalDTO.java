package com.hackathon.socomsci.dto;

/**
 * Data Transfer Object for Hospital entity to avoid circular references
 * when serializing to JSON
 */
public class HospitalDTO {
    private Long id;
    private String hospitalId;
    private String name;
    private String location;
    private String imageUrl;
    private boolean isFree;
    
    // Basic constructor
    public HospitalDTO() {
    }
    
    // Constructor from entity
    public HospitalDTO(com.hackathon.socomsci.model.Hospital hospital) {
        this.id = hospital.getId();
        this.hospitalId = hospital.getHospitalId();
        this.name = hospital.getName();
        this.location = hospital.getLocation();
        this.imageUrl = hospital.getImageUrl();
        this.isFree = hospital.isFree();
    }
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getHospitalId() {
        return hospitalId;
    }
    
    public void setHospitalId(String hospitalId) {
        this.hospitalId = hospitalId;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public boolean isFree() {
        return isFree;
    }
    
    public void setFree(boolean isFree) {
        this.isFree = isFree;
    }
}
