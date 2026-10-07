package com.example.moneymanager.service;

import java.io.ByteArrayInputStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
	
	
	
	 private final JavaMailSender mailSender;

	    @Value("${spring.mail.properties.mail.smtp.from}")
	    private String fromEmail;

	    // Simple Email
	    public void sendEmail(String to, String subject, String body) {
	        try {

	            MimeMessage message = mailSender.createMimeMessage();

	            MimeMessageHelper helper = new MimeMessageHelper(message, false);

	            helper.setFrom(fromEmail);
	            helper.setTo(to);
	            helper.setSubject(subject);
	            helper.setText(body);

	            mailSender.send(message);

	        } catch (Exception e) {
	            throw new RuntimeException("Email sending failed", e);
	        }
	    }

	    // Email with Attachment
	    public void sendEmailWithAttachment(
	            String to,
	            String subject,
	            String body,
	            byte[] attachment,
	            String fileName) {

	        try {

	            MimeMessage message = mailSender.createMimeMessage();

	            MimeMessageHelper helper =
	                    new MimeMessageHelper(message, true);

	            helper.setFrom(fromEmail);
	            helper.setTo(to);
	            helper.setSubject(subject);
	            helper.setText(body);

	            helper.addAttachment(fileName, new InputStreamSource() {
	                @Override
	                public java.io.InputStream getInputStream() {
	                    return new ByteArrayInputStream(attachment);
	                }
	            });

	            mailSender.send(message);

	        } catch (Exception e) {
	            throw new RuntimeException("Email sending with attachment failed", e);
	        }
	    }
	
//	private final JavaMailSender mailSender;
//	
//	@Value("${spring.mail.properties.mail.smtp.from}")
//	private String fromEmail;
//	
//	public void sendEmail(String to,String subject,String body) {
//		//Implementation for sending mail
//		//This could use JavaMailSender to send the email	
//		try
//		{
//			SimpleMailMessage message=new SimpleMailMessage();
//			message.setFrom(fromEmail);
//			message.setTo(to);
//			message.setSubject(subject);
//			message.setText(body);
//		    mailSender.send(message);
//		}catch (Exception e) {
//			   e.printStackTrace();   // Prints the full error
//			    throw new RuntimeException("Email sending failed", e);
//		}
//	}

}
