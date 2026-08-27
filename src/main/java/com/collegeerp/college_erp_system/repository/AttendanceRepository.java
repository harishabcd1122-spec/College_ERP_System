package com.collegeerp.college_erp_system.repository;

import com.collegeerp.college_erp_system.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    @Query("SELECT COUNT(a) FROM Attendance a")
    Long getTotalAttendance();

   @Query("SELECT COUNT(a) FROM Attendance a WHERE a.status='Present'")
    Long getPresentCount();

    List<Attendance> findByStudentName(String studentName);

    @Query("""
    SELECT a.studentName,
    ROUND(
        SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END)
        *100.0/COUNT(a),2)
    FROM Attendance a
    GROUP BY a.studentName
    HAVING
    SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END)
    *100.0/COUNT(a) < 75
    """)
    List<Object[]> getLowAttendanceStudents();
}