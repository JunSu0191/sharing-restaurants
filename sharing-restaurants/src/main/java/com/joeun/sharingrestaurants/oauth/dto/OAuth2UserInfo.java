package com.joeun.sharingrestaurants.oauth.dto;

public interface OAuth2UserInfo {
    String getProviderId();
    String getProvider();
    String getEmail();
    String getName();


}
