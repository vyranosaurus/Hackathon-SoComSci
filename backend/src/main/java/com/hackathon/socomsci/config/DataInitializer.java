package com.hackathon.socomsci.config;

import com.hackathon.socomsci.model.User;
import com.hackathon.socomsci.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository) 
    {
        return args -> {
            User user1 = new User("Renato Causing", "renato.causing@gmail.com");
            User user2 = new User("John Nathan Ramos", "johnnathanramos@gmail.com");
            User user3 = new User("Tung tung tung Sahur", "tungutntungsahur@gmail.com");
            
            userRepository.save(user1);
            userRepository.save(user2);
            userRepository.save(user3);
            
            System.out.println("Data initialized successfully");
        };
    }
} 