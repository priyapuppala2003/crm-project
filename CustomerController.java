package com.crm.crm_backend.customer;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerRepository customerRepository;

    public CustomerController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @PostMapping
    public Customer addCustomer(@RequestBody Customer customer) {
        return customerRepository.save(customer);
    }

    @GetMapping("/{id}")
    public Customer getCustomerById(@PathVariable Long id) {
        return customerRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Customer updateCustomer(
            @PathVariable Long id,
            @RequestBody Customer updatedCustomer) {

        return customerRepository.findById(id)
                .map(customer -> {

                    customer.setName(updatedCustomer.getName());
                    customer.setEmail(updatedCustomer.getEmail());
                    customer.setPhone(updatedCustomer.getPhone());
                    customer.setCompany(updatedCustomer.getCompany());
                    customer.setSalesRep(updatedCustomer.getSalesRep());

                    return customerRepository.save(customer);
                })
                .orElse(null);
    }

    @DeleteMapping("/{id}")
    public String deleteCustomer(@PathVariable Long id) {

        if (customerRepository.existsById(id)) {
            customerRepository.deleteById(id);
            return "Customer deleted successfully";
        }

        return "Customer not found";
    }
}