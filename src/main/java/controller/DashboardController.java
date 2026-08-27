package com.collegeerp.college_erp_system.controller;

import com.collegeerp.college_erp_system.dto.DashboardResponse;
import com.collegeerp.college_erp_system.entity.Marks;
import com.collegeerp.college_erp_system.repository.AttendanceRepository;
import com.collegeerp.college_erp_system.repository.CourseRepository;
import com.collegeerp.college_erp_system.repository.MarksRepository;
import com.collegeerp.college_erp_system.repository.StudentRepository;
import com.collegeerp.college_erp_system.repository.TeacherRepository;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final CourseRepository courseRepository;
    private final AttendanceRepository attendanceRepository;
    private final MarksRepository marksRepository;

    public DashboardController(
            StudentRepository studentRepository,
            TeacherRepository teacherRepository,
            CourseRepository courseRepository,
            AttendanceRepository attendanceRepository,
            MarksRepository marksRepository) {

        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.courseRepository = courseRepository;
        this.attendanceRepository = attendanceRepository;
        this.marksRepository = marksRepository;
    }

    @GetMapping
    public DashboardResponse getDashboardData() {

        DashboardResponse response = new DashboardResponse();

        response.setStudents(studentRepository.count());
        response.setTeachers(teacherRepository.count());
        response.setCourses(courseRepository.count());
        response.setAttendance(attendanceRepository.count());
        response.setMarks(marksRepository.count());

        // ---------- Top Scorer ----------
        Marks top = marksRepository.findTopByOrderByTotalMarksDesc();

        if (top != null) {
            response.setTopScorer(top.getStudentName());
            response.setHighestMarks(top.getTotalMarks());
        } else {
            response.setTopScorer("No Data");
            response.setHighestMarks(0);
        }

        // ---------- Average Marks ----------
        List<Marks> marksList = marksRepository.findAll();

        if (!marksList.isEmpty()) {

            double avg = marksList.stream()
                    .mapToInt(Marks::getTotalMarks)
                    .average()
                    .orElse(0);

            response.setAverageMarks(avg);

            long passCount = marksList.stream()
                    .filter(m -> m.getTotalMarks() >= 40)
                    .count();

            response.setPassPercentage(
                    (passCount * 100.0) / marksList.size()
            );

        } else {

            response.setAverageMarks(0.0);
            response.setPassPercentage(0.0);

        }

        // ---------- Attendance Percentage ----------

        Long totalAttendance = attendanceRepository.getTotalAttendance();
        Long presentAttendance = attendanceRepository.getPresentCount();

        if (totalAttendance != null && totalAttendance > 0) {

            response.setAttendancePercentage(
                    (presentAttendance * 100.0) / totalAttendance
            );

        } else {

            response.setAttendancePercentage(0.0);

        }

        // ---------- Department Statistics ----------

        response.setDepartmentStats(
                studentRepository.getDepartmentStatistics()
        );

        return response;
    }

    @GetMapping("/departments")
    public Map<String, Long> getDepartmentStatistics() {

        List<Object[]> result = studentRepository.getDepartmentStatistics();

        Map<String, Long> map = new HashMap<>();

        for (Object[] row : result) {

            map.put((String) row[0], (Long) row[1]);

        }

        return map;
    }
}