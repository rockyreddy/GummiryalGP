package gummiryal.controller;

import gummiryal.model.Complaint;
import gummiryal.model.Notice;
import gummiryal.model.AdminUser;
import gummiryal.repository.ComplaintRepo;
import gummiryal.repository.NoticeRepo;
import gummiryal.repository.AdminRepo;

import jakarta.validation.Valid;
import java.util.*;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
  private static final Set<String> STATUSES = Set.of("RECEIVED", "IN_PROGRESS", "RESOLVED");
  private final ComplaintRepo complaints;
  private final NoticeRepo notices;
  private final AdminRepo admins;
  private final PasswordEncoder enc;

  AdminController(ComplaintRepo c, NoticeRepo n, AdminRepo a, PasswordEncoder e) {
    complaints = c;
    notices = n;
    admins = a;
    enc = e;
  }

  @GetMapping("/me")
  Map<String, String> me(Authentication a) {
    return Map.of("username", a.getName()); }

  // Full complaint data (incl. reporter name/phone) is admin-only.
  @GetMapping("/complaints")
  List<Complaint> allComplaints() {
    return complaints.findAll(Sort.by(Sort.Direction.DESC, "id"));
  }

  @PutMapping("/complaints/{id}/status")
  Complaint setStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
    String s = body.get("status");
    if (!STATUSES.contains(s)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status");
    Complaint c = complaints.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    c.status = s;
    return complaints.save(c);
  }

  @PutMapping("/complaints/{id}/translation")
  Complaint setTranslation(@PathVariable Long id, @RequestBody Map<String, String> body) {
    Complaint c = complaints.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    String t = body.get("descriptionTe");
    c.descriptionTe = (t == null || t.isBlank()) ? null : t.trim();
    return complaints.save(c);
  }

  @DeleteMapping("/complaints/{id}")
  void deleteComplaint(@PathVariable Long id) {
    complaints.deleteById(id);
  }

  @PostMapping("/notices")
  Notice addNotice(@Valid @RequestBody Notice n) {
    n.id = null;
    return notices.save(n); }

  @PutMapping("/notices/{id}")
  Notice updateNotice(@PathVariable Long id, @Valid @RequestBody Notice n) {
    if (!notices.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    n.id = id;
    return notices.save(n);
  }

  @DeleteMapping("/notices/{id}")
  void deleteNotice(@PathVariable Long id) {
    notices.deleteById(id);
  }

  @PostMapping("/password")
  void changePassword(Authentication a, @RequestBody Map<String, String> body) {
    String p = body.get("newPassword");
    if (p == null || p.length() < 8) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 8 characters");
    AdminUser u = admins.findByUsername(a.getName()).orElseThrow();
    u.passwordHash = enc.encode(p);
    admins.save(u);
  }
}
