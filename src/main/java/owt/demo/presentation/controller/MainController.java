package owt.demo.presentation.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainController {

    @RequestMapping("/")
    public String index() {
        return "forward:/index.html";
    }

    /**
     * Forward all non-API, non-asset routes to index.html so Angular's
     * client-side router handles deep links and page refreshes correctly.
     */
    @RequestMapping(value = {
            "/login",
            "/boats",
            "/boats/**"
    })
    public String spa() {
        return "forward:/index.html";
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