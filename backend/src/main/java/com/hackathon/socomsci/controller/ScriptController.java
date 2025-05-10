package com.hackathon.socomsci.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/scripts")
public class ScriptController {

    @PostMapping("/run")
    public Map<String, Object> runScript(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            String scriptCommand = request.get("command");
            if (scriptCommand == null || scriptCommand.isEmpty()) {
                response.put("success", false);
                response.put("error", "No command provided");
                return response;
            }

            if (scriptCommand.contains("rm") || scriptCommand.contains("format")) {
                response.put("success", false);
                response.put("error", "Potentially dangerous command rejected");
                return response;
            }

            Process process = Runtime.getRuntime().exec(scriptCommand);

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
            StringBuilder error = new StringBuilder();
            while ((line = errorReader.readLine()) != null) {
                error.append(line).append("\n");
            }

            int exitCode = process.waitFor();

            response.put("success", exitCode == 0);
            response.put("output", output.toString());
            if (exitCode != 0) {
                response.put("error", error.toString());
                response.put("exitCode", exitCode);
            }

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }

        return response;
    }
}