package com.crm.service;

import com.crm.entity.CaseTicket;
import com.crm.exception.ResourceNotFoundException;
import com.crm.repository.CaseTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CaseTicketService {

    @Autowired
    private CaseTicketRepository caseTicketRepository;

    public List<CaseTicket> getAll() {
        return caseTicketRepository.findAll();
    }

    public CaseTicket getById(Long id) {
        return caseTicketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Case not found with id " + id));
    }

    public CaseTicket create(CaseTicket caseTicket) {
        return caseTicketRepository.save(caseTicket);
    }

    public CaseTicket update(Long id, CaseTicket updated) {
        CaseTicket existing = getById(id);
        existing.setSubject(updated.getSubject());
        existing.setDescription(updated.getDescription());
        existing.setStatus(updated.getStatus());
        existing.setPriority(updated.getPriority());
        existing.setContactName(updated.getContactName());
        return caseTicketRepository.save(existing);
    }

    public void delete(Long id) {
        CaseTicket existing = getById(id);
        caseTicketRepository.delete(existing);
    }
}
