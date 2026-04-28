package owt.demo.presentation.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * MVC controller responsible for serving the Angular SPA.
 *
 * <p>All routes that are handled client-side by the Angular router are forwarded
 * to {@code index.html} so that deep links and page refreshes work correctly.
 */
@Controller
public class MainController {

    /**
     * Forwards the root path to the Angular SPA entry point.
     *
     * @return a forward directive to {@code /index.html}
     */
    @RequestMapping("/")
    public String index() {
        return "forward:/index.html";
    }

    /**
     * Forwards all Angular client-side routes to the SPA entry point.
     *
     * <p>Covers {@code /login}, {@code /boats}, {@code /boats/**},
     * {@code /help}, and {@code /help/**}.
     *
     * @return a forward directive to {@code /index.html}
     */
    @RequestMapping(value = {
            "/login",
            "/boats",
            "/boats/**",
            "/help",
            "/help/**"
    })
    public String spa() {
        return "forward:/index.html";
    }

}

