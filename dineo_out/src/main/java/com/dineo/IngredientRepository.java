package com.dineo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {

    @Query("SELECT i FROM Ingredient i WHERE i.quantity > 0 AND i.quantity < i.threshold")
    List<Ingredient> findLowStock();

    @Query("SELECT i FROM Ingredient i WHERE i.quantity = 0")
    List<Ingredient> findOutOfStock();
}
