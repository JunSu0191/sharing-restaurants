package com.joeun.sharingrestaurants.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ProviderConverter implements AttributeConverter<Provider, String> {

    @Override
    public String convertToDatabaseColumn(Provider provider) {
        if (provider == null) {
            return null;
        }
        return provider.getValue();  // "kakao", "google", "naver", "local"
    }

    @Override
    public Provider convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        for (Provider p : Provider.values()) {
            if (p.getValue().equalsIgnoreCase(dbData)) {
                return p;
            }
        }
        throw new IllegalArgumentException("Unknown provider: " + dbData);
    }
}
