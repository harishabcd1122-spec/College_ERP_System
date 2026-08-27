package com.collegeerp.college_erp_system.controller;

import com.collegeerp.college_erp_system.entity.Teacher;
import com.collegeerp.college_erp_system.service.TeacherService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teachers")
public class TeacherController {

    private final TeacherService service;

    public TeacherController(TeacherService service) {
        this.service = service;
    }

    // Add Teacher
    @PostMapping
    public Teacher addTeacher(@RequestBody Teacher teacher) {
        return service.saveTeacher(teacher);
    }

    // Get All Teachers
    @GetMapping
    public List<Teacher> getAllTeachers() {
        return service.getAllTeachers();
    }

    // Get Teacher By ID
    @GetMapping("/{id}")
    public Teacher getTeacherById(@PathVariable Long id) {
        return service.getTeacherById(id);
    }

    // Update Teacher
    @PutMapping("/{id}")
    public Teacher updateTeacher(@PathVariable Long id,
                                 @RequestBody Teacher teacher) {
        return service.updateTeacher(id, teacher);
    }

    // Delete Teacher
    @DeleteMapping("/{id}")
    public String deleteTeacher(@PathVariable Long id) {
        service.deleteTeacher(id);
        return "Teacher deleted successfully!";
    }
}
