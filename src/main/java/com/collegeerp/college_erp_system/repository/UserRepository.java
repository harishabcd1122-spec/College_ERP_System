package com.collegeerp.college_erp_system.repository;

import com.collegeerp.college_erp_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);

}