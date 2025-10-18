package org.acme.hibernate.orm.panache.rest.entity;

import java.util.Collections;
import java.util.List;

import io.quarkus.hibernate.orm.rest.data.panache.PanacheEntityResource;
import io.quarkus.panache.common.Page;
import io.quarkus.panache.common.Sort;
import io.quarkus.rest.data.panache.MethodProperties;
import io.quarkus.rest.data.panache.ResourceProperties;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;

@ResourceProperties(hal = true, path = "my-errors")
public interface ErrorTableResource extends PanacheEntityResource<Error_Table, Long> {

    @MethodProperties(path = "all")
    List<Error_Table> list(Page page, Sort sort);

    @MethodProperties(exposed = false)
    boolean delete(Long id);

    @GET
    @Path("/open")
   // @Produces("application/json")
    default List<Error_Table> findOpen(@PathParam("eStatus") String eStatus) {
       // return Error_RCA.list("errorid = :id", id);
       eStatus="Open";
       return Error_Table.find("Status = :eStatus", Collections.singletonMap("eStatus", eStatus)).list();
    }
    @GET
    @Path("/closed")
   // @Produces("application/json")
    default List<Error_Table> findClosed(@PathParam("eStatus") String eStatus) {
       // return Error_RCA.list("errorid = :id", id);
       eStatus="Closed";
       return Error_Table.find("Status = :eStatus", Collections.singletonMap("eStatus", eStatus)).list();
    }
    
}
