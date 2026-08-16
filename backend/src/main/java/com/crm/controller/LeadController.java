package com.crm.controller;

import com.crm.entity.Lead;
import com.crm.service.LeadService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
public class LeadController {

    @Autowired
    private LeadService leadService;

    @GetMapping
    public List<Lead> getAll() { return leadService.getAll(); }

    @GetMapping("/{id}")
    public Lead getById(@PathVariable Long id) { return leadService.getById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Lead create(@Valid @RequestBody Lead lead) { return leadService.create(lead); }

    @PutMapping("/{id}")
    public Lead update(@PathVariable Long id, @Valid @RequestBody Lead lead) { return leadService.update(id, lead); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { leadService.delete(id); }
}
