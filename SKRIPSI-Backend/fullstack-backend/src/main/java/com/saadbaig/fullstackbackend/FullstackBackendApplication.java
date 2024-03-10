package com.saadbaig.fullstackbackend;

import java.util.Map;

import org.jose4j.jwk.HttpsJwks;
import org.jose4j.jwk.JsonWebKey;
import org.jose4j.jwk.JsonWebKeySet;
import org.jose4j.jwt.consumer.JwtConsumer;
import org.jose4j.jwt.consumer.JwtConsumerBuilder;
import org.jose4j.keys.resolvers.HttpsJwksVerificationKeyResolver;
import org.jose4j.keys.resolvers.JwksVerificationKeyResolver;
import org.jose4j.lang.JoseException;
import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.saadbaig.fullstackbackend.config.JWKJsonDeserializer;
import com.saadbaig.fullstackbackend.config.JWKJsonSerializer;

@SpringBootApplication

public class FullstackBackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(FullstackBackendApplication.class, args);
	}

	@Bean
	public ModelMapper modelMapper(){
		return new ModelMapper();
	}

	@Bean
	public ObjectMapper objectMapper() {
		var o = new ObjectMapper();

		var m = new SimpleModule("JwkSerializer");
		m.addSerializer(JsonWebKey.class, new JWKJsonSerializer());
		m.addDeserializer(JsonWebKey.class, new JWKJsonDeserializer());

		o.registerModule(m);

		return o;
	}

	@Bean
	public HttpsJwksVerificationKeyResolver jwksHttpsResolver() {
		RestTemplate req = new RestTemplate();
		var resOidc = req.getForObject("https://accounts.google.com/.well-known/openid-configuration", Map.class);
		return new HttpsJwksVerificationKeyResolver(new HttpsJwks(resOidc.get("jwks_uri").toString()));
	}

	@Bean
	public JwksVerificationKeyResolver jwksStaticResolver() throws JoseException {
		JsonWebKeySet jsonWebKeySet = new JsonWebKeySet(
				"{\"keys\":[{\"kty\":\"RSA\",\"n\":\"pOpd5-7RpMvcfBcSjqlTNYjGg3YRwYRV9T9k7eDOEWgMBQEs6ii3cjcuoa1oD6N48QJmcNvAme_ud985DV2mQpOaCUy22MVRKI8DHxAKGWzZO5yzn6otsN9Vy0vOEO_I-vnmrO1-1ONFuH2zieziaXCUVh9087dRkM9qaQYt6QJhMmiNpyrbods6AsU8N1jeAQl31ovHWGGk8axXNmwbx3dDZQhx-t9ZD31oF-usPhFZtM92mxgehDqi2kpvFmM0nzSVgPrOXlbDb9ztg8lclxKwnT1EtcwHUq4FeuOPQMtZ2WehrY10OvsqS5ml3mxXUQEXrtYfa5V1v4o3rWx9Ow\",\"alg\":\"RS256\",\"use\":\"sig\",\"kid\":\"6f9777a685907798ef794062c00b65d66c240b1b\",\"e\":\"AQAB\"},{\"use\":\"sig\",\"e\":\"AQAB\",\"kid\":\"08bf5c3772dd4e7a727a101bf520f6575cac326f\",\"n\":\"vcP1njqmR82oUndYDYxPF2HO-foOvDT8W8swcBYcgVQ0L1dPOlXz1lgQipJ0G7w9fXqilxsFHTs_MmXuGWQ2m3Wr16dpfPRFAN0ixj0ozzN_ZsF7OSdF6ZMZIJb3ObPt70i_emqEcd5ApITQ4PFvAhpZrBZCrW1z4aceoE1xC3rDV6qjA6pQr9u5A9J8Qj2a4LBG9mAPZCHQt4z50nhAVieKXhBoqKBoDplxj6yqzTTEUi1j-R0Z0NEJUIgt1_ErVsVMOWRKE6-BG39Zu9mvg2UAzxcitjOwa4n_spSgRleIliUJDNu-YpCEwj-5S_cX8DyHxCpvGp4ZBxPq1DUgqQ\",\"kty\":\"RSA\",\"alg\":\"RS256\"}]}");
		return new JwksVerificationKeyResolver(jsonWebKeySet.getJsonWebKeys());
	}

	@Bean
	public JwtConsumer jwtConsumer(JwksVerificationKeyResolver resolver) {
		return new JwtConsumerBuilder()
				// .setRequireExpirationTime()
				// .setAllowedClockSkewInSeconds(10)
				// .setRequireSubject()
				.setSkipAllValidators()
				.setVerificationKeyResolver(resolver)
				.build();
	}
}
