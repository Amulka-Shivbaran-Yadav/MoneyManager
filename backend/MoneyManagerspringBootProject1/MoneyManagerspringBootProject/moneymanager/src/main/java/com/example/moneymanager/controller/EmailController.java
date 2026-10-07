package com.example.moneymanager.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.moneymanager.entity.ProfileEntity;
import com.example.moneymanager.service.EmailService;
import com.example.moneymanager.service.ExcelService;
import com.example.moneymanager.service.ProfileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/email")
public class EmailController {

	private final EmailService emailService;
	private final ExcelService excelService;
	private final ProfileService profileService;

	public EmailController(EmailService emailService, ExcelService excelService, ProfileService profileService) {
		super();
		this.emailService = emailService;
		this.excelService = excelService;
		this.profileService = profileService;
	}

	@GetMapping("/income-excel")
	public ResponseEntity<String> sendIncomeExcel() {

		try {
			ProfileEntity profile = profileService.getCurrentProfile();

			byte[] excelFile = excelService.generateIncomeExcel();

			emailService.sendEmailWithAttachment(profile.getEmail(), "Income Report", """
					Hello %s,
					Please find attached your Income Report.
					Regards,
					Money Manager
					""".formatted(profile.getFullName()), excelFile, "Income_Report.xlsx");
			return ResponseEntity.ok("Income report emailed successfully.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().body("Failed to send email.");
		}
	}

	@GetMapping("/expense-excel")
	public ResponseEntity<String> sendExpenseExcel() {
		try {
			ProfileEntity profile = profileService.getCurrentProfile();
			byte[] excelFile = excelService.generateExpenseExcel();
			emailService.sendEmailWithAttachment(
					profile.getEmail(),
					"Expense Report", """
							Hello %s,
							Please find attached your Expense Report.
							Regards,
							Money Manager
							""".formatted(profile.getFullName()),
					excelFile,
					"Expense_Report.xlsx"
			);
			return ResponseEntity.ok("Expense report emailed successfully.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().body("Failed to send expense email.");
		}
	}

}
