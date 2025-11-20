package com.grief.backend.auth.provider;

import java.nio.charset.StandardCharsets;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import com.grief.backend.auth.AuthProvider;
import com.grief.backend.dto.AuthUser;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class SupabaseAuthProvider implements AuthProvider {

    private final JwtDecoder decoder;

    public SupabaseAuthProvider(@Value("${supabase.jwt.secret}") String jwtSecret) {
        SecretKeySpec secretKey = new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        this.decoder = NimbusJwtDecoder.withSecretKey(secretKey).macAlgorithm(MacAlgorithm.HS256).build();
    }


    @Override
    public AuthUser verifyToken(String token) {
        log.info("Verifying token with Supabase JWKs URL");
        Jwt jwt = decoder.decode(token);
        log.info("Verified JWT for subject: {}", jwt.getSubject());

        return new AuthUser(
                jwt.getSubject(),
                jwt.getClaimAsString("email"),
                jwt.getClaimAsString("name")
        );
    }
}
