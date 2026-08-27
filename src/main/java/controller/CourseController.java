package com.collegeerp.college_erp_system.controller;

import com.collegeerp.college_erp_system.entity.Course;
import com.collegeerp.college_erp_system.service.CourseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
@CrossOrigin("*")
public class CourseController {

    private final CourseService service;

    public CourseController(CourseService service) {
        this.service = service;
    }

    // Add Course
    @PostMapping
    public Course addCourse(@RequestBody Course course) {
        return service.saveCourse(course);
    }

    // Get All Courses
    @GetMapping
    public List<Course> getAllCourses() {
        return service.getAllCourses();
    }

    // Get Course By ID
    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable Long id) {
        return service.getCourseById(id);
    }

    // Update Course
    @PutMapping("/{id}")
    public Course updateCourse(@PathVariable Long id,
                           @RequestBody Course course) {
    return service.updateCourse(id, course);
}
    // Delete Course
    @DeleteMapping("/{id}")
    public String deleteCourse(@PathVariable Long id) {
        service.deleteCourse(id);
        return "Course deleted successfully!";
    }
}