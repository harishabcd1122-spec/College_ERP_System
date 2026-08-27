package com.collegeerp.college_erp_system.repository;

import com.collegeerp.college_erp_system.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

}