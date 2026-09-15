package cl.curso.usuarios.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "cl.curso.usuarios.repository")
@EnableMongoRepositories(basePackages = "cl.curso.usuarios.logs")
public class DatosConfig {
}
