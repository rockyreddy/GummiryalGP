package gummiryal.config;

import java.time.LocalDate;
import gummiryal.model.AdminUser;
import gummiryal.model.Complaint;
import gummiryal.model.Notice;
import gummiryal.repository.AdminRepo;
import gummiryal.repository.ComplaintRepo;
import gummiryal.repository.NoticeRepo;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/** Creates the first admin account and sample data when the database is empty. */
@Configuration
public class DataSeeder {

  @Bean
  CommandLineRunner seed(ComplaintRepo c, NoticeRepo n, AdminRepo admins, PasswordEncoder enc,
      @Value("${app.admin.username}") String adminUser, @Value("${app.admin.password}") String adminPass) {
    return x -> {
      if (admins.count() == 0) {
        AdminUser u = new AdminUser();
        u.username = adminUser;
        u.passwordHash = enc.encode(adminPass);
        admins.save(u);
        if ("ChangeMe@123".equals(adminPass))
          LoggerFactory.getLogger("seed").warn("Default admin password in use. Set ADMIN_PASSWORD or change it in the Account tab.");
      }
      if (n.count() == 0) {
        n.save(new Notice("Gram Sabha", "Monthly Gram Sabha meeting", "గ్రామ సభ నోటీసు",
            "All villagers are invited to the Gram Sabha at the Panchayat office. (Sample text)",
            "గ్రామస్థులందరూ గ్రామ పంచాయతీ కార్యాలయంలో జరిగే గ్రామ సభకు హాజరు కావాలని కోరడమైనది. (నమూనా వచనం)", LocalDate.now().plusDays(10)));
        n.save(new Notice("Tax", "Property tax payment notice", "ఆస్తి పన్ను చెల్లింపు నోటీసు",
            "Please pay house and water tax before the deadline. (Sample text)",
            "ఇంటి పన్ను మరియు నీటి పన్నును గడువులోగా చెల్లించాలని కోరడమైనది. (నమూనా వచనం)", LocalDate.now().minusDays(20)));
        n.save(new Notice("Tender", "Village road construction tender", "గ్రామ రోడ్డు నిర్మాణ టెండర్ నోటీసు",
            "Eligible contractors may submit bids. (Sample text)",
            "అర్హులైన కాంట్రాక్టర్లు టెండర్లు సమర్పించవచ్చు. (నమూనా వచనం)", LocalDate.now().minusDays(30)));
      }
      if (c.count() == 0) {
        String[][] d = {{"Road","Pothole filled near temple","2","గుడి దగ్గర రోడ్డుపై గుంత పూడ్చబడింది"},
                {"Water","Broken pipeline repaired near school","5","పాఠశాల దగ్గర పగిలిన పైపులైన్ మరమ్మతు చేయబడింది"},
                {"Streetlight","3 streetlights replaced","1","3 వీధి దీపాలు మార్చబడ్డాయి"}};
        for (String[] r : d) {
          Complaint k = new Complaint();
          k.category = r[0];
          k.description = r[1];
          k.ward = Integer.parseInt(r[2]);
          k.name = "Sample";
          k.descriptionTe = r[3];
          k.status = "RESOLVED";
          c.save(k);
          k.ticketNo = "GUM-" + k.createdAt.getYear() + "-" + String.format("%04d", k.id);
          c.save(k);
        }
      }
    };
  }
}
