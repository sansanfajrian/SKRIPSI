package com.skripsi.backend.controller;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Controller
@CrossOrigin
@RequestMapping("/login/oauth2/google")
public class GoogleOAuthIntegrationController {

  private static final String OAUTH_AUTHORIZATION_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";

  private static final String OAUTH_CLIENT_ID = "973235950542-gepk0k74mc1pqp49cktbcohf3s0qhqp5.apps.googleusercontent.com";

  private static final String OAUTH_CLIENT_SECRET = "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";

  private static final Set<String> session = new HashSet<>();

  @GetMapping("/init")
  public RedirectView initLogin(
      @RequestParam("redirect_uri") String redirectUri,
      HttpServletResponse httpServletResponse) {
    UUID sessionId = UUID.randomUUID();
    session.add(sessionId.toString());

    var oauthLoginUri = UriComponentsBuilder
        .fromUriString(OAUTH_AUTHORIZATION_ENDPOINT)
        .queryParam("client_id", OAUTH_CLIENT_ID)
        .queryParam("response_type", "code")
        .queryParam("scope", "openid email")
        .queryParam("redirect_uri", redirectUri)
        .queryParam("state", sessionId.toString())
        .build();
    return new RedirectView(oauthLoginUri.toUriString());
  }

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  private static final class OAuthCodeRequest {
    private String code;
    private String state;
    @JsonProperty("client_id")
    private String clientId = OAUTH_CLIENT_ID;
    @JsonProperty("client_secret")
    private String clientSecret = OAUTH_CLIENT_SECRET;
    @JsonProperty("redirect_uri")
    private String redirectUri;
    @JsonProperty("grant_type")
    private String grantType = "authorization_code";
  }

  private static final String OAUTH_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

  @PostMapping("/code")
  public Object getCode(@RequestBody OAuthCodeRequest body) {
    System.out.println(body);
    RestTemplate req = new RestTemplate();
    return req.postForEntity(OAUTH_TOKEN_ENDPOINT, body, Object.class);
  }

}
