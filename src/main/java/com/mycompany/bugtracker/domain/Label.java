package com.mycompany.bugtracker.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Label.
 */
@Document(collection = "label")
public class Label implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("value")
    private String value;

    @DBRef
    @Field("tickets")
    @JsonIgnoreProperties(value = { "project", "assignedTo", "labels" }, allowSetters = true)
    private Set<Ticket> tickets = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Label id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getValue() {
        return this.value;
    }

    public Label value(String value) {
        this.setValue(value);
        return this;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Set<Ticket> getTickets() {
        return this.tickets;
    }

    public void setTickets(Set<Ticket> tickets) {
        if (this.tickets != null) {
            this.tickets.forEach(i -> i.removeLabel(this));
        }
        if (tickets != null) {
            tickets.forEach(i -> i.addLabel(this));
        }
        this.tickets = tickets;
    }

    public Label tickets(Set<Ticket> tickets) {
        this.setTickets(tickets);
        return this;
    }

    public Label addTicket(Ticket ticket) {
        this.tickets.add(ticket);
        ticket.getLabels().add(this);
        return this;
    }

    public Label removeTicket(Ticket ticket) {
        this.tickets.remove(ticket);
        ticket.getLabels().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Label)) {
            return false;
        }
        return id != null && id.equals(((Label) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Label{" +
            "id=" + getId() +
            ", value='" + getValue() + "'" +
            "}";
    }
}
