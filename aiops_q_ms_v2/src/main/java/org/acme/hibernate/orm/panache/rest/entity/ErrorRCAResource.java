package org.acme.hibernate.orm.panache.rest.entity;

import java.net.URI;
import java.util.Collections;
import java.util.List;

import io.quarkus.hibernate.orm.rest.data.panache.PanacheEntityResource;
import io.quarkus.panache.common.Page;
import io.quarkus.panache.common.Sort;
import io.quarkus.rest.data.panache.MethodProperties;
import io.quarkus.rest.data.panache.ResourceProperties;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.Response;

@ResourceProperties(hal = true, path = "rcas")
public interface ErrorRCAResource extends PanacheEntityResource<Error_RCA, Long> {

    @MethodProperties(path = "all")
    List<Error_RCA> list(Page page, Sort sort);

    
    // @MethodProperties(path = "search/{id}")
    // List<Error_RCA> findByErrid(@PathParam("id") int id);
    @GET
    @Path("/search/{errorid}")
   // @Produces("application/json")
    default List<Error_RCA> findByErrid(@PathParam("errorid") int errorid) {
       // return Error_RCA.list("errorid = :id", id);
       
       return Error_RCA.find("errorid = :errorid", Collections.singletonMap("errorid", errorid)).list();
    }
    

    @MethodProperties(exposed = false)
    boolean delete(Long id); 
}
