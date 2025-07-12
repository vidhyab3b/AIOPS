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

@Entity(name = "Error_RCA")
@NamedQuery(name = "findByErrid", query = "from Error_RCA where errorid =:id")
public class Error_RCA extends PanacheEntity {
   // @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    public Long errorid;
    public String prompt;
    public String ai_response;
    public String ansible_playbook;
    public LocalDate created_at;
    public Error_RCA findByErrid(int id){
        return find("#findByErrid", id).firstResult();
    }
    @POST
    @Transactional
    public  Response create(Error_RCA Error_RCA) {
        try {
            Error_RCA.persist();
            return Response.created(URI.create("/rcas/" + Error_RCA.id)).build();
        } catch (Exception e) {
            // TODO: handle exception
            return Response.created(URI.create("/rcas/" + Error_RCA.id)).build();
        }
       
    }

   

}   
