-- PostgreSQL schema
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS hospital_services;
DROP TABLE IF EXISTS hospitals;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS hospitals (
    id BIGSERIAL PRIMARY KEY,
    hospital_id VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    image_url VARCHAR(255),
    is_free BOOLEAN
);

CREATE TABLE IF NOT EXISTS services (
    id BIGSERIAL PRIMARY KEY,
    service_id VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    rating DOUBLE PRECISION,
    image_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS hospital_services (
    hospital_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    PRIMARY KEY (hospital_id, service_id),
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bookings (
    id BIGSERIAL PRIMARY KEY,
    hospital_id_fk BIGINT NOT NULL,
    service_id_fk BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    age INTEGER,
    phone_number VARCHAR(255) NOT NULL,
    concern TEXT NOT NULL,
    urgency VARCHAR(255) NOT NULL DEFAULT 'Not specified',
    urgent_priority_score INTEGER,
    "timestamp" TIMESTAMP NOT NULL,
    has_medical_card BOOLEAN,
    medical_card_company VARCHAR(255),
    medical_card_number VARCHAR(255),
    medical_card_name VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (hospital_id_fk) REFERENCES hospitals(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id_fk) REFERENCES services(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255),
    name VARCHAR(255)
); 