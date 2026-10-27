package gummiryal.repository;

import gummiryal.model.Complaint;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplaintRepo extends JpaRepository<Complaint, Long> {
  Optional<Complaint> findByTicketNo(String ticketNo);
  List<Complaint> findTop20ByOrderByIdDesc();
  long countByStatus(String status);
}
