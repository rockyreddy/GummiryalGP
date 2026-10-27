package gummiryal.repository;

import gummiryal.model.AdminUser;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepo extends JpaRepository<AdminUser, Long> {
  Optional<AdminUser> findByUsername(String username);
}
