package owt.demo.presentation.controller;

/*
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.oidc.StandardClaimAccessor;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
*/
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
public class MainController {

    @GetMapping("/")
    public String publicPage() {
        return "Hello World 🤩";
    }

/*    
    @GetMapping("/")
    public String publicPage(Authentication authentication) {
        return "Hello World 🤩for " + getName(authentication);
    }

    @GetMapping("/private")
    public String privatePage(Authentication authentication){
        getName(authentication);
        return "Welcome " + getName(authentication);
    }

    private static String getName(Authentication authentication) {
        return Optional.of(authentication)
                .filter(OAuth2AuthenticationToken.class::isInstance)
                .map(OAuth2AuthenticationToken.class::cast)
                .map(OAuth2AuthenticationToken::getPrincipal)
                .map(DefaultOidcUser.class::cast)
                .map(StandardClaimAccessor::getEmail)
                .orElse(authentication.getName());
    }
*/
    @GetMapping("/preview")
    public String previewPage() {
        throw new UnsupportedOperationException("unsupported");
    }

}