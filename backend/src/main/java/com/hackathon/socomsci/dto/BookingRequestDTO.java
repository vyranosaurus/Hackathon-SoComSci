package com.hackathon.socomsci.dto;

public class BookingRequestDTO {
    private String name;
    private Integer age;
    private String phoneNumber;
    private String concern;
    private Boolean hasMedicalCard;
    private String medicalCardCompany;
    private String medicalCardNumber;
    private String medicalCardName;

    public BookingRequestDTO() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getConcern() { return concern; }
    public void setConcern(String concern) { this.concern = concern; }

    public Boolean getHasMedicalCard() { return hasMedicalCard; }
    public void setHasMedicalCard(Boolean hasMedicalCard) { this.hasMedicalCard = hasMedicalCard; }

    public String getMedicalCardCompany() { return medicalCardCompany; }
    public void setMedicalCardCompany(String medicalCardCompany) { this.medicalCardCompany = medicalCardCompany; }

    public String getMedicalCardNumber() { return medicalCardNumber; }
    public void setMedicalCardNumber(String medicalCardNumber) { this.medicalCardNumber = medicalCardNumber; }

    public String getMedicalCardName() { return medicalCardName; }
    public void setMedicalCardName(String medicalCardName) { this.medicalCardName = medicalCardName; }
}
