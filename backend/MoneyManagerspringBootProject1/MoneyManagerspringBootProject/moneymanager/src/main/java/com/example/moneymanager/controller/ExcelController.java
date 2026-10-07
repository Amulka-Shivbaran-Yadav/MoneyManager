package com.example.moneymanager.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.moneymanager.service.ExcelService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/excel")
@RequiredArgsConstructor
public class ExcelController {
	private final ExcelService excelService;

    @GetMapping("/download/income")
    public ResponseEntity<byte[]> downloadIncomeExcel() {

        try {

            byte[] excel = excelService.generateIncomeExcel();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=Income_Report.xlsx")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(excel);

        } catch (Exception e) {
            throw new RuntimeException("Unable to generate excel", e);
        }
    }
    
    
    @GetMapping("/download/expense")
    public ResponseEntity<byte[]> downloadExpenseExcel() {

        try {

            byte[] excel = excelService.generateExpenseExcel();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=Expense_Report.xlsx")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(excel);

        } catch (Exception e) {
            throw new RuntimeException("Unable to generate expense excel", e);
        }
    }

}
