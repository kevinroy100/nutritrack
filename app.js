/* ===== MAIN APP LOGIC ===== */
/* Handles UI interactions, data updates, and progress calculations */

class NutriTrackApp {
    constructor() {
        this.currentTab = 'dashboard';
        this.todayLog = null;
        this.settings = null;
        this.init();
    }

    /* ===== INITIALIZE APP ===== */
    async init() {
        // Wait for storage to be ready
        await storage.initDB();
        
        // Load initial data
        await this.loadData();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Render initial view
        await this.renderDashboard();
        
        // Update date display
        this.updateHeaderDate();
        
        // Refresh data every minute
        setInterval(() => this.loadData(), 60000);
    }

    /* ===== LOAD DATA ===== */
    async loadData() {
        this.todayLog = await storage.getTodayLog();
        this.settings = storage.getSettings();
    }

    /* ===== SETUP EVENT LISTENERS ===== */
    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Food form
        document.getElementById('foodForm').addEventListener('submit', (e) => this.handleFoodSubmit(e));

        // Activity section
        document.getElementById('updateStepsBtn').addEventListener('click', () => this.handleStepsUpdate());
        document.getElementById('logWaterBtn').addEventListener('click', () => this.handleWaterLog());

        // Water quick buttons
        document.querySelectorAll('.water-buttons .btn-secondary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cups = parseInt(e.target.dataset.water);
                if (!isNaN(cups)) {
                    document.getElementById('waterInput').value = cups;
                }
            });
        });

        // Settings form
        document.getElementById('settingsForm').addEventListener('submit', (e) => this.handleSettingsSave(e));

        // Data management
        document.getElementById('exportDataBtn').addEventListener('click', () => this.handleExportData());
        document.getElementById('clearDataBtn').addEventListener('click', () => this.handleClearData());
    }

    /* ===== SWITCH TAB ===== */
    async switchTab(tabName) {
        this.currentTab = tabName;

        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });

        // Update tab panes
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        // Render tab content
        if (tabName === 'dashboard') {
            await this.renderDashboard();
        } else if (tabName === 'nutrition') {
            await this.renderNutrition();
        } else if (tabName === 'activity') {
            await this.renderActivity();
        } else if (tabName === 'settings') {
            await this.renderSettings();
        }
    }

    /* ===== RENDER DASHBOARD ===== */
    async renderDashboard() {
        await this.loadData();

        // Update progress rings
        this.updateProgressRing('calorieRing', this.todayLog.totalCalories, this.settings.calorieGoal);
        this.updateProgressRing('proteinRing', this.todayLog.totalProtein, this.settings.proteinGoal);
        this.updateProgressRing('stepsRing', this.todayLog.steps, this.settings.stepsGoal);

        // Update text displays
        document.getElementById('calorieText').textContent = 
            `${this.todayLog.totalCalories}/${this.settings.calorieGoal}`;
        document.getElementById('proteinText').textContent = 
            `${this.todayLog.totalProtein.toFixed(1)}g`;
        document.getElementById('stepsText').textContent = 
            `${this.todayLog.steps}`;

        // Update quick stats
        document.getElementById('waterValue').textContent = this.todayLog.water.toFixed(1);
        document.getElementById('carbsValue').textContent = this.todayLog.totalCarbs.toFixed(1);
        document.getElementById('fatValue').textContent = this.todayLog.totalFat.toFixed(1);
    }

    /* ===== RENDER NUTRITION ===== */
    async renderNutrition() {
        await this.loadData();
        
        const foodList = document.getElementById('foodList');
        
        if (this.todayLog.foods.length === 0) {
            foodList.innerHTML = '<li class="empty-state"><p>No foods logged yet. Add your first meal!</p></li>';
            return;
        }

        foodList.innerHTML = this.todayLog.foods.map(food => `
            <li class="food-item">
                <div class="food-item-details">
                    <div class="food-item-name">${this.escapeHtml(food.name)}</div>
                    <div class="food-item-macros">
                        P: ${food.protein.toFixed(1)}g | C: ${food.carbs.toFixed(1)}g | F: ${food.fat.toFixed(1)}g
                    </div>
                </div>
                <div class="food-item-calories">${food.calories} cal</div>
                <button class="food-item-delete" data-food-id="${food.id}">Delete</button>
            </li>
        `).join('');

        // Add delete listeners
        document.querySelectorAll('.food-item-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const foodId = parseInt(e.target.dataset.foodId);
                this.handleFoodDelete(foodId);
            });
        });
    }

    /* ===== RENDER ACTIVITY ===== */
    async renderActivity() {
        await this.loadData();
        document.getElementById('stepsInput').value = this.todayLog.steps;
        document.getElementById('waterInput').value = '0';
    }

    /* ===== RENDER SETTINGS ===== */
    async renderSettings() {
        await this.loadData();
        
        document.getElementById('calorieGoal').value = this.settings.calorieGoal;
        document.getElementById('proteinGoal').value = this.settings.proteinGoal;
        document.getElementById('carbsGoal').value = this.settings.carbsGoal;
        document.getElementById('fatGoal').value = this.settings.fatGoal;
        document.getElementById('waterGoal').value = this.settings.waterGoal;
        document.getElementById('stepsGoal').value = this.settings.stepsGoal;
    }

    /* ===== UPDATE PROGRESS RING ===== */
    updateProgressRing(ringId, current, goal) {
        const ring = document.getElementById(ringId);
        if (!ring) return;

        const percentage = Math.min(100, (current / goal) * 100);
        const circumference = 2 * Math.PI * 50; // radius = 50
        const offset = circumference - (percentage / 100) * circumference;

        ring.style.strokeDashoffset = offset;

        // Change color based on progress
        if (percentage >= 100) {
            ring.style.stroke = '#27ae60'; // Green
        } else if (percentage >= 75) {
            ring.style.stroke = '#667eea'; // Purple
        } else if (percentage >= 50) {
            ring.style.stroke = '#f39c12'; // Orange
        } else {
            ring.style.stroke = '#e74c3c'; // Red
        }
    }

    /* ===== HANDLE FOOD SUBMIT ===== */
    async handleFoodSubmit(e) {
        e.preventDefault();

        const foodData = {
            name: document.getElementById('foodName').value.trim(),
            calories: parseFloat(document.getElementById('foodCalories').value),
            protein: parseFloat(document.getElementById('foodProtein').value) || 0,
            carbs: parseFloat(document.getElementById('foodCarbs').value) || 0,
            fat: parseFloat(document.getElementById('foodFat').value) || 0,
        };

        if (!foodData.name || isNaN(foodData.calories)) {
            alert('Please enter food name and calories');
            return;
        }

        try {
            await storage.addFood(foodData);
            await this.loadData();
            await this.renderDashboard();
            await this.renderNutrition();
            
            // Clear form
            e.target.reset();
            this.showNotification('Food logged successfully!');
        } catch (error) {
            console.error('Error adding food:', error);
            this.showNotification('Error adding food', 'error');
        }
    }

    /* ===== HANDLE FOOD DELETE ===== */
    async handleFoodDelete(foodId) {
        if (!confirm('Remove this food?')) return;

        try {
            await storage.removeFood(foodId);
            await this.loadData();
            await this.renderDashboard();
            await this.renderNutrition();
            this.showNotification('Food removed');
        } catch (error) {
            console.error('Error removing food:', error);
            this.showNotification('Error removing food', 'error');
        }
    }

    /* ===== HANDLE STEPS UPDATE ===== */
    async handleStepsUpdate() {
        const stepsInput = document.getElementById('stepsInput');
        const steps = parseInt(stepsInput.value) || 0;

        try {
            await storage.updateSteps(steps);
            await this.loadData();
            await this.renderDashboard();
            this.showNotification('Steps updated!');
        } catch (error) {
            console.error('Error updating steps:', error);
            this.showNotification('Error updating steps', 'error');
        }
    }

    /* ===== HANDLE WATER LOG ===== */
    async handleWaterLog() {
        const waterInput = document.getElementById('waterInput');
        const cups = parseFloat(waterInput.value) || 0;

        if (cups <= 0) {
            alert('Please enter water amount');
            return;
        }

        try {
            await storage.addWater(cups);
            await this.loadData();
            await this.renderDashboard();
            waterInput.value = '0';
            this.showNotification(`${cups} cups of water logged!`);
        } catch (error) {
            console.error('Error logging water:', error);
            this.showNotification('Error logging water', 'error');
        }
    }

    /* ===== HANDLE SETTINGS SAVE ===== */
    async handleSettingsSave(e) {
        e.preventDefault();

        const newSettings = {
            calorieGoal: parseInt(document.getElementById('calorieGoal').value),
            proteinGoal: parseInt(document.getElementById('proteinGoal').value),
            carbsGoal: parseInt(document.getElementById('carbsGoal').value),
            fatGoal: parseInt(document.getElementById('fatGoal').value),
            waterGoal: parseInt(document.getElementById('waterGoal').value),
            stepsGoal: parseInt(document.getElementById('stepsGoal').value),
        };

        try {
            storage.saveSettings(newSettings);
            await this.loadData();
            await this.renderDashboard();
            this.showNotification('Goals saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showNotification('Error saving goals', 'error');
        }
    }

    /* ===== HANDLE EXPORT DATA ===== */
    async handleExportData() {
        try {
            await storage.exportAsFile();
            this.showNotification('Data exported successfully!');
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showNotification('Error exporting data', 'error');
        }
    }

    /* ===== HANDLE CLEAR DATA ===== */
    async handleClearData() {
        if (!confirm('Are you sure? This will delete ALL data. This cannot be undone.')) {
            return;
        }

        if (!confirm('Really delete everything?')) {
            return;
        }

        try {
            await storage.clearAllData();
            this.todayLog = storage.getDefaultLog();
            this.settings = storage.getDefaultSettings();
            await this.renderDashboard();
            await this.renderSettings();
            this.showNotification('All data cleared');
        } catch (error) {
            console.error('Error clearing data:', error);
            this.showNotification('Error clearing data', 'error');
        }
    }

    /* ===== UPDATE HEADER DATE ===== */
    updateHeaderDate() {
        const today = new Date();
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        const dateString = today.toLocaleDateString('en-US', options);
        document.getElementById('headerDate').textContent = dateString;
    }

    /* ===== SHOW NOTIFICATION ===== */
    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: ${type === 'error' ? '#e74c3c' : '#27ae60'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /* ===== ESCAPE HTML ===== */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

/* ===== INITIALIZE APP ON DOM READY ===== */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new NutriTrackApp();
    });
} else {
    window.app = new NutriTrackApp();
}

/* ===== NOTIFICATION ANIMATIONS ===== */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
