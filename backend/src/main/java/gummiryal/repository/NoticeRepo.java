package gummiryal.repository;

import gummiryal.model.Notice;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepo extends JpaRepository<Notice, Long> {
  List<Notice> findAllByOrderByDateDesc();
}
