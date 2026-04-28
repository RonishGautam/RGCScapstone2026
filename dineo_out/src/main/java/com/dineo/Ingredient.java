package com.dineo;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "ingredients")
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double quantity;
    private String unit;
    private double threshold;

    @ManyToMany(mappedBy = "ingredients")
    @JsonIgnore
    private List<MenuItem> menuItems;

    public Ingredient() {}

    public Ingredient(String name, double quantity, String unit, double threshold) {
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.threshold = threshold;
    }

    public String getStatus() {
        if (quantity == 0) return "out";
        if (quantity < threshold) return "low";
        return "ok";
    }

    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getQuantity() { return quantity; }
    public void setQuantity(double quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public double getThreshold() { return threshold; }
    public void setThreshold(double threshold) { this.threshold = threshold; }

    public List<MenuItem> getMenuItems() { return menuItems; }
    public void setMenuItems(List<MenuItem> menuItems) { this.menuItems = menuItems; }
}
