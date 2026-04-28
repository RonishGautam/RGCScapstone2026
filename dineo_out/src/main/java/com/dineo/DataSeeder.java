package com.dineo;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedDatabase(CategoryRepository catRepo, IngredientRepository ingRepo, MenuItemRepository itemRepo) {
        return args -> {
            if (catRepo.count() > 0) {
                System.out.println("Already seeded, skipping.");
                return;
            }

            System.out.println("Seeding database...");

            // categories
            Category appetizers = catRepo.save(new Category("Appetizers", "AP", "#22C55E"));
            Category entrees = catRepo.save(new Category("Entrees", "EN", "#3B82F6"));
            Category drinks = catRepo.save(new Category("Drinks", "DR", "#06B6D4"));
            Category desserts = catRepo.save(new Category("Desserts", "DE", "#EC4899"));

            // ingredients
            Ingredient mozzarella = ingRepo.save(new Ingredient("Mozzarella Cheese", 2500, "g", 500));
            Ingredient breadcrumbs = ingRepo.save(new Ingredient("Breadcrumbs", 1800, "g", 300));
            Ingredient romaine = ingRepo.save(new Ingredient("Romaine Lettuce", 180, "g", 200)); // low
            Ingredient parmesan = ingRepo.save(new Ingredient("Parmesan Cheese", 1200, "g", 200));
            Ingredient chicken = ingRepo.save(new Ingredient("Chicken", 2500, "g", 400));
            Ingredient shrimp = ingRepo.save(new Ingredient("Shrimp", 250, "g", 300)); // low
            Ingredient beefPatty = ingRepo.save(new Ingredient("Beef Patty", 0, "units", 5)); // out
            Ingredient pasta = ingRepo.save(new Ingredient("Pasta", 2000, "g", 300));
            Ingredient eggs = ingRepo.save(new Ingredient("Eggs", 60, "units", 12));
            Ingredient salmon = ingRepo.save(new Ingredient("Salmon Fillet", 880, "g", 200));
            Ingredient heavyCream = ingRepo.save(new Ingredient("Heavy Cream", 800, "ml", 200));
            Ingredient bbqSauce = ingRepo.save(new Ingredient("BBQ Sauce", 0, "ml", 200)); // out
            Ingredient flour = ingRepo.save(new Ingredient("Flour", 3000, "g", 500));
            Ingredient butter = ingRepo.save(new Ingredient("Butter", 600, "g", 100));
            Ingredient chocolate = ingRepo.save(new Ingredient("Dark Chocolate", 800, "g", 150));
            Ingredient iceCream = ingRepo.save(new Ingredient("Vanilla Ice Cream", 1800, "g", 400));
            Ingredient lemons = ingRepo.save(new Ingredient("Lemons", 30, "units", 10));
            Ingredient milk = ingRepo.save(new Ingredient("Whole Milk", 2000, "ml", 400));
            Ingredient coffee = ingRepo.save(new Ingredient("Coffee / Espresso", 600, "g", 100));
            Ingredient sparklingW = ingRepo.save(new Ingredient("Sparkling Water", 0, "bottles", 5)); // out

            // appetizers
            saveItem(itemRepo, "Mozzarella Sticks", 7.99, "gluten, dairy","https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400&h=300&fit=crop",32, 8, appetizers, List.of(mozzarella, breadcrumbs));     
            saveItem(itemRepo, "Caesar Salad", 8.49, "gluten, dairy, egg", "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&h=300&fit=crop", 12, 5, appetizers, List.of(romaine, parmesan));
            saveItem(itemRepo, "Buffalo Wings", 11.99, "none", "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop", 25, 8, appetizers, List.of(chicken));
            saveItem(itemRepo, "Shrimp Cocktail", 12.99, "shellfish", "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400&h=300&fit=crop", 18, 5, appetizers, List.of(shrimp, lemons));
            saveItem(itemRepo, "Onion Rings", 6.49, "gluten, dairy", "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop", 40, 10, appetizers, List.of(breadcrumbs));
            saveItem(itemRepo, "Spring Rolls", 7.49, "gluten", "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop", 0, 5, appetizers, List.of());

            // entrees
            saveItem(itemRepo, "Grilled Salmon", 18.99, "fish", "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop", 20, 5, entrees, List.of(salmon, lemons));
            saveItem(itemRepo, "Classic Burger", 12.99, "gluten, dairy", "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop", 0, 5, entrees, List.of(beefPatty));
            saveItem(itemRepo, "Pasta Carbonara", 13.49, "gluten, dairy, egg", "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop", 15, 5, entrees, List.of(pasta, eggs, parmesan));
            saveItem(itemRepo, "Ribeye Steak", 34.99, "dairy", "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop", 10, 5, entrees, List.of(butter));
            saveItem(itemRepo, "Chicken Alfredo", 15.99, "gluten, dairy", "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&h=300&fit=crop", 3, 5, entrees, List.of(chicken, pasta, heavyCream));
            saveItem(itemRepo, "BBQ Baby Ribs", 24.99, "gluten","https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop", 8, 8, entrees, List.of(bbqSauce));
            saveItem(itemRepo, "Mushroom Risotto", 16.49, "dairy", "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop", 22, 5, entrees, List.of(parmesan));

            // drinks
            saveItem(itemRepo, "Fres Lemonade", 3.49, "none", "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop", 55, 15, drinks, List.of(lemons));
            saveItem(itemRepo, "Iced Coffee", 4.25, "dairy", "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&h=300&fit=crop", 42, 10, drinks, List.of(coffee, milk));
            saveItem(itemRepo, "Mango Lassi", 5.99, "dairy", "https://unsplash.com/photos/a-glass-filled-with-a-smoothie-next-to-a-mango-KlVIYmGVRQ8", 30, 10, drinks, List.of(milk));
            saveItem(itemRepo, "Classic Mojito", 8.99, "none", "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop", 35, 10, drinks, List.of(lemons));
            saveItem(itemRepo, "Sparkling Water", 2.50, "none", "https://images.unsplash.com/photo-1550505095-081e7b7c76cb?w=400&h=300&fit=crop", 0, 5, drinks, List.of(sparklingW));

            // desserts
            saveItem(itemRepo, "Tiramisu", 7.49, "gluten, dairy, egg", "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop", 18, 5, desserts, List.of(eggs, coffee));
            saveItem(itemRepo, "Chocolate Lava Cake", 8.99, "gluten, dairy, egg", "https://images.unsplash.com/photo-1617305855058-336d24456869?w=400&h=300&fit=crop", 22, 5, desserts, List.of(chocolate, butter, eggs, flour));
            saveItem(itemRepo, "NY Cheesecake", 6.99, "gluten, dairy, egg", "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400&h=300&fit=crop", 14, 5, desserts, List.of(eggs));
            saveItem(itemRepo, "Creme Brulee", 7.99, "dairy, egg", "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&h=300&fit=crop", 2, 5, desserts, List.of(heavyCream, eggs));
            saveItem(itemRepo, "Warm Apple Pie", 6.49, "gluten, dairy", "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=400&h=300&fit=crop", 35, 10, desserts, List.of(flour, butter, iceCream));

            System.out.println("Done! " + itemRepo.count() + " items, " + ingRepo.count() + " ingredients.");
        };
    }

    private void saveItem(MenuItemRepository itemRepo, String name, double price, String allergens,
     String image, int stock, int threshold, Category category, List<Ingredient> ingredients) {
        MenuItem item = new MenuItem();
        item.setName(name);
        item.setPrice(price);
        item.setAllergens(allergens);
        item.setImage(image);
        item.setStock(stock);
        item.setThreshold(threshold);
        item.setCategory(category);
        item.setIngredients(ingredients);
        itemRepo.save(item);
    }
}
