package org.acme.hibernate.orm.panache.rest.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
//import jakarta.persistence.NamedQuery;

import io.quarkus.hibernate.orm.panache.PanacheEntity;

@Entity(name = "Error_Table")
//@NamedQuery(name = "PersonForEntity.containsInName", query = "from PersonForEntity where name like CONCAT('%', CONCAT(:name, '%'))")
public class Error_Table extends PanacheEntity {
    public Long id;
    public String Server_Name;
    public String Error_Message;
    public LocalDate Created_at;
    public String Status;
}
