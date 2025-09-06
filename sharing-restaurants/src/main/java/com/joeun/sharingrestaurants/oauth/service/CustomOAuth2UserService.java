package com.joeun.sharingrestaurants.oauth.service;

import com.joeun.sharingrestaurants.entity.Provider;
import com.joeun.sharingrestaurants.entity.User;
import com.joeun.sharingrestaurants.oauth.dto.GoogleUserInfo;
import com.joeun.sharingrestaurants.oauth.dto.KakaoUserInfo;
import com.joeun.sharingrestaurants.oauth.dto.NaverUserInfo;
import com.joeun.sharingrestaurants.oauth.dto.OAuth2UserInfo;
import com.joeun.sharingrestaurants.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("=== OAuth2 로그인 진입 ===");
        log.info("Client Registration ID: {}", userRequest.getClientRegistration().getRegistrationId());
        log.info("Access Token: {}", userRequest.getAccessToken().getTokenValue());

        OAuth2User oAuth2User = super.loadUser(userRequest);
        log.info("oAuth2User Attributes: {}", oAuth2User.getAttributes());

        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        // OAuth2UserInfo 선택
        OAuth2UserInfo userInfo;
        if (registrationId.equals("kakao")) {
            userInfo = new KakaoUserInfo(oAuth2User.getAttributes());
        } else if (registrationId.equals("google")) {
            userInfo = new GoogleUserInfo(oAuth2User.getAttributes());
        } else if (registrationId.equals("naver")) {
            userInfo = new NaverUserInfo(oAuth2User.getAttributes());
        } else {
            throw new OAuth2AuthenticationException("지원하지 않는 로그인 방식입니다.");
        }

        String providerId = userInfo.getProviderId();
        String email = userInfo.getEmail();
        String name = userInfo.getName();

        // DB 저장/조회
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            // 기존 사용자의 정보 업데이트
            user.setName(name);
            userRepository.save(user);
            log.info("기존 OAuth2 사용자 정보 업데이트: {}", email);
        } else {
            user = new User();
            user.setProvider(getProviderByRegistrationId(registrationId)); // 안전하게 Enum 매핑
            user.setProviderId(providerId);
            user.setEmail(email);
            user.setName(name);
            userRepository.save(user);
            log.info("새 OAuth2 사용자 등록: {}", email);
        }

        return oAuth2User;
    }

    // registrationId를 Provider enum으로 안전하게 변환
    private Provider getProviderByRegistrationId(String registrationId) {
        for (Provider provider : Provider.values()) {
            if (provider.getValue().equalsIgnoreCase(registrationId)) {
                return provider;
            }
        }
        throw new IllegalArgumentException("Unknown provider: " + registrationId);
    }
}
