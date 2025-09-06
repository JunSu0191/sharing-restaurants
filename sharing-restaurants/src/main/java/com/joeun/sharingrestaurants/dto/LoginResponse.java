package com.joeun.sharingrestaurants.dto;

import com.joeun.sharingrestaurants.dto.user.UserResponse;
import com.joeun.sharingrestaurants.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {
    private final String message;
    private final String token;
    private final UserResponse user;

    // 엔티티(User)와 토큰을 받아 LoginResponse 생성
    public static LoginResponse from(String token, User user) {
        return LoginResponse.builder()
                .message("로그인 성공") // 필요 없다면 제거 가능
                .token(token)
                .user(UserResponse.from(user))
                .build();
    }
}
