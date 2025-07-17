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

@ResourceProperties(hal = true, path = "pstats")
public interface PlaybookStatusResource extends PanacheEntityResource<PlaybookStatus, Long> {

    @MethodProperties(path = "all")
    List<PlaybookStatus> list(Page page, Sort sort);

    
    // @MethodProperties(path = "search/{id}")
    // List<Error_RCA> findByErrid(@PathParam("id") int id);
    @GET
    @Path("/search/{RCAid}")
   // @Produces("application/json")
    default List<PlaybookStatus> findByRCAid(@PathParam("RCAid") int RCAid) {
       // return Error_RCA.list("errorid = :id", id);
       
       return PlaybookStatus.find("RCA_ID = :RCAid", Collections.singletonMap("RCAid", RCAid)).list();
    }
    

    @MethodProperties(exposed = false)
    boolean delete(Long id); 
}
