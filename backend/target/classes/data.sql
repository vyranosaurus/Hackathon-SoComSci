-- Sample data for the Patient Queue application

-- Hospitals in the Philippines
INSERT INTO hospitals (hospital_id, name, location, image_url)
VALUES
('h001', 'Philippine General Hospital (PGH)', 'Taft Avenue, Ermita, Manila', 'https://example.com/images/pgh.jpg'),
('h002', 'St. Luke''s Medical Center', 'E. Rodriguez Sr. Ave, Quezon City', 'https://example.com/images/stlukes.jpg'),
('h003', 'Makati Medical Center', 'Amorsolo St, Makati City', 'https://example.com/images/makati.jpg'),
('h004', 'The Medical City', 'Ortigas Avenue, Pasig City', 'https://example.com/images/medicalcity.jpg'),
('h005', 'Cardinal Santos Medical Center', 'Wilson St, San Juan, Metro Manila', 'https://example.com/images/cardinalsantos.jpg'),
('h006', 'Asian Hospital and Medical Center', 'Civic Drive, Alabang, Muntinlupa', 'https://example.com/images/asian.jpg'),
('h007', 'Lung Center of the Philippines', 'Quezon Avenue, Quezon City', 'https://example.com/images/lungcenter.jpg'),
('h008', 'National Kidney and Transplant Institute', 'East Avenue, Quezon City', 'https://example.com/images/nkti.jpg');

-- Medical Services
INSERT INTO services (service_id, name, description, rating, image_url)
VALUES
('srv001', 'Emergency Department', 'Immediate medical care for critical and life-threatening conditions', 4.8, 'https://example.com/images/emergency.jpg'),
('srv002', 'General Medicine', 'Regular consultations and non-emergency healthcare', 4.5, 'https://example.com/images/medicine.jpg'),
('srv003', 'Cardiology', 'Diagnosis and treatment of heart disorders', 4.7, 'https://example.com/images/cardio.jpg'),
('srv004', 'Pediatrics', 'Healthcare services for infants, children and adolescents', 4.9, 'https://example.com/images/pedia.jpg'),
('srv005', 'Obstetrics & Gynecology', 'Care for women, including during pregnancy and childbirth', 4.6, 'https://example.com/images/obgyn.jpg'),
('srv006', 'Orthopedics', 'Treatment for musculoskeletal issues and injuries', 4.5, 'https://example.com/images/ortho.jpg'),
('srv007', 'Neurology', 'Diagnosis and treatment of nervous system disorders', 4.8, 'https://example.com/images/neuro.jpg'),
('srv008', 'Ophthalmology', 'Eye care and vision health services', 4.4, 'https://example.com/images/eye.jpg'),
('srv009', 'Dermatology', 'Skin health and treatment of skin conditions', 4.3, 'https://example.com/images/derm.jpg'),
('srv010', 'Diagnostic Imaging', 'X-rays, MRI, CT scans and other imaging services', 4.7, 'https://example.com/images/imaging.jpg');

-- Hospital-Service relationships
INSERT INTO hospital_services (hospital_id, service_id)
VALUES
-- PGH offers all services
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10),
-- St. Luke's offers all services
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8), (2, 9), (2, 10),
-- Makati Medical offers most services
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7), (3, 9),
-- The Medical City
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6), (4, 10),
-- Cardinal Santos 
(5, 1), (5, 2), (5, 3), (5, 6), (5, 10),
-- Asian Hospital
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 8),
-- Lung Center
(7, 1), (7, 2), (7, 10),
-- NKTI
(8, 1), (8, 2), (8, 10);

-- Sample Bookings
INSERT INTO bookings (hospital_id_fk, service_id_fk, name, age, phone_number, concern, urgency, urgent_priority_score, "timestamp", has_medical_card, created_at)
VALUES
-- Critical cases
(1, 1, 'Marco Santos', 45, '09171234567', 'Severe chest pain and difficulty breathing', 'Critical', NULL, NOW(), false, NOW()),
(2, 1, 'Elena Reyes', 78, '09189876543', 'Possible stroke, sudden facial drooping and confusion', 'Critical', NULL, NOW(), true, NOW()),

-- Urgent cases with priority scores
(3, 1, 'Ricardo Lim', 35, '09207654321', 'Deep laceration requiring stitches', 'Urgent', 8, NOW(), false, NOW()),
(4, 1, 'Maricel Cruz', 42, '09152345678', 'High fever (39.5°C) for 3 days with severe cough', 'Urgent', 7, NOW(), true, NOW()),
(5, 1, 'Gabriel Torres', 29, '09123456789', 'Suspected fracture after sports injury', 'Urgent', 6, NOW(), false, NOW()),
(2, 3, 'Sophia Mendoza', 55, '09187654321', 'Abnormal heart rhythm and shortness of breath', 'Urgent', 9, NOW(), true, NOW()),

-- Non-urgent cases
(6, 2, 'Miguel Bautista', 32, '09198765432', 'Persistent mild headache for the past week', 'Not urgent', NULL, NOW(), false, NOW()),
(1, 2, 'Isabella Garcia', 27, '09165432198', 'Annual physical examination', 'Not urgent', NULL, NOW(), true, NOW()),
(3, 9, 'Luis Villanueva', 19, '09123459876', 'Skin rash persisting for several days', 'Not urgent', NULL, NOW(), false, NOW()),

-- Not specified (will be determined by AI)
(4, 4, 'Camila Rodriguez', 7, '09187654329', 'Mild fever and stomach discomfort', 'Not specified', NULL, NOW(), true, NOW()),
(5, 6, 'Andres Reyes', 68, '09198763210', 'Joint pain in knees when walking', 'Not specified', NULL, NOW(), false, NOW());

-- Sample Users
INSERT INTO users (email, name)
VALUES
('admin@patientqueue.com', 'Admin User'),
('doctor@patientqueue.com', 'Doctor Account'),
('nurse@patientqueue.com', 'Nurse Account'); 