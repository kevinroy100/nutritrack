/* ===== FOOD SEARCH COMPONENT ===== */
/* Handles food search UI, serving size selection, and macro calculation */

class FoodSearchComponent {
    constructor() {
        this.selectedFood = null;
        this.selectedServing = null;
        this.searchTimeout = null;
        this.init();
    }

    init() {
        // Create search container
        this.createSearchUI();
        this.attachEventListeners();
    }

    createSearchUI() {
        const container = document.querySelector('.nutrition-section');
        if (!container) return;

        // Insert search section before the form
        const searchHTML = `
            <div id="foodSearchContainer" class="food-search-container">
                <div class="search-header">
                    <h3>Search Foods or Enter Custom</h3>
                    <button type="button" class="btn btn-secondary" id="toggleSearchBtn">Toggle Search</button>
                </div>
                
                <div id="foodSearchBox" class="food-search-box">
                    <div class="search-input-group">
                        <input 
                            type="text" 
                            id="foodSearchInput" 
                            placeholder="Search (e.g., chicken, pasta, milk...)" 
                            class="search-input"
                        >
                        <button type="button" id="clearSearchBtn" class="clear-btn" style="display: none;">✕</button>
                    </div>
                    
                    <div id="searchResults" class="search-results" style="display: none;"></div>
                    
                    <div id="foodSelectionPanel" class="food-selection-panel" style="display: none;">
                        <div class="selected-food-header">
                            <h4 id="selectedFoodName"></h4>
                            <button type="button" class="btn-close-panel" id="closePanelBtn">✕</button>
                        </div>
                        
                        <div class="serving-selection">
                            <label>Select Serving Size:</label>
                            <div id="servingOptions" class="serving-options"></div>
                        </div>
                        
                        <div class="macro-preview">
                            <h4>Nutrition Info</h4>
                            <div class="macro-grid">
                                <div class="macro-item">
                                    <span class="macro-label">Calories</span>
                                    <span class="macro-value" id="previewCalories">0</span>
                                </div>
                                <div class="macro-item">
                                    <span class="macro-label">Protein</span>
                                    <span class="macro-value" id="previewProtein">0</span><span class="macro-unit">g</span>
                                </div>
                                <div class="macro-item">
                                    <span class="macro-label">Carbs</span>
                                    <span class="macro-value" id="previewCarbs">0</span><span class="macro-unit">g</span>
                                </div>
                                <div class="macro-item">
                                    <span class="macro-label">Fat</span>
                                    <span class="macro-value" id="previewFat">0</span><span class="macro-unit">g</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="quantity-selector">
                            <label for="foodQuantity">Quantity:</label>
                            <input type="number" id="foodQuantity" value="1" min="0.1" step="0.1" class="quantity-input">
                            <span id="quantityUnit" class="quantity-unit">serving</span>
                        </div>
                        
                        <div class="selection-actions">
                            <button type="button" class="btn btn-primary" id="addFoodBtn">Add to Log</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('afterbegin', searchHTML);
    }

    attachEventListeners() {
        const searchInput = document.getElementById('foodSearchInput');
        const clearBtn = document.getElementById('clearSearchBtn');
        const toggleBtn = document.getElementById('toggleSearchBtn');
        const closePanel = document.getElementById('closePanelBtn');
        const addBtn = document.getElementById('addFoodBtn');
        
        // Search input
        searchInput.addEventListener('input', (e) => this.handleSearch(e));
        
        // Clear search
        clearBtn.addEventListener('click', () => this.clearSearch());
        
        // Toggle search box
        toggleBtn.addEventListener('click', () => this.toggleSearchBox());
        
        // Close selection panel
        closePanel.addEventListener('click', () => this.closeSelectionPanel());
        
        // Add food button
        addBtn.addEventListener('click', () => this.addSelectedFood());
    }

    handleSearch(e) {
        const query = e.target.value.trim();
        const clearBtn = document.getElementById('clearSearchBtn');
        const searchResults = document.getElementById('searchResults');
        
        // Show/hide clear button
        clearBtn.style.display = query.length > 0 ? 'block' : 'none';
        
        // Clear previous timeout
        clearTimeout(this.searchTimeout);
        
        if (query.length === 0) {
            searchResults.style.display = 'none';
            searchResults.innerHTML = '';
            return;
        }
        
        // Debounce search
        this.searchTimeout = setTimeout(() => {
            this.performSearch(query);
        }, 300);
    }

    performSearch(query) {
        const results = foodDatabase.search(query);
        const searchResults = document.getElementById('searchResults');
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">No foods found. Use custom entry below.</div>';
            searchResults.style.display = 'block';
            return;
        }
        
        const resultsHTML = results.slice(0, 8).map(food => `
            <div class="search-result-item" data-food-name="${food.name}">
                <div class="result-name">${this.escapeHtml(food.name)}</div>
                <div class="result-category">${food.category}</div>
            </div>
        `).join('');
        
        searchResults.innerHTML = resultsHTML;
        searchResults.style.display = 'block';
        
        // Attach click listeners
        document.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const foodName = item.dataset.foodName;
                this.selectFood(foodName);
            });
        });
    }

    selectFood(foodName) {
        const food = foodDatabase.getFoodByName(foodName);
        if (!food) return;
        
        this.selectedFood = food;
        this.selectedServing = null;
        
        // Hide search results
        document.getElementById('searchResults').style.display = 'none';
        document.getElementById('foodSearchInput').value = foodName;
        
        // Show selection panel
        this.showSelectionPanel(food);
    }

    showSelectionPanel(food) {
        const panel = document.getElementById('foodSelectionPanel');
        const nameElement = document.getElementById('selectedFoodName');
        const servingOptions = document.getElementById('servingOptions');
        
        nameElement.textContent = this.escapeHtml(food.name);
        
        // Create serving option buttons
        servingOptions.innerHTML = food.servings.map((serving, index) => `
            <button 
                type="button" 
                class="btn btn-secondary serving-option" 
                data-serving-index="${index}"
            >
                ${this.escapeHtml(serving.size)}
            </button>
        `).join('');
        
        // Attach serving selection listeners
        document.querySelectorAll('.serving-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.serving-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const index = parseInt(btn.dataset.servingIndex);
                this.selectServing(index);
            });
        });
        
        panel.style.display = 'block';
        document.getElementById('foodQuantity').value = '1';
        this.updateMacroPreview();
    }

    selectServing(index) {
        if (!this.selectedFood || !this.selectedFood.servings[index]) return;
        
        this.selectedServing = this.selectedFood.servings[index];
        this.updateMacroPreview();
    }

    updateMacroPreview() {
        if (!this.selectedServing) {
            document.getElementById('previewCalories').textContent = '0';
            document.getElementById('previewProtein').textContent = '0';
            document.getElementById('previewCarbs').textContent = '0';
            document.getElementById('previewFat').textContent = '0';
            return;
        }
        
        const quantity = parseFloat(document.getElementById('foodQuantity').value) || 1;
        const multiplier = Math.max(0, quantity);
        
        document.getElementById('previewCalories').textContent = 
            Math.round(this.selectedServing.calories * multiplier);
        document.getElementById('previewProtein').textContent = 
            (this.selectedServing.protein * multiplier).toFixed(1);
        document.getElementById('previewCarbs').textContent = 
            (this.selectedServing.carbs * multiplier).toFixed(1);
        document.getElementById('previewFat').textContent = 
            (this.selectedServing.fat * multiplier).toFixed(1);
    }

    addSelectedFood() {
        if (!this.selectedFood || !this.selectedServing) {
            alert('Please select a serving size');
            return;
        }
        
        const quantity = parseFloat(document.getElementById('foodQuantity').value) || 1;
        const multiplier = Math.max(0.1, quantity);
        
        // Calculate final macros
        const foodData = {
            name: `${this.selectedFood.name} (${this.selectedServing.size})`,
            calories: Math.round(this.selectedServing.calories * multiplier),
            protein: parseFloat((this.selectedServing.protein * multiplier).toFixed(1)),
            carbs: parseFloat((this.selectedServing.carbs * multiplier).toFixed(1)),
            fat: parseFloat((this.selectedServing.fat * multiplier).toFixed(1)),
        };
        
        // Populate the manual form with calculated values
        document.getElementById('foodName').value = foodData.name;
        document.getElementById('foodCalories').value = foodData.calories;
        document.getElementById('foodProtein').value = foodData.protein;
        document.getElementById('foodCarbs').value = foodData.carbs;
        document.getElementById('foodFat').value = foodData.fat;
        
        // Scroll to form
        document.getElementById('foodForm').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Close panel
        this.closeSelectionPanel();
        
        // Focus on submit button hint
        setTimeout(() => {
            const submitBtn = document.getElementById('foodForm').querySelector('button[type="submit"]');
            submitBtn.focus();
        }, 300);
    }

    closeSelectionPanel() {
        document.getElementById('foodSelectionPanel').style.display = 'none';
        document.getElementById('searchResults').style.display = 'none';
        this.selectedFood = null;
        this.selectedServing = null;
    }

    clearSearch() {
        document.getElementById('foodSearchInput').value = '';
        document.getElementById('clearSearchBtn').style.display = 'none';
        document.getElementById('searchResults').style.display = 'none';
        document.getElementById('foodSelectionPanel').style.display = 'none';
    }

    toggleSearchBox() {
        const searchBox = document.getElementById('foodSearchBox');
        const isHidden = searchBox.style.display === 'none';
        searchBox.style.display = isHidden ? 'block' : 'none';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for app to initialize first
        setTimeout(() => {
            window.foodSearch = new FoodSearchComponent();
        }, 100);
    });
} else {
    window.foodSearch = new FoodSearchComponent();
}
