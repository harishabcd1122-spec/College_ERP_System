package com.collegeerp.college_erp_system.service;

import com.collegeerp.college_erp_system.entity.Course;
import com.collegeerp.college_erp_system.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService 
{

    private final CourseRepository repository;

    public CourseService(CourseRepository repository) {
        this.repository = repository;
    }

    // Add Course
    public Course saveCourse(Course course) {
        return repository.save(course);
    }

    // Get All Courses
    public List<Course> getAllCourses() {
        return repository.findAll();
    }

    // Get Course By ID
    public Course getCourseById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Update Course
    public Course updateCourse(Long id, Course course) {

     Course existing = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Course not found"));

        existing.setCourseName(course.getCourseName());
        existing.setDepartment(course.getDepartment());

        return repository.save(existing);
    }

    // Delete Course
    public void deleteCourse(Long id) {
        repository.deleteById(id);
    }
}
