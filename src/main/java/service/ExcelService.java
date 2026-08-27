package com.collegeerp.college_erp_system.service;

import com.collegeerp.college_erp_system.entity.Student;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ExcelService {

    public ByteArrayInputStream exportStudentsToExcel(List<Student> students) throws IOException {

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Students");

        // Header Style
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);

        CellStyle headerStyle = workbook.createCellStyle();
        headerStyle.setFont(headerFont);

        // Header Row
        Row headerRow = sheet.createRow(0);

        String[] columns = {
                "ID",
                "Name",
                "Email",
                "Department"
        };

        for (int i = 0; i < columns.length; i++) {

            Cell cell = headerRow.createCell(i);

            cell.setCellValue(columns[i]);

            cell.setCellStyle(headerStyle);
        }

        // Data Rows
        int rowNum = 1;

        for (Student student : students) {

            Row row = sheet.createRow(rowNum++);

            row.createCell(0).setCellValue(student.getId());

            row.createCell(1).setCellValue(student.getName());

            row.createCell(2).setCellValue(student.getEmail());

            row.createCell(3).setCellValue(student.getDepartment());
        }

        // Auto-size columns
        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        workbook.write(out);

        workbook.close();

        return new ByteArrayInputStream(out.toByteArray());
    }
}