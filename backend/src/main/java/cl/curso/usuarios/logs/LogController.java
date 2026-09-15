package cl.curso.usuarios.logs;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Endpoint para consultar los logs guardados en Mongo.
 *
 *   GET /api/logs                      -> los 100 ultimos eventos
 *   GET /api/logs?limite=20            -> los 20 ultimos
 *   GET /api/logs?tipo=LOGIN_FALLIDO   -> solo los intentos de login fallidos
 *   GET /api/logs?usuario=ana@x.cl     -> todo lo que hizo ese usuario
 *
 * Cae bajo la regla /api/** de SecurityConfig, o sea que exige JWT valido:
 * los logs son informacion sensible (rutas, IPs, quien entro y cuando).
 */
@RestController
@RequestMapping("/api/logs")
public class LogController {

    /** Tope duro: nadie se trae la coleccion entera de un viaje. */
    private static final int LIMITE_MAXIMO = 500;

    private final LogService logService;

    public LogController(LogService logService) {
        this.logService = logService;
    }

    @GetMapping
    public List<LogEvento> listar(
            @RequestParam(defaultValue = "100") int limite,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String usuario) {

        int tope = Math.min(Math.max(limite, 1), LIMITE_MAXIMO);

        if (tipo != null && !tipo.isBlank()) {
            return logService.ultimosPorTipo(tipo, tope);
        }
        if (usuario != null && !usuario.isBlank()) {
            return logService.ultimosPorUsuario(usuario, tope);
        }
        return logService.ultimos(tope);
    }
}
