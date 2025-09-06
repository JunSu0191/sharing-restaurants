package com.joeun.sharingrestaurants.service;

import com.joeun.sharingrestaurants.entity.User;
import com.joeun.sharingrestaurants.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    }

    public void updateProfile(Long userId, String name, String profileImage) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        user.setName(name);
        user.setProfileImage(profileImage);
        userRepository.save(user);
    }
}
