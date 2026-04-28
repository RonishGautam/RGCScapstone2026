package com.dineo;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ingredients")
public class IngredientController {

    private final IngredientRepository repo;

    public IngredientController(IngredientRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Ingredient> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Ingredient create(@RequestBody Ingredient ingredient) {
        return repo.save(ingredient);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ingredient> update(@PathVariable Long id, @RequestBody Ingredient updated) {
        Ingredient ingredient = repo.findById(id).orElse(null);
        if (ingredient == null) return ResponseEntity.notFound().build();

        ingredient.setName(updated.getName());
        ingredient.setQuantity(updated.getQuantity());
        ingredient.setUnit(updated.getUnit());
        ingredient.setThreshold(updated.getThreshold());
        return ResponseEntity.ok(repo.save(ingredient));
    }

    // used by the +/- buttons on the ingredients page
    @PatchMapping("/{id}/quantity")
    public ResponseEntity<Ingredient> updateQuantity(@PathVariable Long id, @RequestBody Ingredient updated) {
        Ingredient ingredient = repo.findById(id).orElse(null);
        if (ingredient == null) return ResponseEntity.notFound().build();

        ingredient.setQuantity(updated.getQuantity());
        ingredient.setThreshold(updated.getThreshold());
        return ResponseEntity.ok(repo.save(ingredient));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
