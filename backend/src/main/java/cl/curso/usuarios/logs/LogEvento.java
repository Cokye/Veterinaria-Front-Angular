package cl.curso.usuarios.logs;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * Un evento de log. Es a MongoDB lo que Usuario es a Oracle: la clase que
 * describe como se ve un registro guardado.
 *
 * Diferencia clave con JPA: aqui NO hay tabla ni columnas fijas. Mongo guarda
 * "documentos" JSON dentro de una coleccion; si manana agregas un campo mas a
 * esta clase, no hay que alterar nada en la base. Justamente por eso los logs
 * van en Mongo y los usuarios en Oracle: los logs son datos sueltos, de forma
 * variable y de mucho volumen; los usuarios son datos relacionales y estables.
 *
 * @Document -> coleccion "logs".
 * @Id       -> el _id del documento (Mongo lo genera solo, es un ObjectId).
 */
@Document(collection = "logs")
public class LogEvento {

    @Id
    private String id;

    /**
     * Cuando ocurrio. Se indexa porque casi toda consulta de logs es
     * "los ultimos N" u "hoy entre tal y tal hora": sin indice, Mongo tendria
     * que recorrer la coleccion entera.
     */
    @Indexed
    private Instant fecha;

    /** Que paso: HTTP, LOGIN_OK, LOGIN_FALLIDO, USUARIO_CREADO, ... */
    @Indexed
    private String tipo;

    /** Email del usuario autenticado, o null si la peticion era anonima. */
    private String usuario;

    // --- Datos de la peticion HTTP (null en los eventos de negocio) ---
    private String metodo;
    private String ruta;
    private Integer estado;
    private Long duracionMs;
    private String ip;
    private String userAgent;

    /** Texto libre para el detalle del evento. */
    private String detalle;

    public LogEvento() {
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Instant getFecha() { return fecha; }
    public void setFecha(Instant fecha) { this.fecha = fecha; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }

    public String getMetodo() { return metodo; }
    public void setMetodo(String metodo) { this.metodo = metodo; }

    public String getRuta() { return ruta; }
    public void setRuta(String ruta) { this.ruta = ruta; }

    public Integer getEstado() { return estado; }
    public void setEstado(Integer estado) { this.estado = estado; }

    public Long getDuracionMs() { return duracionMs; }
    public void setDuracionMs(Long duracionMs) { this.duracionMs = duracionMs; }

    public String getIp() { return ip; }
    public void setIp(String ip) { this.ip = ip; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public String getDetalle() { return detalle; }
    public void setDetalle(String detalle) { this.detalle = detalle; }
}
