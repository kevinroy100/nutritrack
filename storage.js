/* ===== STORAGE MANAGEMENT ===== */
/* Handles all data persistence using IndexedDB and LocalStorage */

class StorageManager {
    constructor() {
        this.dbName = 'NutriTrackDB';
        this.dbVersion = 1;
        this.db = null;
        this.storeName = 'logs';
        this.settingsKey = 'nutritrack_settings';
    }

    /* ===== INITIALIZE DATABASE ===== */
    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                console.error('Database failed to open');
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('Database opened successfully');
                this.initializeSettings();
                resolve();
            };

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const objectStore = db.createObjectStore(this.storeName, { keyPath: 'date' });
                    objectStore.createIndex('date', 'date', { unique: true });
                }
            };
        });
    }

    /* ===== INITIALIZE SETTINGS ===== */
    initializeSettings() {
        if (!localStorage.getItem(this.settingsKey)) {
            localStorage.setItem(this.settingsKey, JSON.stringify(this.getDefaultSettings()));
        }
    }

    /* ===== GET DEFAULT LOG ===== */
    getDefaultLog() {
        return {
            date: this.getTodayDate(),
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
            water: 0,
            steps: 0,
            foods: []
        };
    }

    /* ===== GET DEFAULT SETTINGS ===== */
    getDefaultSettings() {
        return {
            calorieGoal: 2000,
            proteinGoal: 150,
            carbsGoal: 250,
            fatGoal: 65,
            waterGoal: 8,
            stepsGoal: 10000
        };
    }

    /* ===== GET TODAY'S DATE ===== */
    getTodayDate() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    /* ===== GET TODAY'S LOG ===== */
    async getTodayLog() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                resolve(this.getDefaultLog());
                return;
            }

            const transaction = this.db.transaction([this.storeName], 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.get(this.getTodayDate());

            request.onerror = () => {
                console.error('Error fetching today log');
                reject(request.error);
            };

            request.onsuccess = () => {
                const result = request.result || this.getDefaultLog();
                resolve(result);
            };
        });
    }

    /* ===== SAVE LOG ===== */
    async saveLog(log) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                resolve();
                return;
            }

            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.put(log);

            request.onerror = () => {
                console.error('Error saving log');
                reject(request.error);
            };

            request.onsuccess = () => {
                console.log('Log saved successfully');
                resolve();
            };
        });
    }

    /* ===== ADD FOOD ===== */
    async addFood(foodData) {
        const todayLog = await this.getTodayLog();
        
        const food = {
            id: Date.now(),
            name: foodData.name,
            calories: foodData.calories,
            protein: foodData.protein || 0,
            carbs: foodData.carbs || 0,
            fat: foodData.fat || 0
        };

        todayLog.foods.push(food);
        this.updateTotals(todayLog);
        await this.saveLog(todayLog);
    }

    /* ===== REMOVE FOOD ===== */
    async removeFood(foodId) {
        const todayLog = await this.getTodayLog();
        todayLog.foods = todayLog.foods.filter(food => food.id !== foodId);
        this.updateTotals(todayLog);
        await this.saveLog(todayLog);
    }

    /* ===== UPDATE TOTALS ===== */
    updateTotals(log) {
        log.totalCalories = 0;
        log.totalProtein = 0;
        log.totalCarbs = 0;
        log.totalFat = 0;

        log.foods.forEach(food => {
            log.totalCalories += food.calories;
            log.totalProtein += food.protein;
            log.totalCarbs += food.carbs;
            log.totalFat += food.fat;
        });
    }

    /* ===== UPDATE STEPS ===== */
    async updateSteps(steps) {
        const todayLog = await this.getTodayLog();
        todayLog.steps = steps;
        await this.saveLog(todayLog);
    }

    /* ===== ADD WATER ===== */
    async addWater(cups) {
        const todayLog = await this.getTodayLog();
        todayLog.water += cups;
        await this.saveLog(todayLog);
    }

    /* ===== GET SETTINGS ===== */
    getSettings() {
        const settings = localStorage.getItem(this.settingsKey);
        return settings ? JSON.parse(settings) : this.getDefaultSettings();
    }

    /* ===== SAVE SETTINGS ===== */
    saveSettings(settings) {
        localStorage.setItem(this.settingsKey, JSON.stringify(settings));
    }

    /* ===== EXPORT AS FILE ===== */
    async exportAsFile() {
        try {
            const todayLog = await this.getTodayLog();
            const settings = this.getSettings();
            
            const allLogs = await this.getAllLogs();
            
            const exportData = {
                exportDate: new Date().toISOString(),
                todayLog: todayLog,
                settings: settings,
                allLogs: allLogs
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `nutritrack-data-${this.getTodayDate()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting data:', error);
            throw error;
        }
    }

    /* ===== GET ALL LOGS ===== */
    async getAllLogs() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                resolve([]);
                return;
            }

            const transaction = this.db.transaction([this.storeName], 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.getAll();

            request.onerror = () => {
                console.error('Error fetching all logs');
                reject(request.error);
            };

            request.onsuccess = () => {
                resolve(request.result);
            };
        });
    }

    /* ===== CLEAR ALL DATA ===== */
    async clearAllData() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                localStorage.removeItem(this.settingsKey);
                resolve();
                return;
            }

            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.clear();

            request.onerror = () => {
                console.error('Error clearing data');
                reject(request.error);
            };

            request.onsuccess = () => {
                localStorage.removeItem(this.settingsKey);
                this.initializeSettings();
                console.log('All data cleared');
                resolve();
            };
        });
    }
}

/* ===== INITIALIZE STORAGE MANAGER ===== */
const storage = new StorageManager();
