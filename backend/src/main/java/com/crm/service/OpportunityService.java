package com.crm.service;

import com.crm.entity.Opportunity;
import com.crm.exception.ResourceNotFoundException;
import com.crm.repository.OpportunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OpportunityService {

    @Autowired
    private OpportunityRepository opportunityRepository;

    public List<Opportunity> getAll() {
        return opportunityRepository.findAll();
    }

    public Opportunity getById(Long id) {
        return opportunityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Opportunity not found with id " + id));
    }

    public Opportunity create(Opportunity opportunity) {
        return opportunityRepository.save(opportunity);
    }

    public Opportunity update(Long id, Opportunity updated) {
        Opportunity existing = getById(id);
        existing.setName(updated.getName());
        existing.setAccountName(updated.getAccountName());
        existing.setStage(updated.getStage());
        existing.setAmount(updated.getAmount());
        existing.setCloseDate(updated.getCloseDate());
        existing.setContactName(updated.getContactName());
        return opportunityRepository.save(existing);
    }

    public void delete(Long id) {
        Opportunity existing = getById(id);
        opportunityRepository.delete(existing);
    }
}
