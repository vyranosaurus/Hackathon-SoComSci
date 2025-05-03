package com.hackathon.socomsci.repository;

import com.hackathon.socomsci.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> 
{
} 