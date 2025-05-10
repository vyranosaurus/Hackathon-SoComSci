
package com.hackathon.socomsci.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "hospital_id_fk", nullable = false)
    private Hospital hospital;

    @ManyToOne
    @JoinColumn(name = "service_id_fk", nullable = false)
    private OfferedService service;
    @Column(nullable = false)
    private String name;

    private Integer age;
    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String concern;

    @Column(nullable = false)
    private String urgency = "Not specified";

    private Integer urgentPriorityScore;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    private Boolean hasMedicalCard;
    private String medicalCardCompany;
    private String medicalCardNumber;
    private String medicalCardName;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (this.timestamp == null) {
            this.timestamp = LocalDateTime.now();
        }

        if (this.urgency == null || this.urgency.isEmpty()) {
            this.urgency = "Not specified";
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Hospital getHospital() {
        return hospital;
    }

    public void setHospital(Hospital hospital) {
        this.hospital = hospital;
    }

    public OfferedService getService() {
        return service;
    }

    public void setService(OfferedService service) {
        this.service = service;
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
}