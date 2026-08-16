package com.crm.controller;

import com.crm.dto.DashboardStats;
import com.crm.entity.CaseTicket;
import com.crm.entity.Lead;
import com.crm.entity.Opportunity;
import com.crm.repository.CaseTicketRepository;
import com.crm.repository.ContactRepository;
import com.crm.repository.LeadRepository;
import com.crm.repository.OpportunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired private LeadRepository leadRepository;
    @Autowired private ContactRepository contactRepository;
    @Autowired private OpportunityRepository opportunityRepository;
    @Autowired private CaseTicketRepository caseTicketRepository;

    @GetMapping("/stats")
    public DashboardStats getStats() {
        List<Lead> leads = leadRepository.findAll();
        List<Opportunity> opportunities = opportunityRepository.findAll();
        List<CaseTicket> cases = caseTicketRepository.findAll();

        Map<String, Long> leadsByStatus = leads.stream()
                .collect(Collectors.groupingBy(l -> l.getStatus().name(), LinkedHashMap::new, Collectors.counting()));

        Map<String, Long> opportunitiesByStage = opportunities.stream()
                .collect(Collectors.groupingBy(o -> o.getStage().name(), LinkedHashMap::new, Collectors.counting()));

        Map<String, Long> casesByStatus = cases.stream()
                .collect(Collectors.groupingBy(c -> c.getStatus().name(), LinkedHashMap::new, Collectors.counting()));

        Map<String, Long> casesByPriority = cases.stream()
                .collect(Collectors.groupingBy(c -> c.getPriority().name(), LinkedHashMap::new, Collectors.counting()));

        BigDecimal pipelineValue = opportunities.stream()
                .filter(o -> o.getStage() != Opportunity.Stage.CLOSED_WON && o.getStage() != Opportunity.Stage.CLOSED_LOST)
                .map(Opportunity::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal wonValue = opportunities.stream()
                .filter(o -> o.getStage() == Opportunity.Stage.CLOSED_WON)
                .map(Opportunity::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new DashboardStats(
                leads.size(),
                contactRepository.count(),
                opportunities.size(),
                cases.size(),
                pipelineValue,
                wonValue,
                leadsByStatus,
                opportunitiesByStage,
                casesByStatus,
                casesByPriority
        );
    }
}
