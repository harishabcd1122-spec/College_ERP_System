package com.collegeerp.college_erp_system.service;

import com.collegeerp.college_erp_system.entity.Teacher;
import com.collegeerp.college_erp_system.repository.TeacherRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherService {

    private final TeacherRepository repository;

    public TeacherService(TeacherRepository repository) {
        this.repository = repository;
    }

    // Add Teacher
    public Teacher saveTeacher(Teacher teacher) {
        return repository.save(teacher);
    }

    // Get All Teachers
    public List<Teacher> getAllTeachers() {
        return repository.findAll();
    }

    // Get Teacher By ID
    public Teacher getTeacherById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Update Teacher
    public Teacher updateTeacher(Long id, Teacher teacher) {

        Teacher existing = repository.findById(id).orElse(null);

        if (existing != null) {

            existing.setName(teacher.getName());
            existing.setEmail(teacher.getEmail());
            existing.setDepartment(teacher.getDepartment());
            existing.setSubject(teacher.getSubject());

            return repository.save(existing);
        }

        return null;
    }

    // Delete Teacher
    public void deleteTeacher(Long id) {
        repository.deleteById(id);
    }
}
