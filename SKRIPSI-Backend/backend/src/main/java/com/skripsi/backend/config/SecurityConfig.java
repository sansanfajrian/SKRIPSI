package com.skripsi.backend.config;

import org.jose4j.jwt.consumer.JwtConsumer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtConsumer jwtConsumer) throws Exception {
        http
                .authorizeHttpRequests(authorizeRequests -> authorizeRequests
                        .requestMatchers("/login/**").permitAll()
                        .anyRequest().authenticated())
                .csrf(o -> o.disable())
                .addFilterBefore(new JwtAuthenticationFilter(jwtConsumer), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
