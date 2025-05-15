package com.hackathon.socomsci.dto;

/**
 * Data Transfer Object for OfferedService entity to avoid circular references
 * when serializing to JSON
 */
public class OfferedServiceDTO {
    private Long id;
    private String serviceId;
    private String name;
    private String description;
    private Double rating;
    private String imageUrl;
    
    // Basic constructor
    public OfferedServiceDTO() {
    }
    
    // Constructor from entity
    public OfferedServiceDTO(com.hackathon.socomsci.model.OfferedService service) {
        this.id = service.getId();
        this.serviceId = service.getServiceId();
        this.name = service.getName();
        this.description = service.getDescription();
        this.rating = service.getRating();
        this.imageUrl = service.getImageUrl();
    }
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getServiceId() {
        return serviceId;
    }
    
    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Double getRating() {
        return rating;
    }
    
    public void setRating(Double rating) {
        this.rating = rating;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
