package com.collegeerp.college_erp_system.controller;

import com.collegeerp.college_erp_system.entity.Attendance;
import com.collegeerp.college_erp_system.service.AttendanceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attendance")
@CrossOrigin("*")
public class AttendanceController {

    private final AttendanceService service;

    public AttendanceController(AttendanceService service) {
        this.service = service;
    }

    // Add Attendance
    @PostMapping
    public Attendance addAttendance(@RequestBody Attendance attendance) {
        return service.saveAttendance(attendance);
    }

    // Get All Attendance
    @GetMapping
    public List<Attendance> getAllAttendance() {
        return service.getAllAttendance();
    }
    @GetMapping("/low-attendance")
    public List<Object[]> lowAttendance() {
    return service.getLowAttendanceStudents();
    }

    @GetMapping("/id/{id}")
    public Attendance getAttendanceById(@PathVariable Long id) {
    return service.getAttendanceById(id);
   }
  // Update Attendance
    @PutMapping("/{id}")
    public Attendance updateAttendance(@PathVariable Long id,
                                       @RequestBody Attendance attendance) {
        return service.updateAttendance(id, attendance);
    }

    // Delete Attendance
    @DeleteMapping("/{id}")
    public String deleteAttendance(@PathVariable Long id) {
        service.deleteAttendance(id);
        return "Attendance deleted successfully!";
    }
    
}