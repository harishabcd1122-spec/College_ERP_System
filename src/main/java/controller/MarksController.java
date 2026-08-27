package com.collegeerp.college_erp_system.controller;
import com.collegeerp.college_erp_system.service.PdfService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.io.ByteArrayInputStream;
import com.collegeerp.college_erp_system.entity.Marks;
import com.collegeerp.college_erp_system.service.MarksService;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/marks")
@CrossOrigin("*")
public class MarksController {

    private final MarksService service;
    private final PdfService pdfService;

    public MarksController(MarksService service,
                       PdfService pdfService) {

    this.service = service;
    this.pdfService = pdfService;
}
    // Add Marks
    @PostMapping
    public Marks addMarks(@RequestBody Marks marks) {
        return service.saveMarks(marks);
    }

    // Get All Marks
    @GetMapping
    public List<Marks> getAllMarks() {
        return service.getAllMarks();
    }

    // Get Marks By ID
    @GetMapping("/{id}")
    public Marks getMarksById(@PathVariable Long id) {
        return service.getMarksById(id);
    }

    // Update Marks
    @PutMapping("/{id}")
    public Marks updateMarks(@PathVariable Long id,
                             @RequestBody Marks marks) {
        return service.updateMarks(id, marks);
    }

    // Delete Marks
    @DeleteMapping("/{id}")
    public String deleteMarks(@PathVariable Long id) {
        service.deleteMarks(id);
        return "Marks deleted successfully!";
    }
    @GetMapping("/pdf")
     public ResponseEntity<InputStreamResource> exportPdf() {

    ByteArrayInputStream pdf =
            pdfService.generateMarksPdf(service.getAllMarks());

    HttpHeaders headers = new HttpHeaders();

    headers.add("Content-Disposition",
            "inline; filename=marks_report.pdf");

    return ResponseEntity
            .ok()
            .headers(headers)
            .contentType(MediaType.APPLICATION_PDF)
            .body(new InputStreamResource(pdf));
    }
}