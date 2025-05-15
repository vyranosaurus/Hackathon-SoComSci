package com.hackathon.socomsci.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;

/**
 * Global CORS configuration for the application.
 * This ensures all controllers allow requests from the specified origins.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${spring.web.cors.allowed-origins:http://localhost:3000,https://weaid-production.up.railway.app}")
    private String[] allowedOrigins;
    
    /**
     * Configure Cross-Origin Resource Sharing (CORS) globally.
     */
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow specified origins
        if (allowedOrigins != null && allowedOrigins.length > 0) {
            config.setAllowedOrigins(Arrays.asList(allowedOrigins));
        } else {
            // Fallback if configuration is missing
            config.setAllowedOrigins(List.of("http://localhost:3000", "https://weaid-production.up.railway.app"));
        }
        
        // Allow common HTTP methods
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Allow all headers
        config.setAllowedHeaders(List.of("*"));
        
        // Allow credentials (cookies, authorization headers)
        config.setAllowCredentials(true);
        
        // How long the browser should cache the CORS configuration (in seconds)
        config.setMaxAge(3600L);
        
        // Apply this config to all paths
        source.registerCorsConfiguration("/**", config);

        config.addAllowedOrigin("*");
        config.setAllowCredentials(false);
        
        return new CorsFilter(source);
    }
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}