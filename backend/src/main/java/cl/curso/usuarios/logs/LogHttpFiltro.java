package cl.curso.usuarios.logs;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;

/**
 * Graba en Mongo UNA linea por cada peticion HTTP que entra al backend.
 *
 * Va montado como el filtro MAS EXTERNO de la cadena (ver LogConfig), asi que
 * ve absolutamente todo: las peticiones que el filtro de cifrado rechaza, los
 * 401 de Spring Security y las que llegan al controlador. Y como envuelve al
 * resto, la duracion que mide es el tiempo REAL de la peticion completa.
 *
 * Lo que NO se graba, a proposito: el cuerpo de la peticion. Ahi viajan las
 * contrasenas. Un log jamas debe guardar credenciales.
 */
public class LogHttpFiltro extends OncePerRequestFilter {

    private final LogService logService;

    /**
     * Recibe el servicio por constructor. Este filtro NO lleva @Component: lo
     * crea y lo registra LogConfig, igual que se hace con CifradoFiltro, porque
     * necesita un orden concreto dentro de la cadena.
     */
    public LogHttpFiltro(LogService logService) {
        this.logService = logService;
    }

    /**
     * Nombre del atributo donde JwtAuthFilter deja el email del usuario ya
     * autenticado. No se puede leer del SecurityContextHolder al volver, porque
     * para entonces Spring Security ya lo limpio.
     */
    public static final String ATRIBUTO_USUARIO = "logUsuario";

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        long inicio = System.nanoTime();

        try {
            filterChain.doFilter(request, response);
        } finally {
            // En el finally: si la peticion revienta, el log se graba igual.
            long duracionMs = (System.nanoTime() - inicio) / 1_000_000;
            grabar(request, response, duracionMs);
        }
    }

    /**
     * El preflight OPTIONS del navegador es ruido puro: por cada peticion real
     * habria dos lineas en la coleccion. Lo dejamos fuera.
     */
    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
        return "OPTIONS".equalsIgnoreCase(request.getMethod());
    }

    private void grabar(HttpServletRequest request, HttpServletResponse response, long duracionMs) {
        LogEvento evento = new LogEvento();
        evento.setFecha(Instant.now());
        evento.setTipo(LogService.HTTP);
        evento.setMetodo(request.getMethod());
        evento.setRuta(request.getRequestURI());
        evento.setEstado(response.getStatus());
        evento.setDuracionMs(duracionMs);
        evento.setIp(ipCliente(request));
        evento.setUserAgent(request.getHeader("User-Agent"));

        Object usuario = request.getAttribute(ATRIBUTO_USUARIO);
        if (usuario != null) {
            evento.setUsuario(usuario.toString());
        }

        logService.guardar(evento);
    }

    /**
     * Detras de un nginx o un balanceador, request.getRemoteAddr() devuelve la
     * IP del proxy, no la del cliente. X-Forwarded-For trae la real (la primera
     * de la lista) cuando el proxy la agrega.
     */
    private String ipCliente(HttpServletRequest request) {
        String reenviada = request.getHeader("X-Forwarded-For");
        if (reenviada != null && !reenviada.isBlank()) {
            return reenviada.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
