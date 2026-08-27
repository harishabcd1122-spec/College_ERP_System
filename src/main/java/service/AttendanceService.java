package com.collegeerp.college_erp_system.service;

import com.collegeerp.college_erp_system.entity.Attendance;
import com.collegeerp.college_erp_system.repository.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository repository;

    public AttendanceService(AttendanceRepository repository) {
        this.repository = repository;
    }

    // Add Attendance
    public Attendance saveAttendance(Attendance attendance) {
        return repository.save(attendance);
    }

    // Get All Attendance
    public List<Attendance> getAllAttendance() {
        return repository.findAll();
    }

    // Get Attendance By ID
    public Attendance getAttendanceById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Update Attendance
    public Attendance updateAttendance(Long id, Attendance attendance) {

        Attendance existing = repository.findById(id).orElse(null);

        if (existing != null) {

            existing.setStudentName(attendance.getStudentName());
            existing.setDate(attendance.getDate());
            existing.setStatus(attendance.getStatus());

            return repository.save(existing);
        }

        return null;
    }

    // Delete Attendance
    public void deleteAttendance(Long id) {
        repository.deleteById(id);
    }
    public List<Object[]> getLowAttendanceStudents() {
    return repository.getLowAttendanceStudents();
    }
}