package com.crm.repository;

import com.crm.entity.CaseTicket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaseTicketRepository extends JpaRepository<CaseTicket, Long> {
}
