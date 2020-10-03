package com.tweetloader.hashtag.config;

import java.io.IOException;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.Session;
import com.datastax.driver.mapping.DefaultNamingStrategy;
import com.datastax.driver.mapping.DefaultPropertyMapper;
import com.datastax.driver.mapping.MappingConfiguration;
import com.datastax.driver.mapping.MappingManager;
import com.datastax.driver.mapping.NamingConventions;
import com.datastax.driver.mapping.PropertyMapper;

@Configuration
public class CassandraConfig {
 
  @Bean
  public Cluster cluster(
      @Value("${cassandra.host:127.0.0.1}") String host,
      @Value("${cassandra.cluster.name:cluster}") String clusterName,
      @Value("${cassandra.port:9042}") int port) {
    return Cluster.builder()
        .addContactPoint(host)
        .withPort(port)
        .withClusterName(clusterName)
        .build();
  }
   
  @Bean
  public Session session(Cluster cluster, @Value("${cassandra.keyspace}") String keyspace)
      throws IOException {
    final Session session = cluster.connect();
   setupKeyspace(session, keyspace);
    return session;
  }
 
  private void setupKeyspace(Session session, String keyspace) throws IOException {
    session.execute("USE " + keyspace);
    //    String[] statements = split(IOUtils.toString(getClass().getResourceAsStream("/cql/setup.cql")), ";");
    //    Arrays.stream(statements).map(statement -> normalizeSpace(statement) + ";").forEach(session::execute);
  }
 
  @Bean
  public MappingManager mappingManager(Session session) {
    final PropertyMapper propertyMapper =
        new DefaultPropertyMapper()
            .setNamingStrategy(new DefaultNamingStrategy(NamingConventions.LOWER_CAMEL_CASE, NamingConventions.LOWER_SNAKE_CASE));
    final MappingConfiguration configuration =
        MappingConfiguration.builder().withPropertyMapper(propertyMapper).build();
    return new MappingManager(session, configuration);
  }
}