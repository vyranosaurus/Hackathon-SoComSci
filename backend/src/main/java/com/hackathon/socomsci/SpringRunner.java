package com.hackathon.socomsci;

import com.hackathon.socomsci.repository.HospitalRepository;
import com.hackathon.socomsci.repository.ServiceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class SpringRunner {
    private static final Logger logger = LoggerFactory.getLogger(SpringRunner.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Bean
    @Profile("!test") // Don't run in test profile
    public CommandLineRunner databaseDebugger(HospitalRepository hospitalRepository, 
                                            ServiceRepository serviceRepository) {
        return args -> {
            try {
                logger.info("======= DATABASE INITIALIZATION DEBUG INFO =======");
                
                // Check if hospitals table exists and has data
                Integer hospitalCount = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM hospitals", Integer.class);
                logger.info("Hospital count in database: {}", hospitalCount);
                
                if (hospitalCount > 0) {
                    // Query for a specific hospital to check if it exists
                    jdbcTemplate.query(
                        "SELECT hospital_id, name FROM hospitals LIMIT 5", 
                        (rs, rowNum) -> String.format("Hospital ID: %s, Name: %s", 
                                                    rs.getString("hospital_id"), 
                                                    rs.getString("name")))
                        .forEach(hospital -> logger.info(hospital));
                }
                
                // Check services
                Integer serviceCount = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM services", Integer.class);
                logger.info("Service count in database: {}", serviceCount);
                
                // Check relationships
                Integer relationshipCount = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM hospital_services", Integer.class);
                logger.info("Hospital-service relationships count: {}", relationshipCount);
                
                if (relationshipCount > 0) {
                    // Fix: Use column aliases to avoid ambiguity
                    jdbcTemplate.query(
                        "SELECT h.hospital_id as h_id, h.name as h_name, " +
                        "s.service_id as s_id, s.name as s_name " +
                        "FROM hospitals h " +
                        "JOIN hospital_services hs ON h.id = hs.hospital_id " +
                        "JOIN services s ON s.id = hs.service_id " +
                        "LIMIT 5",
                        (rs, rowNum) -> String.format("Hospital ID: %s, Hospital Name: %s, Service ID: %s, Service Name: %s",
                                                rs.getString("h_id"),
                                                rs.getString("h_name"),
                                                rs.getString("s_id"),
                                                rs.getString("s_name")))
                        .forEach(rel -> logger.info(rel));
                }
                
                logger.info("==== End of database debug info ====");
            } catch (Exception e) {
                // Don't let database debugging issues crash the application
                logger.error("Error during database debugging: {}", e.getMessage());
                logger.info("==== Application will continue despite debug errors ====");
            }
        };
    }
}
