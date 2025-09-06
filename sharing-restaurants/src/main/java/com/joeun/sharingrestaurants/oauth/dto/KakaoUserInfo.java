package com.joeun.sharingrestaurants.oauth.dto;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public class KakaoUserInfo implements OAuth2UserInfo {
    private final Map<String, Object> attributes;

    public KakaoUserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    @Override
    public String getProviderId() {
        return attributes.get("id").toString();
    }

    @Override
    public String getProvider() {
        return "kakao";
    }

    @Override
    public String getEmail() {
        // 실제 이메일이 있으면 사용, 없으면 카카오 ID로 고유 이메일 생성
        Map<String, Object> account = (Map<String, Object>) attributes.get("kakao_account");
        if (account != null && account.get("email") != null) {
            return (String) account.get("email");
        }

        // 이메일 권한이 없을 때 카카오 ID로 고유 식별자 생성
        return "kakao_" + attributes.get("id") + "@kakao.local";
    }

    @Override
    public String getName() {
        // properties에서 닉네임 추출 (기본 권한)
        Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");
        if (properties != null && properties.get("nickname") != null) {
            return (String) properties.get("nickname");
        }

        // properties가 없으면 kakao_account의 profile에서 추출
        Map<String, Object> account = (Map<String, Object>) attributes.get("kakao_account");
        if (account != null) {
            Map<String, Object> profile = (Map<String, Object>) account.get("profile");
            if (profile != null && profile.get("nickname") != null) {
                return (String) profile.get("nickname");
            }
        }

        // 모든 방법이 실패하면 기본값 반환
        return "카카오사용자_" + attributes.get("id");
    }
}