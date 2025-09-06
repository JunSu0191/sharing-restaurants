package com.joeun.sharingrestaurants.dto.user;

import com.joeun.sharingrestaurants.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class UserResponse {
    private final Long id;
    private final String email;
    private final String name;
    private final String profileImage;

    // 엔티티 → DTO 변환 책임은 DTO 안에서
    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .profileImage(user.getProfileImage())
                .build();
    }
}
