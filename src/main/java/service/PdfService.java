package com.collegeerp.college_erp_system.service;

import com.collegeerp.college_erp_system.entity.Student;
import com.collegeerp.college_erp_system.entity.Marks;
import com.collegeerp.college_erp_system.entity.Attendance;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class PdfService {

    // Existing Student List PDF
    public ByteArrayInputStream generateStudentPdf(List<Student> students) {

        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {

            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(
                    FontFactory.HELVETICA_BOLD,
                    18
            );

            Paragraph title =
                    new Paragraph("COLLEGE ERP SYSTEM\nSTUDENT REPORT",
                            titleFont);

            title.setAlignment(Element.ALIGN_CENTER);

            document.add(title);
            document.add(new Paragraph(" "));

            for (Student student : students) {

                document.add(new Paragraph("ID : " + student.getId()));
                document.add(new Paragraph("Name : " + student.getName()));
                document.add(new Paragraph("Email : " + student.getEmail()));
                document.add(new Paragraph("Department : " + student.getDepartment()));
                document.add(new Paragraph("--------------------------------------"));
            }

            document.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    // Student Report Card PDF
    public ByteArrayInputStream generateReportCard(Student student,
                                                   List<Marks> marksList,
                                                   List<Attendance> attendanceList) {

        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {

            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(
                    FontFactory.HELVETICA_BOLD,
                    20
            );

            Paragraph title = new Paragraph("STUDENT REPORT CARD", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);

            document.add(title);
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Student Name : " + student.getName()));
            document.add(new Paragraph("Email : " + student.getEmail()));
            document.add(new Paragraph("Department : " + student.getDepartment()));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("------------- MARKS -------------"));

            int total = 0;

            for (Marks m : marksList) {

                document.add(new Paragraph(
                        m.getCourseName()
                                + " : "
                                + m.getTotalMarks()
                                + " (" + m.getGrade() + ")"
                ));

                total += m.getTotalMarks();
            }

            double average = marksList.isEmpty() ? 0 : (double) total / marksList.size();

            document.add(new Paragraph(" "));
            document.add(new Paragraph("Total Marks : " + total));
            document.add(new Paragraph("Average : " + String.format("%.2f", average)));

            long present = attendanceList.stream()
                    .filter(a -> "Present".equalsIgnoreCase(a.getStatus()))
                    .count();

            double attendancePercent = attendanceList.isEmpty()
                    ? 0
                    : (present * 100.0) / attendanceList.size();

            document.add(new Paragraph("Attendance : "
                    + String.format("%.2f", attendancePercent)
                    + "%"));

            document.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
    public ByteArrayInputStream generateMarksPdf(List<Marks> marksList) {

    Document document = new Document();
    ByteArrayOutputStream out = new ByteArrayOutputStream();

    try {

        PdfWriter.getInstance(document, out);
        document.open();

        Font titleFont = FontFactory.getFont(
                FontFactory.HELVETICA_BOLD, 18);

        Paragraph title = new Paragraph(
                "COLLEGE ERP SYSTEM\nMARKS REPORT",
                titleFont);

        title.setAlignment(Element.ALIGN_CENTER);

        document.add(title);
        document.add(new Paragraph(" "));

        for (Marks m : marksList) {

            document.add(new Paragraph("Student : " + m.getStudentName()));
            document.add(new Paragraph("Course : " + m.getCourseName()));
            document.add(new Paragraph("Internal : " + m.getInternalMarks()));
            document.add(new Paragraph("External : " + m.getExternalMarks()));
            document.add(new Paragraph("Total : " + m.getTotalMarks()));
            document.add(new Paragraph("Grade : " + m.getGrade()));
            document.add(new Paragraph("--------------------------------------"));
        }

        document.close();

    } catch (Exception e) {
        e.printStackTrace();
    }

    return new ByteArrayInputStream(out.toByteArray());
}
}