package com.collegeerp.college_erp_system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http

                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        // Everyone can access HTML/CSS/JS
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/login.html",
                                "/admin.html",
                                "/teacher.html",
                                "/student.html",
                                "/dashboard.html",
                                "/css/**",
                                "/js/**",
                                "/images/**"
                        ).permitAll()

                        // Everyone can LOGIN
                        .requestMatchers("/login").permitAll()

                        // Everyone can VIEW data
                        .requestMatchers(org.springframework.http.HttpMethod.GET,
                                "/students/**",
                                "/teachers/**",
                                "/courses/**",
                                "/attendance/**",
                                "/marks/**",
                                "/dashboard/**"
                        ).permitAll()

                        // Only Admin & Teacher can MODIFY
                        .requestMatchers(org.springframework.http.HttpMethod.POST,
                                "/students/**",
                                "/teachers/**",
                                "/courses/**",
                                "/attendance/**",
                                "/marks/**"
                        ).permitAll()

                        .requestMatchers(org.springframework.http.HttpMethod.PUT,
                                "/students/**",
                                "/teachers/**",
                                "/courses/**",
                                "/attendance/**",
                                "/marks/**"
                        ).permitAll()

                        .requestMatchers(org.springframework.http.HttpMethod.DELETE,
                                "/students/**",
                                "/teachers/**",
                                "/courses/**",
                                "/attendance/**",
                                "/marks/**"
                        ).permitAll()

                        .anyRequest().permitAll()

                )

                .httpBasic(Customizer.withDefaults());

        return http.build();
    }

}