package com.hackathon.socomsci.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore; // Import JsonIgnore

@Entity
@Table(name = "hospitals")
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String hospitalId; // Use a friendly ID like 'pgh-manila'

    @Column(nullable = false)
    private String name;
    private String location;
    private String imageUrl; // Optional: For display purposes

    // Many-to-Many relationship with Service
    @ManyToMany
    @JoinTable(name = "hospital_services", // Join table name
            joinColumns = @JoinColumn(name = "hospital_id"), // Column in join table referencing Hospital
            inverseJoinColumns = @JoinColumn(name = "service_id") // Column in join table referencing Service
    )
    @JsonIgnore // Avoid infinite recursion when serializing Hospital -> Services -> Hospitals
    private Set<OfferedService> services = new HashSet<>();

    // --- Getters and Setters ---

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

    public Set<OfferedService> getServices() {
        return services;
    }

    public void setServices(Set<OfferedService> services) {
        this.services = services;
    }
}