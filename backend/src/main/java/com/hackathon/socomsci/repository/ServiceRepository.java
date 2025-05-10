
package com.hackathon.socomsci.repository;

import com.hackathon.socomsci.model.*;
import org.springframework.data.jpa.repository.*;
import java.util.Optional;

public interface ServiceRepository extends JpaRepository<OfferedService, Long> {
    Optional<OfferedService> findByServiceId(String serviceId);
}