package gummiryal.controller;

import gummiryal.model.Complaint;
import gummiryal.model.Notice;
import gummiryal.repository.ComplaintRepo;
import gummiryal.repository.NoticeRepo;

import jakarta.validation.Valid;
import java.util.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ApiController {
  private final ComplaintRepo complaints;
  private final NoticeRepo notices;
  ApiController(ComplaintRepo c, NoticeRepo n) {
    complaints = c;
    notices = n;
  }

  /** Public view: never exposes reporter name or phone. */
  static Map<String, Object> pub(Complaint c) {
    Map<String, Object> m = new LinkedHashMap<>();
    m.put("ticketNo", c.ticketNo);
    m.put("category", c.category);
    m.put("description", c.description);
    m.put("descriptionTe", c.descriptionTe);
    m.put("ward", c.ward);
    m.put("status", c.status);
    m.put("createdAt", c.createdAt);
    return m;
  }

  @GetMapping("/complaints")
  List<Map<String, Object>> list() {
    return complaints.findTop20ByOrderByIdDesc().stream().map(ApiController::pub).toList();
  }

  @GetMapping("/complaints/{ticket}")
  ResponseEntity<Map<String, Object>> track(@PathVariable String ticket) {
    return complaints.findByTicketNo(ticket).map(c -> ResponseEntity.ok(pub(c))).orElse(ResponseEntity.notFound().build());
  }

  @PostMapping("/complaints")
  Map<String, Object> create(@Valid @RequestBody Complaint c) {
    c.id = null;
    c.status = "RECEIVED";
    c.descriptionTe = null;
    Complaint saved = complaints.save(c);
    saved.ticketNo = "GUM-" + saved.createdAt.getYear() + "-" + String.format("%04d", saved.id);
    return pub(complaints.save(saved));
  }

  @GetMapping("/notices")
  List<Notice> notices() {
    return notices.findAllByOrderByDateDesc();
  }

  @GetMapping("/stats")
  Map<String, Object> stats() {
    return Map.of("total", complaints.count(),
            "resolved", complaints.countByStatus("RESOLVED"),
            "notices", notices.count());
  }
}
