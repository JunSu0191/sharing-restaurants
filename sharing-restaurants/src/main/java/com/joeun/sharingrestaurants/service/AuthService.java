package com.joeun.sharingrestaurants.service;

import com.joeun.sharingrestaurants.dto.LoginRequest;
import com.joeun.sharingrestaurants.dto.LoginResponse;
import com.joeun.sharingrestaurants.dto.RegisterRequest;
import com.joeun.sharingrestaurants.entity.Provider;
import com.joeun.sharingrestaurants.entity.User;
import com.joeun.sharingrestaurants.repository.UserRepository;
import com.joeun.sharingrestaurants.util.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 회원가입
     */
    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setProvider(Provider.LOCAL);
        user.setProviderId(request.getEmail());

        userRepository.save(user);

        return login(new LoginRequest(request.getEmail(), request.getPassword()));
    }

    /**
     * 로그인
     */
    public LoginResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            String token = jwtTokenProvider.createToken(authentication.getName());

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new BadCredentialsException("사용자를 찾을 수 없습니다."));

            return LoginResponse.from(token, user);

        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
    }
}
