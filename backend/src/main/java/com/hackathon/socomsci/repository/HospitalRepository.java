
package com.hackathon.socomsci.repository;

import com.hackathon.socomsci.model.*;
import org.springframework.data.jpa.repository.*;
import java.util.Optional;

public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    Optional<Hospital> findByHospitalId(String hospitalId);
}