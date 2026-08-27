package com.collegeerp.college_erp_system.service;

import com.collegeerp.college_erp_system.entity.Student;
import com.collegeerp.college_erp_system.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService 
{

    private final StudentRepository repository;

    public StudentService(StudentRepository repository) {
        this.repository = repository;
    }

    // Save a student
    public Student saveStudent(Student student) {
        return repository.save(student);
    }

    // Get all students
    public List<Student> getAllStudents() {
        return repository.findAll();
    }
    // Get student by ID
    public Student getStudentById(Long id) {
      return repository.findById(id).orElse(null);
    }
    // Update student
    public Student updateStudent(Long id, Student student) 
    {

    Student existingStudent = repository.findById(id).orElse(null);

    if (existingStudent != null) 
    {
        existingStudent.setName(student.getName());
        existingStudent.setEmail(student.getEmail());
        existingStudent.setDepartment(student.getDepartment());

        return repository.save(existingStudent);
     }

      return null;
  }
    // Delete student
    public void deleteStudent(Long id) {
       repository.deleteById(id);
    }
    public List<Object[]> getDepartmentCount() {
    return repository.getDepartmentCount();
}
}