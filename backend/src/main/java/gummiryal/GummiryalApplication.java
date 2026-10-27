package gummiryal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/** Must stay in the root package: Spring scans this package and its sub-packages. */
@SpringBootApplication
public class GummiryalApplication {
  public static void main(String[] a) {
    SpringApplication.run(GummiryalApplication.class, a);
  }
}
