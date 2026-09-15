package cl.curso.usuarios.logs;

import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

/**
 * Servicio que graba los eventos en MongoDB.
 *
 * Dos decisiones importantes, y las dos son la misma idea: EL LOG NUNCA PUEDE
 * ROMPER NI FRENAR LA APLICACION.
 *
 *   1. Se graba en un hilo aparte (el ExecutorService). Asi el usuario no
 *      espera a que Mongo responda para recibir su respuesta HTTP.
 *   2. Todo va dentro de un try/catch. Si Mongo esta caido, se escribe una
 *      advertencia en la consola y la vida sigue. Perder un log es molesto;
 *      perder un login por culpa del log seria inaceptable.
 *
 * Ese hilo unico ademas conserva el orden de los eventos y evita que una
 * avalancha de peticiones abra cientos de conexiones a Mongo.
 */
@Service
public class LogService {

    private static final Logger log = LoggerFactory.getLogger(LogService.class);

    // Tipos de evento. Constantes para no andar escribiendo el texto a mano.
    public static final String HTTP = "HTTP";
    public static final String LOGIN_OK = "LOGIN_OK";
    public static final String LOGIN_FALLIDO = "LOGIN_FALLIDO";
    public static final String LOGOUT = "LOGOUT";
    public static final String USUARIO_CREADO = "USUARIO_CREADO";
    public static final String USUARIO_ACTUALIZADO = "USUARIO_ACTUALIZADO";

    private final LogEventoRepository repositorio;

    /** Un solo hilo, en segundo plano (daemon) para no impedir que la JVM cierre. */
    private final ExecutorService escritor = Executors.newSingleThreadExecutor(tarea -> {
        Thread hilo = new Thread(tarea, "log-mongo");
        hilo.setDaemon(true);
        return hilo;
    });

    public LogService(LogEventoRepository repositorio) {
        this.repositorio = repositorio;
    }

    /** Graba un evento cualquiera (ya armado) sin bloquear a quien lo pide. */
    public void guardar(LogEvento evento) {
        if (evento.getFecha() == null) {
            evento.setFecha(Instant.now());
        }
        escritor.submit(() -> {
            try {
                repositorio.save(evento);
            } catch (Exception e) {
                // A proposito NO se relanza: un log perdido no tumba la app.
                log.warn("No se pudo grabar el log en Mongo: {}", e.getMessage());
            }
        });
    }

    /** Atajo para los eventos de negocio (login, alta de usuario, etc). */
    public void registrar(String tipo, String usuario, String detalle) {
        LogEvento evento = new LogEvento();
        evento.setTipo(tipo);
        evento.setUsuario(usuario);
        evento.setDetalle(detalle);
        guardar(evento);
    }

    // --- Lectura (la usa LogController) ---

    public List<LogEvento> ultimos(int limite) {
        return repositorio.findAllByOrderByFechaDesc(PageRequest.of(0, limite));
    }

    public List<LogEvento> ultimosPorTipo(String tipo, int limite) {
        return repositorio.findByTipoOrderByFechaDesc(tipo, PageRequest.of(0, limite));
    }

    public List<LogEvento> ultimosPorUsuario(String usuario, int limite) {
        return repositorio.findByUsuarioOrderByFechaDesc(usuario, PageRequest.of(0, limite));
    }

    /**
     * Al apagar la aplicacion, le damos unos segundos al hilo para que termine
     * de vaciar lo que tenga pendiente. Sin esto se perderian los ultimos logs.
     */
    @PreDestroy
    public void cerrar() {
        escritor.shutdown();
        try {
            escritor.awaitTermination(5, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
