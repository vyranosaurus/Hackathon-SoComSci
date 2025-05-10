
package com.hackathon.socomsci.service;

import com.hackathon.socomsci.model.*;
import com.hackathon.socomsci.repository.*;
import java.util.Map;

public interface GeminiService {

    Map<String, Object> classifyAndScoreUrgency(String concern);
}