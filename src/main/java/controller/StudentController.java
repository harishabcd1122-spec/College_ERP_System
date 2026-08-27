package com.collegeerp.college_erp_system.controller;

import com.collegeerp.college_erp_system.entity.Attendance;
import com.collegeerp.college_erp_system.entity.Marks;
import com.collegeerp.college_erp_system.entity.Student;
import com.collegeerp.college_erp_system.repository.AttendanceRepository;
import com.collegeerp.college_erp_system.repository.MarksRepository;
import com.collegeerp.college_erp_system.service.PdfService;
import com.collegeerp.college_erp_system.service.StudentService;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentService service;
    private final PdfService pdfService;
    private final MarksRepository marksRepository;
    private final AttendanceRepository attendanceRepository;

    public StudentController(StudentService service,
                             PdfService pdfService,
                             MarksRepository marksRepository,
                             AttendanceRepository attendanceRepository) {

        this.service = service;
        this.pdfService = pdfService;
        this.marksRepository = marksRepository;
        this.attendanceRepository = attendanceRepository;
    }

    // Add Student
    @PostMapping
    public Student addStudent(@RequestBody Student student) {
        return service.saveStudent(student);
    }

    // Get All Students
    @GetMapping
    public List<Student> getAllStudents() {
        return service.getAllStudents();
    }

    // Get Student By ID
    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable Long id) {
        return service.getStudentById(id);
    }

    // Update Student
    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable Long id,
                                 @RequestBody Student student) {
        return service.updateStudent(id, student);
    }

    // Delete Student
    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable Long id) {
        service.deleteStudent(id);
        return "Student deleted successfully!";
    }

    // Export All Students PDF
    @GetMapping("/pdf")
    public ResponseEntity<InputStreamResource> downloadPdf() {

        ByteArrayInputStream pdf =
                pdfService.generateStudentPdf(service.getAllStudents());

        HttpHeaders headers = new HttpHeaders();
        headers.add(
                "Content-Disposition",
                "attachment; filename=Student_Report.pdf"
        );

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdf));
    }

    // Download Individual Student Report Card
    @GetMapping("/report/{id}")
    public ResponseEntity<InputStreamResource> downloadReportCard(
            @PathVariable Long id) {

        Student student = service.getStudentById(id);

        if (student == null) {
            return ResponseEntity.notFound().build();
        }

        List<Marks> marks =
                marksRepository.findByStudentName(student.getName());

        List<Attendance> attendance =
                attendanceRepository.findByStudentName(student.getName());

        ByteArrayInputStream pdf =
                pdfService.generateReportCard(student, marks, attendance);

        HttpHeaders headers = new HttpHeaders();
        headers.add(
                "Content-Disposition",
                "attachment; filename=ReportCard.pdf"
        );

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdf));
    }
    @GetMapping("/department-count")
    public List<Object[]> departmentCount() {
    return service.getDepartmentCount();
    }
}