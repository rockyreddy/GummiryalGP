package gummiryal.model;

import jakarta.persistence.*;

@Entity
public class AdminUser {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  public Long id;

  @Column(unique = true)
  public String username;

  public String passwordHash;
}
