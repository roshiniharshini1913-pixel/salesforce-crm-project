package com.crm.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Entity
@Table(name = "leads")
public class Lead {

    public enum Status { NEW, CONTACTED, QUALIFIED, LOST }
    public enum Source { WEBSITE, REFERRAL, SOCIAL_MEDIA, EVENT, COLD_CALL, OTHER }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @Email
    private String email;

    private String phone;

    @NotBlank
    private String company;

    @Enumerated(EnumType.STRING)
    private Status status = Status.NEW;

    @Enumerated(EnumType.STRING)
    private Source source = Source.WEBSITE;

    private LocalDate createdDate = LocalDate.now();

    public Lead() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public Source getSource() { return source; }
    public void setSource(Source source) { this.source = source; }
    public LocalDate getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDate createdDate) { this.createdDate = createdDate; }
}
