package com.collegeerp.college_erp_system.service;

import com.collegeerp.college_erp_system.dto.DashboardResponse;
import com.collegeerp.college_erp_system.entity.Marks;
import com.collegeerp.college_erp_system.repository.AttendanceRepository;
import com.collegeerp.college_erp_system.repository.CourseRepository;
import com.collegeerp.college_erp_system.repository.MarksRepository;
import com.collegeerp.college_erp_system.repository.StudentRepository;
import com.collegeerp.college_erp_system.repository.TeacherRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class DashboardService {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final CourseRepository courseRepository;
    private final AttendanceRepository attendanceRepository;
    private final MarksRepository marksRepository;

    public DashboardService(StudentRepository studentRepository,
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

    public DashboardResponse getDashboard() {

        DashboardResponse response = new DashboardResponse();

        response.setStudents(studentRepository.count());
        response.setTeachers(teacherRepository.count());
        response.setCourses(courseRepository.count());
        response.setAttendance(attendanceRepository.count());
        response.setMarks(marksRepository.count());

        List<Marks> marks = marksRepository.findAll();

        if (!marks.isEmpty()) {

            Marks topper = marks.stream()
                    .max(Comparator.comparingInt(Marks::getTotalMarks))
                    .orElse(null);

            if (topper != null) {
                response.setHighestMarks(topper.getTotalMarks());
                response.setTopScorer(topper.getStudentName());
            }

            double average = marks.stream()
                    .mapToInt(Marks::getTotalMarks)
                    .average()
                    .orElse(0);

            response.setAverageMarks(average);

            long pass = marks.stream()
                    .filter(m -> m.getTotalMarks() >= 40)
                    .count();

            response.setPassPercentage((pass * 100.0) / marks.size());
        }

        long totalAttendance = attendanceRepository.count();

        if (totalAttendance > 0) {

            long present = attendanceRepository.findAll()
                    .stream()
                    .filter(a -> a.getStatus().equalsIgnoreCase("Present"))
                    .count();

            response.setAttendancePercentage((present * 100.0) / totalAttendance);
        }

        response.setDepartmentStats(studentRepository.getDepartmentStatistics());

        return response;
    }
}