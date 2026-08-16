package com.crm.controller;

import com.crm.entity.CaseTicket;
import com.crm.service.CaseTicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cases")
public class CaseController {

    @Autowired
    private CaseTicketService caseTicketService;

    @GetMapping
    public List<CaseTicket> getAll() { return caseTicketService.getAll(); }

    @GetMapping("/{id}")
    public CaseTicket getById(@PathVariable Long id) { return caseTicketService.getById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CaseTicket create(@Valid @RequestBody CaseTicket caseTicket) { return caseTicketService.create(caseTicket); }

    @PutMapping("/{id}")
    public CaseTicket update(@PathVariable Long id, @Valid @RequestBody CaseTicket caseTicket) { return caseTicketService.update(id, caseTicket); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { caseTicketService.delete(id); }
}
