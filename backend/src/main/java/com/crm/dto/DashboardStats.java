package com.crm.dto;

import java.math.BigDecimal;
import java.util.Map;

public class DashboardStats {
    private long totalLeads;
    private long totalContacts;
    private long totalOpportunities;
    private long totalCases;
    private BigDecimal pipelineValue;
    private BigDecimal wonValue;
    private Map<String, Long> leadsByStatus;
    private Map<String, Long> opportunitiesByStage;
    private Map<String, Long> casesByStatus;
    private Map<String, Long> casesByPriority;

    public DashboardStats(long totalLeads, long totalContacts, long totalOpportunities, long totalCases,
                           BigDecimal pipelineValue, BigDecimal wonValue,
                           Map<String, Long> leadsByStatus, Map<String, Long> opportunitiesByStage,
                           Map<String, Long> casesByStatus, Map<String, Long> casesByPriority) {
        this.totalLeads = totalLeads;
        this.totalContacts = totalContacts;
        this.totalOpportunities = totalOpportunities;
        this.totalCases = totalCases;
        this.pipelineValue = pipelineValue;
        this.wonValue = wonValue;
        this.leadsByStatus = leadsByStatus;
        this.opportunitiesByStage = opportunitiesByStage;
        this.casesByStatus = casesByStatus;
        this.casesByPriority = casesByPriority;
    }

    public long getTotalLeads() { return totalLeads; }
    public long getTotalContacts() { return totalContacts; }
    public long getTotalOpportunities() { return totalOpportunities; }
    public long getTotalCases() { return totalCases; }
    public BigDecimal getPipelineValue() { return pipelineValue; }
    public BigDecimal getWonValue() { return wonValue; }
    public Map<String, Long> getLeadsByStatus() { return leadsByStatus; }
    public Map<String, Long> getOpportunitiesByStage() { return opportunitiesByStage; }
    public Map<String, Long> getCasesByStatus() { return casesByStatus; }
    public Map<String, Long> getCasesByPriority() { return casesByPriority; }
}
