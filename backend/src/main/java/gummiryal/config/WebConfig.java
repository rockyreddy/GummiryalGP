package gummiryal.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {
  @Bean WebMvcConfigurer cors(@Value("${app.cors.origins}") String origins) {
    return new WebMvcConfigurer() {
      public void addCorsMappings(CorsRegistry r) {
        r.addMapping("/api/**").allowedOrigins(origins.split(",")).allowedMethods("GET", "POST", "PUT", "DELETE").allowedHeaders("*");
      }
    };
  }
}
