package cl.curso.usuarios.logs;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio de logs. Es el gemelo de UsuarioRepository, pero contra Mongo:
 * en vez de JpaRepository extiende MongoRepository.
 *
 * Igual que en JPA, Spring implementa los metodos solo a partir del NOMBRE:
 * findByTipo... genera la consulta {"tipo": ...} sin que escribamos nada.
 */
@Repository
public interface LogEventoRepository extends MongoRepository<LogEvento, String> {

    /** Ultimos eventos, del mas nuevo al mas viejo (el Pageable pone el limite). */
    List<LogEvento> findAllByOrderByFechaDesc(Pageable pageable);

    /** Lo mismo, pero filtrando por tipo (HTTP, LOGIN_OK, ...). */
    List<LogEvento> findByTipoOrderByFechaDesc(String tipo, Pageable pageable);

    /** Todo lo que hizo un usuario. Util para auditoria. */
    List<LogEvento> findByUsuarioOrderByFechaDesc(String usuario, Pageable pageable);
}
