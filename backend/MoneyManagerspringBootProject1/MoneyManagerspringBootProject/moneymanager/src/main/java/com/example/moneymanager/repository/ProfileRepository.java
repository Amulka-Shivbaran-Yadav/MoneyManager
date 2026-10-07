package com.example.moneymanager.repository;

import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;

import com.example.moneymanager.entity.ProfileEntity;

public interface ProfileRepository extends JpaRepository<ProfileEntity,Long> {
	//This interface will automatically provide CRUD operations for ProfileEntity
	//you can add custom query methods if needed
    
	//select * from tbl_profiles where email=?
	Optional<ProfileEntity> findByEmail(String email);
	
	//select * from tbl_profiles where activation_token=?
	Optional<ProfileEntity> findByActivationToken(String activationToken);
	
}
