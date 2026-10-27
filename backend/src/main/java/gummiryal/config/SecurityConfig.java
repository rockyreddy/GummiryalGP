package gummiryal.config;

import gummiryal.repository.AdminRepo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/** Stateless HTTP Basic (use HTTPS in production). Public: everything under /api except /api/admin/**. */
@Configuration
@EnableWebSecurity
class SecurityConfig {

  @Bean
  SecurityFilterChain chain(HttpSecurity http) throws Exception {
    http.csrf(AbstractHttpConfigurer::disable).cors(Customizer.withDefaults())
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(a -> a
            .requestMatchers("/error").permitAll()
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .requestMatchers("/api/**").permitAll()
            .anyRequest().denyAll())
        // 401 without WWW-Authenticate so browsers don't show their own login popup
        .httpBasic(b -> b.authenticationEntryPoint((req, res, e) -> res.setStatus(401)));
    return http.build();
  }

  @Bean
  PasswordEncoder encoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  UserDetailsService users(AdminRepo repo) {
    return name -> repo.findByUsername(name)
        .map(a -> User.withUsername(a.username).password(a.passwordHash).roles("ADMIN").build())
        .orElseThrow(() -> new UsernameNotFoundException(name));
  }
}
