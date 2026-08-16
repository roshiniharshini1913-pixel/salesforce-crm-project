package com.crm.service;

import com.crm.entity.Contact;
import com.crm.exception.ResourceNotFoundException;
import com.crm.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {

    @Autowired
    private ContactRepository contactRepository;

    public List<Contact> getAll() {
        return contactRepository.findAll();
    }

    public Contact getById(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id " + id));
    }

    public Contact create(Contact contact) {
        return contactRepository.save(contact);
    }

    public Contact update(Long id, Contact updated) {
        Contact existing = getById(id);
        existing.setName(updated.getName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setCompany(updated.getCompany());
        existing.setTitle(updated.getTitle());
        return contactRepository.save(existing);
    }

    public void delete(Long id) {
        Contact existing = getById(id);
        contactRepository.delete(existing);
    }
}
