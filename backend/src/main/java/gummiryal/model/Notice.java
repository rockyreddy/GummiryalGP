package gummiryal.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Entity
public class Notice {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  public Long id;

  public String category;

  @NotBlank
  public String titleEn;

  @NotBlank
  public String titleTe;

  @Column(length = 2000)
  public String bodyEn;

  @Column(length = 2000)
  public String bodyTe;

  @NotNull
  public LocalDate date;

  public Notice() {
  }

  public Notice(String category, String titleEn, String titleTe, String bodyEn, String bodyTe, LocalDate date) {
    this.category = category;
    this.titleEn = titleEn;
    this.titleTe = titleTe;
    this.bodyEn = bodyEn;
    this.bodyTe = bodyTe;
    this.date = date;
  }
}
