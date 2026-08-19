package com.crm.crm_backend.sales;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "http://localhost:5173")
public class SalesController {

    private final SalesRepository salesRepository;

    public SalesController(SalesRepository salesRepository) {
        this.salesRepository = salesRepository;
    }

    @GetMapping
    public List<Sales> getAllSales() {
        return salesRepository.findAll();
    }

    @PostMapping
    public Sales createSale(@RequestBody Sales sale) {
        return salesRepository.save(sale);
    }

    @PutMapping("/{id}")
    public Sales updateSale(
            @PathVariable Long id,
            @RequestBody Sales updatedSale) {

        return salesRepository.findById(id)
                .map(sale -> {
                    sale.setDealName(updatedSale.getDealName());
                    sale.setCustomerName(updatedSale.getCustomerName());
                    sale.setStage(updatedSale.getStage());
                    sale.setDealValue(updatedSale.getDealValue());
                    sale.setCloseDate(updatedSale.getCloseDate());

                    return salesRepository.save(sale);
                })
                .orElse(null);
    }

    @DeleteMapping("/{id}")
    public String deleteSale(@PathVariable Long id) {

        if (salesRepository.existsById(id)) {
            salesRepository.deleteById(id);
            return "Sale deleted successfully";
        }

        return "Sale not found";
    }
}