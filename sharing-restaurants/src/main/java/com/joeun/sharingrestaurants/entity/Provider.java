package com.joeun.sharingrestaurants.entity;

public enum Provider {
    GOOGLE("google"),
    NAVER("naver"),
    KAKAO("kakao"),
    LOCAL("local");

    private final String value;

    Provider(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}