package com.collegeerp.college_erp_system.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "marks")
public class Marks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentName;
    private String courseName;

    private Integer internalMarks;
    private Integer externalMarks;

    private Integer totalMarks;

    private String grade;

    public Marks() {
    }

    public Marks(Long id, String studentName, String courseName,
                 Integer internalMarks, Integer externalMarks,
                 Integer totalMarks, String grade) {

        this.id = id;
        this.studentName = studentName;
        this.courseName = courseName;
        this.internalMarks = internalMarks;
        this.externalMarks = externalMarks;
        this.totalMarks = totalMarks;
        this.grade = grade;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public Integer getInternalMarks() {
        return internalMarks;
    }

    public void setInternalMarks(Integer internalMarks) {
        this.internalMarks = internalMarks;
    }

    public Integer getExternalMarks() {
        return externalMarks;
    }

    public void setExternalMarks(Integer externalMarks) {
        this.externalMarks = externalMarks;
    }

    public Integer getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }
}