package com.dineo;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/items")
public class MenuItemController {

    private final MenuItemRepository itemRepo;
    private final CategoryRepository catRepo;
    private final IngredientRepository ingRepo;

    public MenuItemController(MenuItemRepository itemRepo, CategoryRepository catRepo, IngredientRepository ingRepo) {
        this.itemRepo = itemRepo;
        this.catRepo = catRepo;
        this.ingRepo = ingRepo;
    }

    @GetMapping
    public List<MenuItem> getAll() {
        return itemRepo.findAll();
    }

    @PostMapping
    public MenuItem create(@RequestBody MenuItemRequest request) {
        MenuItem item = new MenuItem();
        applyRequest(item, request);
        return itemRepo.save(item);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuItem> update(@PathVariable Long id, @RequestBody MenuItemRequest request) {
        MenuItem item = itemRepo.findById(id).orElse(null);
        if (item == null) return ResponseEntity.notFound().build();

        applyRequest(item, request);
        return ResponseEntity.ok(itemRepo.save(item));
    }

    // just updates stock and threshold, used by the inventory page
    @PatchMapping("/{id}/stock")
    public ResponseEntity<MenuItem> updateStock(@PathVariable Long id, @RequestBody MenuItemRequest request) {
        MenuItem item = itemRepo.findById(id).orElse(null);
        if (item == null) return ResponseEntity.notFound().build();

        item.setStock(request.stock);
        item.setThreshold(request.threshold);
        return ResponseEntity.ok(itemRepo.save(item));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        itemRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    private void applyRequest(MenuItem item, MenuItemRequest request) {
        item.setName(request.name);
        item.setPrice(request.price);
        item.setAllergens(request.allergens);
        item.setImage(request.image);
        item.setStock(request.stock);
        item.setThreshold(request.threshold);

        if (request.categoryId != null) {
            Category cat = catRepo.findById(request.categoryId).orElse(null);
            item.setCategory(cat);
        }

        if (request.ingredientIds != null) {
            List<Ingredient> ingredients = new ArrayList<>();
            for (Long ingId : request.ingredientIds) {
                Ingredient ing = ingRepo.findById(ingId).orElse(null);
                if (ing != null) ingredients.add(ing);
            }
            item.setIngredients(ingredients);
        }
    }
}
