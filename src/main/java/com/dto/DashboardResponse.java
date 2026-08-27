package com.collegeerp.college_erp_system.dto;

import java.util.List;

public class DashboardResponse {

    private long students;
    private long teachers;
    private long courses;
    private long attendance;
    private long marks;

    private Integer highestMarks;
    private Double averageMarks;
    private String topScorer;
    private Double passPercentage;
    private Double attendancePercentage;

    private List<Object[]> departmentStats;

    public DashboardResponse() {
    }

    public DashboardResponse(long students,
                             long teachers,
                             long courses,
                             long attendance,
                             long marks,
                             String topScorer,
                             Integer highestMarks) {

        this.students = students;
        this.teachers = teachers;
        this.courses = courses;
        this.attendance = attendance;
        this.marks = marks;
        this.topScorer = topScorer;
        this.highestMarks = highestMarks;
    }

    public long getStudents() {
        return students;
    }

    public void setStudents(long students) {
        this.students = students;
    }

    public long getTeachers() {
        return teachers;
    }

    public void setTeachers(long teachers) {
        this.teachers = teachers;
    }

    public long getCourses() {
        return courses;
    }

    public void setCourses(long courses) {
        this.courses = courses;
    }

    public long getAttendance() {
        return attendance;
    }

    public void setAttendance(long attendance) {
        this.attendance = attendance;
    }

    public long getMarks() {
        return marks;
    }

    public void setMarks(long marks) {
        this.marks = marks;
    }

    public Integer getHighestMarks() {
        return highestMarks;
    }

    public void setHighestMarks(Integer highestMarks) {
        this.highestMarks = highestMarks;
    }

    public Double getAverageMarks() {
        return averageMarks;
    }

    public void setAverageMarks(Double averageMarks) {
        this.averageMarks = averageMarks;
    }

    public String getTopScorer() {
        return topScorer;
    }

    public void setTopScorer(String topScorer) {
        this.topScorer = topScorer;
    }

    public Double getPassPercentage() {
        return passPercentage;
    }

    public void setPassPercentage(Double passPercentage) {
        this.passPercentage = passPercentage;
    }

    public Double getAttendancePercentage() {
        return attendancePercentage;
    }

    public void setAttendancePercentage(Double attendancePercentage) {
        this.attendancePercentage = attendancePercentage;
    }

    public List<Object[]> getDepartmentStats() {
        return departmentStats;
    }

    public void setDepartmentStats(List<Object[]> departmentStats) {
        this.departmentStats = departmentStats;
    }
}