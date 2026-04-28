package com.dineo;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final MenuItemRepository itemRepo;
    private final CategoryRepository catRepo;
    private final IngredientRepository ingRepo;

    public DashboardController(MenuItemRepository itemRepo, CategoryRepository catRepo, IngredientRepository ingRepo) {
        this.itemRepo = itemRepo;
        this.catRepo = catRepo;
        this.ingRepo = ingRepo;
    }

    @GetMapping
    public Map<String, Object> getDashboard() {
        List<MenuItem> allItems = itemRepo.findAll();
        List<Ingredient> allIngredients = ingRepo.findAll();

        int totalItems = allItems.size();
        int availableItems = 0;
        int outOfStockItems = 0;
        int lowStockItems = 0;

        for (MenuItem item : allItems) {
            String status = item.getStockStatus();
            if (status.equals("ok")) availableItems++;
            if (status.equals("out")) outOfStockItems++;
            if (status.equals("low")) lowStockItems++;
        }

        int ingredientIssues = ingRepo.findLowStock().size() + ingRepo.findOutOfStock().size();

        List<Map<String, Object>> categoryList = new ArrayList<>();
        for (Category cat : catRepo.findAll()) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("id", cat.getId());
            entry.put("name", cat.getName());
            entry.put("icon", cat.getIcon());
            entry.put("color", cat.getColor());
            entry.put("count", itemRepo.countByCategoryId(cat.getId()));
            categoryList.add(entry);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalItems", totalItems);
        result.put("available", availableItems);
        result.put("outOfStock", outOfStockItems);
        result.put("lowStock", lowStockItems);
        result.put("totalIngredients", allIngredients.size());
        result.put("lowIngredients", ingredientIssues);
        result.put("categories", categoryList);
        return result;
    }
}
