package com.crm.config;

import com.crm.entity.*;
import com.crm.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Seeds the database with realistic demo data on first run so the
 * dashboard and tables are populated immediately after cloning.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private LeadRepository leadRepository;
    @Autowired private ContactRepository contactRepository;
    @Autowired private OpportunityRepository opportunityRepository;
    @Autowired private CaseTicketRepository caseTicketRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("Roshini V");
            admin.setRole("ADMIN");
            userRepository.save(admin);

            User rep = new User();
            rep.setUsername("rep");
            rep.setPassword(passwordEncoder.encode("rep123"));
            rep.setFullName("Sales Rep Demo");
            rep.setRole("SALES_REP");
            userRepository.save(rep);
        }

        if (leadRepository.count() == 0) {
            leadRepository.save(buildLead("Ava Thompson", "ava.t@northwind.com", "9876543210", "Northwind Traders", Lead.Status.NEW, Lead.Source.WEBSITE));
            leadRepository.save(buildLead("Liam Chen", "liam.chen@contoso.com", "9876500011", "Contoso Ltd", Lead.Status.CONTACTED, Lead.Source.REFERRAL));
            leadRepository.save(buildLead("Sofia Rossi", "sofia.r@globex.com", "9876500022", "Globex Corp", Lead.Status.QUALIFIED, Lead.Source.EVENT));
            leadRepository.save(buildLead("Noah Patel", "noah.p@initech.com", "9876500033", "Initech", Lead.Status.LOST, Lead.Source.COLD_CALL));
            leadRepository.save(buildLead("Emma Davis", "emma.d@umbrella.com", "9876500044", "Umbrella Inc", Lead.Status.NEW, Lead.Source.SOCIAL_MEDIA));
        }

        if (contactRepository.count() == 0) {
            contactRepository.save(buildContact("Ethan Wright", "ethan.w@acme.com", "9123456780", "Acme Corp", "VP of Sales"));
            contactRepository.save(buildContact("Olivia Brown", "olivia.b@stark.com", "9123456781", "Stark Industries", "Procurement Manager"));
            contactRepository.save(buildContact("James Miller", "james.m@wayne.com", "9123456782", "Wayne Enterprises", "CTO"));
            contactRepository.save(buildContact("Ishaan Verma", "ishaan.v@wipro.com", "9123456783", "Wipro", "IT Director"));
        }

        if (opportunityRepository.count() == 0) {
            opportunityRepository.save(buildOpp("Acme Corp - Cloud Suite Renewal", "Acme Corp", Opportunity.Stage.NEGOTIATION, "185000", LocalDate.now().plusDays(15), "Ethan Wright"));
            opportunityRepository.save(buildOpp("Stark Industries - Platform Expansion", "Stark Industries", Opportunity.Stage.PROPOSAL, "420000", LocalDate.now().plusDays(30), "Olivia Brown"));
            opportunityRepository.save(buildOpp("Wayne Enterprises - New Deployment", "Wayne Enterprises", Opportunity.Stage.CLOSED_WON, "560000", LocalDate.now().minusDays(5), "James Miller"));
            opportunityRepository.save(buildOpp("Wipro - Pilot Program", "Wipro", Opportunity.Stage.QUALIFICATION, "95000", LocalDate.now().plusDays(45), "Ishaan Verma"));
            opportunityRepository.save(buildOpp("Globex - Trial Rejected", "Globex Corp", Opportunity.Stage.CLOSED_LOST, "60000", LocalDate.now().minusDays(10), "Sofia Rossi"));
        }

        if (caseTicketRepository.count() == 0) {
            caseTicketRepository.save(buildCase("Login failures after SSO update", "Users report intermittent SSO login failures on the customer portal.", CaseTicket.Status.OPEN, CaseTicket.Priority.HIGH, "Ethan Wright"));
            caseTicketRepository.save(buildCase("Dashboard charts not loading", "Analytics dashboard shows a blank state for some accounts.", CaseTicket.Status.IN_PROGRESS, CaseTicket.Priority.MEDIUM, "Olivia Brown"));
            caseTicketRepository.save(buildCase("API rate limit clarification", "Customer requesting clarification on API rate limits for their tier.", CaseTicket.Status.CLOSED, CaseTicket.Priority.LOW, "James Miller"));
            caseTicketRepository.save(buildCase("Data export producing corrupt CSV", "Bulk export feature generates malformed CSV files for large datasets.", CaseTicket.Status.ESCALATED, CaseTicket.Priority.CRITICAL, "Ishaan Verma"));
        }
    }

    private Lead buildLead(String name, String email, String phone, String company, Lead.Status status, Lead.Source source) {
        Lead l = new Lead();
        l.setName(name); l.setEmail(email); l.setPhone(phone); l.setCompany(company);
        l.setStatus(status); l.setSource(source);
        return l;
    }

    private Contact buildContact(String name, String email, String phone, String company, String title) {
        Contact c = new Contact();
        c.setName(name); c.setEmail(email); c.setPhone(phone); c.setCompany(company); c.setTitle(title);
        return c;
    }

    private Opportunity buildOpp(String name, String account, Opportunity.Stage stage, String amount, LocalDate closeDate, String contact) {
        Opportunity o = new Opportunity();
        o.setName(name); o.setAccountName(account); o.setStage(stage);
        o.setAmount(new BigDecimal(amount)); o.setCloseDate(closeDate); o.setContactName(contact);
        return o;
    }

    private CaseTicket buildCase(String subject, String description, CaseTicket.Status status, CaseTicket.Priority priority, String contact) {
        CaseTicket c = new CaseTicket();
        c.setSubject(subject); c.setDescription(description); c.setStatus(status);
        c.setPriority(priority); c.setContactName(contact);
        return c;
    }
}
