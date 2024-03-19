package com.skripsi.backend.config;

import java.io.IOException;
import java.util.Arrays;

import org.jose4j.jwt.consumer.JwtConsumer;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtConsumer jwtConsumer;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    try {
      var token = request.getHeader("Authorization").replace("Bearer ", "");
      System.out.println(token);

      var claims = jwtConsumer.processToClaims(token);
      System.out.println(claims);

      var ctx = SecurityContextHolder.getContext();
      var auth = new UsernamePasswordAuthenticationToken(claims.getSubject(), null, Arrays.asList());

      ctx.setAuthentication(auth);
      SecurityContextHolder.setContext(ctx);
    } catch (Exception err) {
      err.printStackTrace();
    }

    filterChain.doFilter(request, response);
  }

}
