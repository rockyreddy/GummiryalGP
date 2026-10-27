package gummiryal.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Entity
public class Complaint {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  public Long id;

  public String ticketNo;

  @NotBlank
  public String category;

  @NotBlank
  @Size(max = 1000)
  public String description;

  @Min(1) @Max(30)
  public int ward;

  @NotBlank
  public String name;

  public String phone;

  @Column(length = 1000)
  public String descriptionTe; // optional Telugu translation, set by admin

  public String status = "RECEIVED"; // RECEIVED -> IN_PROGRESS -> RESOLVED

  public LocalDate createdAt = LocalDate.now();
}
