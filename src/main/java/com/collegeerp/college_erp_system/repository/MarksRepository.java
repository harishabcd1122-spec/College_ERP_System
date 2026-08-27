package com.collegeerp.college_erp_system.repository;

import com.collegeerp.college_erp_system.entity.Marks;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MarksRepository extends JpaRepository<Marks, Long> {

    List<Marks> findByStudentName(String studentName);

    Marks findTopByOrderByTotalMarksDesc();
}