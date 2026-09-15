package cl.curso.usuarios.logs;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Registra el filtro de logs en la cadena, y ANTES que todo lo demas.
 *
 * El orden final queda asi:
 *
 *   -300  LogHttpFiltro          <- cronometra y registra TODO
 *   -200  CifradoFiltro          <- descifra la entrada / cifra la salida
 *   -100  springSecurityFilterChain (JWT, CORS, autorizacion)
 *    ...  Spring MVC -> UsuarioController
 *
 * Al estar por fuera del cifrado, el log tambien registra las peticiones que
 * el propio cifrado rechaza (que son justo las que interesa ver).
 */
@Configuration
public class LogConfig {

    /** CifradoFiltro esta en -200; nos ponemos 100 mas afuera. */
    private static final int ORDEN_LOG = -300;

    @Bean
    public FilterRegistrationBean<LogHttpFiltro> registroLogHttpFiltro(LogService logService) {
        FilterRegistrationBean<LogHttpFiltro> registro = new FilterRegistrationBean<>();
        registro.setFilter(new LogHttpFiltro(logService));
        registro.addUrlPatterns("/*");
        registro.setOrder(ORDEN_LOG);
        registro.setName("logHttpFiltro");
        return registro;
    }
}
