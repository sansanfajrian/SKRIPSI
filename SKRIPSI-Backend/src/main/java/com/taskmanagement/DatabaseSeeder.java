package com.taskmanagement;

import java.util.Date;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.taskmanagement.dao.UserDao;
import com.taskmanagement.entity.AuthProvider;
import com.taskmanagement.entity.User;

@Configuration
public class DatabaseSeeder {

    @Bean
    CommandLineRunner initDatabase(UserDao userRepository) {
        return args -> {
            // Cek apakah user dengan email tertentu sudah ada
            if (userRepository.findByEmailId("sansan.fajrian@gmail.com") == null) {
                // Enkripsi password
                BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                String encryptedPassword = passwordEncoder.encode("password123"); // Ganti dengan password yang diinginkan

                // Buat user baru
                User user = User.builder()
                        .name("Admin Monitoring Proyek 79")
                        .emailId("sansan.fajrian@gmail.com")
                        .password(encryptedPassword)
                        .role("admin")
                        .status(true)
                        .imageUrl(null)
                        .emailVerified(true)
                        .provider(AuthProvider.local)
                        .providerId(null)
                        .createdTime(new Date())
                        .lastModifiedTime(new Date())
                        .build();

                // Simpan user ke database
                userRepository.save(user);
            }
        };
    }
}
