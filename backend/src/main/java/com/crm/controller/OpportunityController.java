package com.crm.controller;

import com.crm.entity.Opportunity;
import com.crm.service.OpportunityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/opportunities")
public class OpportunityController {

    @Autowired
    private OpportunityService opportunityService;

    @GetMapping
    public List<Opportunity> getAll() { return opportunityService.getAll(); }

    @GetMapping("/{id}")
    public Opportunity getById(@PathVariable Long id) { return opportunityService.getById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Opportunity create(@Valid @RequestBody Opportunity opportunity) { return opportunityService.create(opportunity); }

    @PutMapping("/{id}")
    public Opportunity update(@PathVariable Long id, @Valid @RequestBody Opportunity opportunity) { return opportunityService.update(id, opportunity); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { opportunityService.delete(id); }
}
