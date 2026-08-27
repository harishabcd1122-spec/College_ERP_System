package com.collegeerp.college_erp_system.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String courseCode;
    private String courseName;
    private String department;
    private String teacherName;
    private Integer semester;

    public Course() {
    }

    public Course(Long id,
              String courseCode,
              String courseName,
              String department,
              String teacherName,
              Integer semester) {

    this.id = id;
    this.courseCode = courseCode;
    this.courseName = courseName;
    this.department = department;
    this.teacherName = teacherName;
    this.semester = semester;
}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public Integer getSemester() {
    return semester;
    }

    public void setSemester(Integer semester) {
      this.semester = semester;
    }
}