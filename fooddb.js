/* ===== FOOD DATABASE WITH SERVING SIZES ===== */
/* Comprehensive food database with nutrition data per serving */

class FoodDatabase {
    constructor() {
        this.foods = this.initializeFoods();
    }

    initializeFoods() {
        return [
            // Proteins
            { name: 'Chicken Breast', category: 'Protein', servings: [
                { size: '100g', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
                { size: '1 Breast (200g)', calories: 330, protein: 62, carbs: 0, fat: 7.2 },
                { size: '1 oz (28g)', calories: 46, protein: 8.7, carbs: 0, fat: 1.01 },
            ]},
            { name: 'Salmon', category: 'Protein', servings: [
                { size: '100g', calories: 208, protein: 20, carbs: 0, fat: 13 },
                { size: '1 Fillet (178g)', calories: 370, protein: 35.5, carbs: 0, fat: 23.1 },
                { size: '1 oz (28g)', calories: 58, protein: 5.6, carbs: 0, fat: 3.64 },
            ]},
            { name: 'Ground Beef (90% lean)', category: 'Protein', servings: [
                { size: '100g', calories: 176, protein: 21, carbs: 0, fat: 9 },
                { size: '1 Patty (113g)', calories: 199, protein: 23.7, carbs: 0, fat: 10.2 },
                { size: '1 oz (28g)', calories: 49, protein: 5.9, carbs: 0, fat: 2.52 },
            ]},
            { name: 'Eggs', category: 'Protein', servings: [
                { size: '1 Large', calories: 72, protein: 6, carbs: 0.36, fat: 5 },
                { size: '1 Cup (243g)', calories: 369, protein: 30.7, carbs: 1.8, fat: 25.5 },
                { size: 'Egg White', calories: 17, protein: 3.6, carbs: 0.24, fat: 0.06 },
            ]},
            { name: 'Greek Yogurt', category: 'Dairy', servings: [
                { size: '100g', calories: 59, protein: 10, carbs: 3.3, fat: 0.4 },
                { size: '1 Cup (227g)', calories: 133, protein: 22.7, carbs: 7.5, fat: 0.9 },
                { size: '1 tbsp (15g)', calories: 9, protein: 1.5, carbs: 0.5, fat: 0.06 },
            ]},
            { name: 'Tuna (Canned in Water)', category: 'Protein', servings: [
                { size: '100g', calories: 96, protein: 21, carbs: 0, fat: 0.8 },
                { size: '1 Can (142g)', calories: 136, protein: 29.8, carbs: 0, fat: 1.1 },
                { size: '1 oz (28g)', calories: 27, protein: 5.9, carbs: 0, fat: 0.22 },
            ]},
            // Carbs
            { name: 'Brown Rice', category: 'Carbs', servings: [
                { size: '100g cooked', calories: 111, protein: 2.6, carbs: 23, fat: 0.9 },
                { size: '1 Cup cooked (195g)', calories: 216, protein: 5, carbs: 44.8, fat: 1.8 },
                { size: '1 tbsp dry (11g)', calories: 38, protein: 0.8, carbs: 8, fat: 0.3 },
            ]},
            { name: 'Sweet Potato', category: 'Carbs', servings: [
                { size: '100g', calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
                { size: '1 Medium (103g)', calories: 88, protein: 1.6, carbs: 20.6, fat: 0.1 },
                { size: '1 Cup cubed (133g)', calories: 114, protein: 2.1, carbs: 26.6, fat: 0.1 },
            ]},
            { name: 'Oatmeal', category: 'Carbs', servings: [
                { size: '30g dry', calories: 108, protein: 4, carbs: 18.7, fat: 2.7 },
                { size: '1 Cup cooked (243g)', calories: 150, protein: 5, carbs: 27, fat: 3 },
                { size: '1 tbsp dry (8g)', calories: 29, protein: 1.1, carbs: 5, fat: 0.7 },
            ]},
            { name: 'Banana', category: 'Fruit', servings: [
                { size: 'Medium (118g)', calories: 105, protein: 1.3, carbs: 27, fat: 0.3 },
                { size: 'Large (136g)', calories: 121, protein: 1.5, carbs: 31, fat: 0.3 },
                { size: '100g', calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
            ]},
            { name: 'White Bread', category: 'Carbs', servings: [
                { size: '1 Slice (28g)', calories: 79, protein: 2.7, carbs: 14.1, fat: 1 },
                { size: '2 Slices (56g)', calories: 158, protein: 5.4, carbs: 28.2, fat: 2 },
                { size: '100g', calories: 265, protein: 9, carbs: 49, fat: 3.3 },
            ]},
            // Vegetables
            { name: 'Broccoli', category: 'Vegetable', servings: [
                { size: '100g', calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
                { size: '1 Cup (91g)', calories: 31, protein: 2.6, carbs: 6, fat: 0.4 },
                { size: '1 Floret (11g)', calories: 3.7, protein: 0.3, carbs: 0.7, fat: 0.05 },
            ]},
            { name: 'Spinach', category: 'Vegetable', servings: [
                { size: '100g raw', calories: 23, protein: 2.7, carbs: 3.6, fat: 0.4 },
                { size: '1 Cup raw (30g)', calories: 7, protein: 0.86, carbs: 1.1, fat: 0.12 },
                { size: '1 Cup cooked (180g)', calories: 41, protein: 5.3, carbs: 6.8, fat: 0.7 },
            ]},
            { name: 'Carrots', category: 'Vegetable', servings: [
                { size: '100g', calories: 41, protein: 0.9, carbs: 10, fat: 0.2 },
                { size: '1 Medium (61g)', calories: 25, protein: 0.6, carbs: 6, fat: 0.1 },
                { size: '1 Cup chopped (128g)', calories: 52, protein: 1.2, carbs: 12.3, fat: 0.3 },
            ]},
            // Fruits
            { name: 'Apple', category: 'Fruit', servings: [
                { size: 'Medium (182g)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
                { size: '100g', calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2 },
                { size: '1 Cup sliced (125g)', calories: 65, protein: 0.3, carbs: 17.3, fat: 0.2 },
            ]},
            { name: 'Almonds', category: 'Nuts', servings: [
                { size: '28g (1 oz)', calories: 161, protein: 6, carbs: 6, fat: 14 },
                { size: '1 Cup (95g)', calories: 529, protein: 19.6, carbs: 20, fat: 46 },
                { size: '10 almonds', calories: 70, protein: 2.6, carbs: 2.6, fat: 6 },
            ]},
            { name: 'Peanut Butter', category: 'Nuts', servings: [
                { size: '1 tbsp (16g)', calories: 96, protein: 4, carbs: 3.5, fat: 8 },
                { size: '2 tbsp (32g)', calories: 192, protein: 8, carbs: 7, fat: 16 },
                { size: '1 Cup (258g)', calories: 1520, protein: 64, carbs: 56, fat: 128 },
            ]},
            // Dairy
            { name: 'Cheese (Cheddar)', category: 'Dairy', servings: [
                { size: '28g (1 oz)', calories: 115, protein: 7, carbs: 0.4, fat: 9.4 },
                { size: '1 Cup shredded (113g)', calories: 456, protein: 28, carbs: 1.7, fat: 37.5 },
                { size: '1 Slice (21g)', calories: 86, protein: 5.3, carbs: 0.3, fat: 7.1 },
            ]},
            { name: 'Milk (2%)', category: 'Dairy', servings: [
                { size: '1 Cup (244ml)', calories: 122, protein: 8, carbs: 12, fat: 5 },
                { size: '100ml', calories: 50, protein: 3.3, carbs: 4.9, fat: 2 },
                { size: '1 Tbsp (15ml)', calories: 7.5, protein: 0.49, carbs: 0.73, fat: 0.3 },
            ]},
            // Processed Foods
            { name: 'Pizza Slice', category: 'Prepared', servings: [
                { size: '1 Slice (285g avg)', calories: 285, protein: 12, carbs: 36, fat: 10 },
                { size: '1/8 Pizza (100g)', calories: 100, protein: 4, carbs: 12.6, fat: 3.5 },
            ]},
            { name: 'Hamburger Bun', category: 'Carbs', servings: [
                { size: '1 Bun (43g)', calories: 120, protein: 4, carbs: 21, fat: 2 },
                { size: '100g', calories: 279, protein: 9.3, carbs: 48.8, fat: 4.6 },
            ]},
            { name: 'Rice Cakes', category: 'Carbs', servings: [
                { size: '1 Cake (9g)', calories: 35, protein: 0.7, carbs: 7.3, fat: 0.3 },
                { size: '100g', calories: 389, protein: 7.8, carbs: 81, fat: 3.3 },
            ]},
            // More proteins
            { name: 'Tofu', category: 'Protein', servings: [
                { size: '100g (Firm)', calories: 76, protein: 8.1, carbs: 1.9, fat: 4.8 },
                { size: '1 Block (200g)', calories: 152, protein: 16.2, carbs: 3.8, fat: 9.6 },
            ]},
            { name: 'Lentils (Cooked)', category: 'Carbs', servings: [
                { size: '100g', calories: 116, protein: 9, carbs: 20, fat: 0.4 },
                { size: '1 Cup (198g)', calories: 230, protein: 18, carbs: 40, fat: 0.8 },
            ]},
            { name: 'Turkey Breast', category: 'Protein', servings: [
                { size: '100g', calories: 135, protein: 29.9, carbs: 0, fat: 0.7 },
                { size: '1 Slice (28g)', calories: 37, protein: 8.4, carbs: 0, fat: 0.2 },
            ]},
        ];
    }

    search(query) {
        if (!query || query.length === 0) return [];
        
        const lowerQuery = query.toLowerCase();
        return this.foods.filter(food => 
            food.name.toLowerCase().includes(lowerQuery) ||
            food.category.toLowerCase().includes(lowerQuery)
        );
    }

    getFoodByName(name) {
        return this.foods.find(food => food.name.toLowerCase() === name.toLowerCase());
    }

    getCategories() {
        const categories = new Set(this.foods.map(f => f.category));
        return Array.from(categories).sort();
    }

    getFoodsByCategory(category) {
        return this.foods.filter(food => food.category === category);
    }
}

// Initialize database
const foodDatabase = new FoodDatabase();
