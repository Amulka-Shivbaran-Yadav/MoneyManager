package com.example.moneymanager.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import com.example.moneymanager.dto.ExpenseDTO;
import com.example.moneymanager.dto.IncomeDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExcelService {
	 private final IncomeService incomeService;
	 private final ExpenseService expenseService;
	 

	    public byte[] generateIncomeExcel() throws Exception {

	        List<IncomeDTO> incomes =
	                incomeService.getAllIncomesForCurrentUser();

	        try (XSSFWorkbook workbook = new XSSFWorkbook()) {

	            XSSFSheet sheet = workbook.createSheet("Income Report");

	            int rowNum = 0;

	            Row header = sheet.createRow(rowNum++);

	            header.createCell(0).setCellValue("ID");
	            header.createCell(1).setCellValue("Income Name");
	            header.createCell(2).setCellValue("Category");
	            header.createCell(3).setCellValue("Amount");
	            header.createCell(4).setCellValue("Date");

	            for (IncomeDTO income : incomes) {

	                Row row = sheet.createRow(rowNum++);

	                row.createCell(0).setCellValue(income.getId());

	                row.createCell(1).setCellValue(income.getName());

	                row.createCell(2).setCellValue(income.getCategoryName());

	                row.createCell(3).setCellValue(
	                        income.getAmount().doubleValue());

	                row.createCell(4).setCellValue(
	                        income.getDate().toString());
	            }

	            sheet.autoSizeColumn(0);
	            sheet.autoSizeColumn(1);
	            sheet.autoSizeColumn(2);
	            sheet.autoSizeColumn(3);
	            sheet.autoSizeColumn(4);

	            ByteArrayOutputStream out =
	                    new ByteArrayOutputStream();

	            workbook.write(out);

	            return out.toByteArray();

	        } catch (IOException e) {

	            throw new RuntimeException("Excel generation failed", e);

	        }
	    }

	    public byte[] generateExpenseExcel() throws Exception {

	        List<ExpenseDTO> expenses =
	                expenseService.getAllExpensesForCurrentUser();

	        try (XSSFWorkbook workbook = new XSSFWorkbook()) {

	            XSSFSheet sheet = workbook.createSheet("Expense Report");

	            int rowNum = 0;

	            Row header = sheet.createRow(rowNum++);

	            header.createCell(0).setCellValue("ID");
	            header.createCell(1).setCellValue("Expense Name");
	            header.createCell(2).setCellValue("Category");
	            header.createCell(3).setCellValue("Amount");
	            header.createCell(4).setCellValue("Date");

	            for (ExpenseDTO expense : expenses) {

	                Row row = sheet.createRow(rowNum++);

	                row.createCell(0).setCellValue(expense.getId());

	                row.createCell(1).setCellValue(expense.getName());

	                row.createCell(2).setCellValue(expense.getCategoryName());

	                row.createCell(3).setCellValue(
	                        expense.getAmount().doubleValue());

	                row.createCell(4).setCellValue(
	                        expense.getDate().toString());
	            }

	            for (int i = 0; i < 5; i++) {
	                sheet.autoSizeColumn(i);
	            }

	            ByteArrayOutputStream out = new ByteArrayOutputStream();

	            workbook.write(out);

	            return out.toByteArray();

	        } catch (IOException e) {

	            throw new RuntimeException("Expense Excel generation failed", e);

	        }
	    }

}
