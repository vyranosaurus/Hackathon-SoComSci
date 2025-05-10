
package com.hackathon.socomsci.repository;

import com.hackathon.socomsci.model.*;
import org.springframework.data.jpa.repository.*;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByHospitalAndService(Hospital hospital, OfferedService service);
}
