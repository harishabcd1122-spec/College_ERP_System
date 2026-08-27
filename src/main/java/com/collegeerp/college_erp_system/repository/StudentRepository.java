package com.collegeerp.college_erp_system.repository;

import com.collegeerp.college_erp_system.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {

    @Query("""
    SELECT s.department, COUNT(s)
    FROM Student s
    GROUP BY s.department
    """)
    List<Object[]> getDepartmentCount();

    @Query("""
    SELECT s.department, COUNT(s)
    FROM Student s
    GROUP BY s.department
    """)
    List<Object[]> getDepartmentStatistics();

}