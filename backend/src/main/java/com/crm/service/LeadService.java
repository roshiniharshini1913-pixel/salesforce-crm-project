package com.crm.service;

import com.crm.entity.Lead;
import com.crm.exception.ResourceNotFoundException;
import com.crm.repository.LeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeadService {

    @Autowired
    private LeadRepository leadRepository;

    public List<Lead> getAll() {
        return leadRepository.findAll();
    }

    public Lead getById(Long id) {
        return leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id " + id));
    }

    public Lead create(Lead lead) {
        return leadRepository.save(lead);
    }

    public Lead update(Long id, Lead updated) {
        Lead existing = getById(id);
        existing.setName(updated.getName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setCompany(updated.getCompany());
        existing.setStatus(updated.getStatus());
        existing.setSource(updated.getSource());
        return leadRepository.save(existing);
    }

    public void delete(Long id) {
        Lead existing = getById(id);
        leadRepository.delete(existing);
    }
}
