package com.myApp.feedbackapp.service;

import com.myApp.feedbackapp.model.Feedback;
import com.myApp.feedbackapp.model.User;
import com.myApp.feedbackapp.util.ApiKeyManager;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {
    private Map<String, User> users = new HashMap<>(); // Stores registered users
    private Map<String, List<Feedback>> feedbackStore = new HashMap<>(); // User feedbacks
    private int feedbackIdCounter = 100000;

    // User Registration
    public boolean register(User user) {
        if (users.containsKey(user.getUsername())) {
            return false; // Username already exists
        }
        users.put(user.getUsername(), user);
        feedbackStore.put(user.getUsername(), new ArrayList<>());
        return true;
    }

    // User Auth
    public boolean authenticate(String username, String password) {
        return users.containsKey(username) && users.get(username).getPassword().equals(password);
    }

    // Submit Feedback
    public Feedback addFeedback(String username, String content) {
        Integer id = feedbackIdCounter++;
        Feedback feedback = new Feedback(id, username, content);
        feedbackStore.get(username).add(feedback);
        return feedback;
    }

    // Fetch User's Feedback
    public List<Feedback> getFeedbacks(String username) {
        return feedbackStore.getOrDefault(username, new ArrayList<>());
    }

    // Edit Feedback
    public boolean editFeedback(String username, String feedbackId, String newContent) {
        List<Feedback> feedbacks = feedbackStore.get(username);
        if (feedbacks == null) {
            return false;  // No feedback for the user
        }
        System.out.println("feedback from edit file :"+feedbacks);
        for (Feedback feedback : feedbacks) {
            System.out.println("feedbacke 11 : "+feedback);
            if (feedback.getId().equals(Integer.parseInt(feedbackId))) {
                feedback.setContent(newContent);
                System.out.println("this start to run::::");
                return true;
            }
        }
        return false;
    }

    // Delete Feedback
    public boolean deleteFeedback(String username, String feedbackId) {
        return feedbackStore.get(username).removeIf(fb -> fb.getId().equals(Integer.parseInt(feedbackId)));
    }

    // Helper method to retrieve username from API key
    public String getUsernameByApiKey(String apiKey) {
        return ApiKeyManager.userApiKeys.entrySet().stream()
                .filter(entry -> entry.getValue().equals(apiKey))
                .map(entry -> entry.getKey())
                .findFirst()
                .orElse(null);
    }
}
