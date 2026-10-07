package com.example.moneymanager.service;

import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.moneymanager.dto.AuthDTO;
import com.example.moneymanager.dto.ProfileDTO;
import com.example.moneymanager.entity.ProfileEntity;
import com.example.moneymanager.repository.ProfileRepository;
import com.example.moneymanager.util.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {
	
	 private static final Logger logger = LoggerFactory.getLogger(ProfileService.class);
	 
	private final EmailService emailService;
	private final ProfileRepository profileRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final JwtUtil jwtUtil;
	
	@Value("${app.activation.url}")
	private String activationURL;
	
	
	public ProfileDTO registerProfile(ProfileDTO profileDTO) {
		//here you would typically convert ProfileDTO to ProfileEntity
		//save it using profileRepository and then convert it back to ProfileDTO
	     ProfileEntity newProfile=toEntity(profileDTO);
	     newProfile.setActivationToken(UUID.randomUUID().toString());
		 newProfile=profileRepository.save(newProfile);
	    
		 //send activation token
		 String activationLink=activationURL+"/api/v1.0/activate?token=" +newProfile.getActivationToken();
		
		// Print activation link to console
		  //  System.out.println("Activation Link: " + activationLink);
		 
		 logger.info("Activation Link : {} ",activationLink);
		 
		 String subject="Activate your Money Manager account";
		 String body="Click on the following link to activate your account: " + activationLink;
		 emailService.sendEmail(newProfile.getEmail(), subject, body);
		 return toDTO(newProfile);
	}
	
	public ProfileEntity toEntity(ProfileDTO profileDTO)
	{
		return ProfileEntity.builder()
				.id(profileDTO.getId())
				.fullName(profileDTO.getFullName())
				.email(profileDTO.getEmail())
				.password(passwordEncoder.encode(profileDTO.getPassword()))
				.profileImageUrl(profileDTO.getProfileImageUrl())
				.createdAt(profileDTO.getCreatedAt())
				.updatedAt(profileDTO.getUpdatedAt())
				.build();
	}
	
	
	public ProfileDTO toDTO(ProfileEntity profileEntity)
	{
		return ProfileDTO.builder()
				.id(profileEntity.getId())
				.fullName(profileEntity.getFullName())
				.email(profileEntity.getEmail())
				.profileImageUrl(profileEntity.getProfileImageUrl())
				.createdAt(profileEntity.getCreatedAt())
				.updatedAt(profileEntity.getUpdatedAt())
				.build();
	}
	
	public boolean activateProfile(String activationToken)
	{
		return profileRepository.findByActivationToken(activationToken)
				.map(profile -> {
					
					profile.setIsActive(true);
			        profileRepository.save(profile);
			        return true;
				})
				.orElse(false);
	}
	
	public boolean isAccountActive(String email)
	{
		return profileRepository.findByEmail(email)
				.map(ProfileEntity::getIsActive)
				.orElse(false);
	}
	
	public ProfileEntity getCurrentProfile() {
		Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
		return profileRepository.findByEmail(authentication.getName())
		.orElseThrow(() -> new UsernameNotFoundException("Profile not found with email: "  + authentication.getName()));
		
	}
	
	public ProfileDTO getPublicProfile(String email) {
		ProfileEntity currentUser=null;
		if(email==null) {
			currentUser=getCurrentProfile();
		}
		else {
			currentUser=profileRepository.findByEmail(email)
			.orElseThrow(() -> new UsernameNotFoundException("Profile not found with email " + email));
		}
		
		return ProfileDTO.builder()
				.id(currentUser.getId())
				.fullName(currentUser.getFullName())
				.email(currentUser.getEmail())
				.profileImageUrl(currentUser.getProfileImageUrl())
				.createdAt(currentUser.getCreatedAt())
				.updatedAt(currentUser.getUpdatedAt())
				.build();
		
	}

	public Map<String, Object> authenticateAndGenerateToken(AuthDTO authDTO) {
		try {
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authDTO.getEmail(), authDTO.getPassword()));
			//Generate JWT token
			String token=jwtUtil.generateToken(authDTO.getEmail());
			return Map.of(
					"token",token,
					"user",getPublicProfile(authDTO.getEmail())
					);
			
		}catch(Exception e) {
			throw new RuntimeException("Invalid email or password");
		}
	}
	
	

}
