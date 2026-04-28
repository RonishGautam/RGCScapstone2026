package com.dineo;

import java.util.List;

// holds data sent from the frontend when creating or editing an item
public class MenuItemRequest {
    public String name;
    public double price;
    public String allergens;
    public String image;
    public int stock;
    public int threshold;
    public Long categoryId;
    public List<Long> ingredientIds;
}
