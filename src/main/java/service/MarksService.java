package com.collegeerp.college_erp_system.service;

import com.collegeerp.college_erp_system.entity.Marks;
import com.collegeerp.college_erp_system.repository.MarksRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarksService {

    private final MarksRepository repository;

    public MarksService(MarksRepository repository) {
        this.repository = repository;
    }

    // Add Marks
    public Marks saveMarks(Marks marks) {

        calculateTotalAndGrade(marks);

        return repository.save(marks);
    }

    // Get All Marks
    public List<Marks> getAllMarks() {
        return repository.findAll();
    }

    // Get Marks By ID
    public Marks getMarksById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Update Marks
    public Marks updateMarks(Long id, Marks marks) {

        Marks existing = repository.findById(id).orElse(null);

        if (existing != null) {

            existing.setStudentName(marks.getStudentName());
            existing.setCourseName(marks.getCourseName());
            existing.setInternalMarks(marks.getInternalMarks());
            existing.setExternalMarks(marks.getExternalMarks());

            calculateTotalAndGrade(existing);

            return repository.save(existing);
        }

        return null;
    }

    // Delete Marks
    public void deleteMarks(Long id) {
        repository.deleteById(id);
    }

    // Calculate Total Marks and Grade
    private void calculateTotalAndGrade(Marks marks) {

        int internal = marks.getInternalMarks() == null ? 0 : marks.getInternalMarks();
        int external = marks.getExternalMarks() == null ? 0 : marks.getExternalMarks();

        int total = internal + external;

        marks.setTotalMarks(total);

        if (total >= 90) {
            marks.setGrade("O");
        } else if (total >= 80) {
            marks.setGrade("A+");
        } else if (total >= 70) {
            marks.setGrade("A");
        } else if (total >= 60) {
            marks.setGrade("B");
        } else if (total >= 50) {
            marks.setGrade("C");
        } else {
            marks.setGrade("F");
        }
    }
}