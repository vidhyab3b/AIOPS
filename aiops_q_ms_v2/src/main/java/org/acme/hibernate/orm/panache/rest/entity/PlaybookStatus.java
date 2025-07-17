package org.acme.hibernate.orm.panache.rest.entity;

import java.net.URI;
import java.time.LocalDate;
import java.util.Map;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.NamedQuery;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.core.Response;
import io.quarkus.hibernate.orm.panache.PanacheEntity;

@Entity(name = "Playbook_Status")
@NamedQuery(name = "findByRCAid", query = "from Playbook_Status where RCA_ID =:id")
public class PlaybookStatus extends PanacheEntity {
   // @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    public Long Error_ID;
    public Long RCA_ID;
    public String server_Name;
    public String execution_Status;
    public LocalDate Created_at;
    public LocalDate Modified_at;
    public PlaybookStatus findByRCAid(int id){
        return find("#findByRCAid", id).firstResult();
    }
    @POST
    @Transactional
    public  Response create(Error_RCA Error_RCA) {
        try {
            Error_RCA.persist();
            return Response.created(URI.create("/pstats/" + Error_RCA.id)).build();
        } catch (Exception e) {
            // TODO: handle exception
            return Response.created(URI.create("/pstats/" + Error_RCA.id)).build();
        }
       
    }

   

}   
