package com.crm.crm_backend.lead;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = "http://localhost:5173")
public class LeadController {

    private final LeadRepository leadRepository;

    public LeadController(LeadRepository leadRepository) {
        this.leadRepository = leadRepository;
    }

    @GetMapping
    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }

    @PostMapping
    public Lead addLead(@RequestBody Lead lead) {
        return leadRepository.save(lead);
    }

    @GetMapping("/{id}")
    public Lead getLeadById(@PathVariable Long id) {
        return leadRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Lead updateLead(
            @PathVariable Long id,
            @RequestBody Lead updatedLead) {

        return leadRepository.findById(id)
                .map(lead -> {
                    lead.setName(updatedLead.getName());
                    lead.setEmail(updatedLead.getEmail());
                    lead.setPhone(updatedLead.getPhone());
                    lead.setCompany(updatedLead.getCompany());
                    lead.setStatus(updatedLead.getStatus());
                    lead.setSalesRep(updatedLead.getSalesRep());

                    return leadRepository.save(lead);
                })
                .orElse(null);
    }

    @DeleteMapping("/{id}")
    public String deleteLead(@PathVariable Long id) {

        if (leadRepository.existsById(id)) {
            leadRepository.deleteById(id);
            return "Lead deleted successfully";
        }

        return "Lead not found";
    }
}