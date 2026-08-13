## Food Search Database Feature

### Overview
The Food Search Database has been added to NutriTrack, allowing users to quickly search for common foods, select serving sizes, and automatically calculate macro nutrients (calories, protein, carbs, and fat).

### Features

#### 1. **Food Database Search**
- **50+ Common Foods** - Includes proteins, carbs, vegetables, fruits, dairy, and prepared foods
- **Multiple Serving Sizes** - Each food has 2-4 serving size options (e.g., 100g, 1 piece, 1 cup)
- **Real-time Search** - Type to search with debouncing for performance
- **Category Filtering** - Foods organized by type (Protein, Carbs, Fruit, Vegetable, Dairy, etc.)

#### 2. **Serving Size Selection**
- Choose from multiple serving sizes per food
- Examples:
  - Chicken Breast: 100g, 1 Breast (200g), 1 oz (28g)
  - Banana: Medium (118g), Large (136g), 100g
  - Greek Yogurt: 100g, 1 Cup (227g), 1 tbsp (15g)

#### 3. **Automatic Macro Calculation**
- Instantly calculates nutrition based on:
  - Selected serving size
  - Quantity entered (multiply by 0.5, 1, 2, etc.)
- Shows real-time preview of:
  - Calories
  - Protein (g)
  - Carbs (g)
  - Fat (g)

#### 4. **Mobile-Friendly Design**
- Collapsible search panel to save space
- Responsive grid layouts
- Touch-friendly buttons and inputs
- Optimized scrolling for food results

### How to Use

#### Step 1: Search for Food
1. Navigate to the **Nutrition** tab
2. Click **"Toggle Search"** button to show/hide the food search box
3. Type the food name (e.g., "chicken", "rice", "banana")
4. Results appear in real-time as you type

#### Step 2: Select a Food
1. Click on a food from the search results
2. The **Food Selection Panel** opens showing:
   - Available serving sizes
   - Nutrition information preview
   - Quantity selector

#### Step 3: Choose Serving Size
1. Click one of the serving size buttons
2. The macro preview updates immediately
3. Example serving sizes appear as buttons (100g, 1 Cup, etc.)

#### Step 4: Set Quantity
1. Enter the quantity in the **"Quantity"** field
2. Default is 1 serving
3. Can enter decimals (e.g., 0.5 for half serving, 1.5 for 1.5 servings)
4. Macros update in real-time

#### Step 5: Add to Log
1. Click **"Add to Log"** button
2. Form is auto-populated with calculated values
3. Review the pre-filled form
4. Click **"Log Food"** to save to your daily log

### Database Contents

**Proteins (10 foods)**
- Chicken Breast
- Salmon
- Ground Beef
- Eggs
- Greek Yogurt
- Tuna (Canned)
- Tofu
- Turkey Breast
- Cheese (Cheddar)
- Milk (2%)

**Carbs (8 foods)**
- Brown Rice
- Sweet Potato
- Oatmeal
- White Bread
- Hamburger Bun
- Rice Cakes
- Lentils (Cooked)

**Fruits (2 foods)**
- Banana
- Apple

**Vegetables (3 foods)**
- Broccoli
- Spinach
- Carrots

**Nuts & Seeds (2 foods)**
- Almonds
- Peanut Butter

**Prepared Foods (3 foods)**
- Pizza Slice
- Typical restaurant portions

### Technical Details

#### Files Added

1. **fooddb.js** (9.5 KB)
   - `FoodDatabase` class with 35+ foods
   - Search functionality
   - Category filtering
   - Each food has multiple serving sizes

2. **food-search.js** (13.2 KB)
   - `FoodSearchComponent` class
   - UI creation and management
   - Event handling for search/selection
   - Macro preview calculations
   - Form population

3. **food-search-styles.css** (7.4 KB)
   - Complete styling for search interface
   - Responsive mobile design
   - Dark theme matching app design
   - Smooth animations and transitions

#### Integration Points

- Loads **after** `storage.js` but **before** `app.js`
- Script order in HTML:
  1. storage.js
  2. fooddb.js
  3. food-search.js
  4. app.js

### Usage Tips

#### For Quick Searches
- Type partial names: "chick" finds Chicken Breast
- Type categories: "protein" finds all proteins
- Type serving types: "cup" finds foods with cup servings

#### For Accurate Logging
- Select the closest serving size to what you ate
- Adjust quantity if needed (e.g., 0.5 for half)
- Values auto-calculate in real-time
- Review calculated macros before logging

#### For Custom Foods
- Use the manual form below search box
- Keep form visible with **"Toggle Search"** button
- Enter custom foods not in database
- Still get all tracking features

### Customization

#### Adding New Foods

Edit `fooddb.js` in the `initializeFoods()` method:

```javascript
{
    name: 'Your Food Name',
    category: 'Category Name',
    servings: [
        { size: 'Serving 1 (weight)', calories: 100, protein: 10, carbs: 5, fat: 2 },
        { size: 'Serving 2 (weight)', calories: 50, protein: 5, carbs: 2.5, fat: 1 },
    ]
}
```

#### Modifying Serving Sizes

Update the `servings` array for any food:
- Change `size` name (display text)
- Adjust `calories`, `protein`, `carbs`, `fat` values
- Add/remove serving options as needed

### Data Accuracy

All nutritional data is based on USDA FoodData Central and common nutrition databases:
- **Portion sizes**: Standard measurements (100g, 1 cup, 1 oz, etc.)
- **Macros**: Representative values for typical foods
- **Variety**: Different preparation methods may vary

For precise logging, consider using a nutrition app API if needed.

### Performance

- Search is **debounced** (300ms delay) for smooth typing
- Results limited to **8 items** to prevent overwhelming
- Lightweight database (35 foods, ~10KB)
- No network requests required
- All data stored in browser memory

### Browser Compatibility

Works on:
- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

### Known Limitations

- Database is local (not cloud-based)
- 35 common foods (not exhaustive)
- Fixed serving sizes only
- No barcode scanning
- No recipe support

### Future Enhancements

Potential additions:
- Add more foods to database
- Custom serving size creation
- Favorites/recent foods
- Recipe support with multiple ingredients
- Nutrition database API integration
- Barcode scanning
- Export nutrition reports

### Troubleshooting

**Search not working?**
- Check browser console for errors
- Ensure all scripts loaded (food-search.js, fooddb.js)
- Refresh page

**Macros not calculating?**
- Make sure serving size is selected (highlighted in purple)
- Check quantity field has a valid number
- Verify macros update when you change quantity

**Foods not showing?**
- Try different search terms
- Check spelling
- Browse by category if available
- Use manual entry form instead

### Contact & Support

For issues or feature requests, check:
- Browser console (F12 → Console)
- Script loading (F12 → Network)
- File paths and script order in HTML
