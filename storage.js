/* ===== STORAGE LAYER ===== */
/* Handles localStorage and IndexedDB for data persistence */

class NutriTrackStorage {
    constructor() {
        this.dbName = 'NutriTrackDB';
        this.storeName = 'dailyLogs';
        this.settingsKey = 'nutritrack_settings';
        this.db = null;
        this.initDB();
    }

    /* ===== INITIALIZE INDEXEDDB ===== */
    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { keyPath: 'date' });
                    store.createIndex('date', 'date', { unique: true });
                }
            };
        });
    }

    /* ===== TODAY'S DATE KEY ===== */
    getTodayKey() {
        const today = new Date();
        return today.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    /* ===== GET TODAY'S LOG ===== */
    async getTodayLog() {
        const key = this.getTodayKey();
        return new Promise((resolve, reject) => {
            if (!this.db) {
                resolve(this.getDefaultLog(key));
                return;
            }

            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const log = request.result || this.getDefaultLog(key);
                resolve(log);
            };
        });
    }

    /* ===== SAVE TODAY'S LOG ===== */
    async saveTodayLog(logData) {
        const key = this.getTodayKey();
        logData.date = key;

        return new Promise((resolve, reject) => {
            if (!this.db) {
                // Fallback to localStorage
                localStorage.setItem('nutritrack_today', JSON.stringify(logData));
                resolve(logData);
                return;
            }

            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(logData);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(logData);
        });
    }

    /* ===== DEFAULT LOG STRUCTURE ===== */
    getDefaultLog(date = null) {
        return {
            date: date || this.getTodayKey(),
            foods: [],
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
            water: 0,
            steps: 0,
        };
    }

    /* ===== ADD FOOD ===== */
    async addFood(foodData) {
        const log = await this.getTodayLog();
        
        const food = {
            id: Date.now(),
            name: foodData.name,
            calories: parseFloat(foodData.calories) || 0,
            protein: parseFloat(foodData.protein) || 0,
            carbs: parseFloat(foodData.carbs) || 0,
            fat: parseFloat(foodData.fat) || 0,
            timestamp: new Date().toISOString(),
        };

        log.foods.push(food);
        log.totalCalories += food.calories;
        log.totalProtein += food.protein;
        log.totalCarbs += food.carbs;
        log.totalFat += food.fat;

        await this.saveTodayLog(log);
        return food;
    }

    /* ===== REMOVE FOOD ===== */
    async removeFood(foodId) {
        const log = await this.getTodayLog();
        const food = log.foods.find(f => f.id === foodId);

        if (!food) return null;

        log.totalCalories -= food.calories;
        log.totalProtein -= food.protein;
        log.totalCarbs -= food.carbs;
        log.totalFat -= food.fat;

        log.foods = log.foods.filter(f => f.id !== foodId);

        await this.saveTodayLog(log);
        return food;
    }

    /* ===== UPDATE STEPS ===== */
    async updateSteps(steps) {
        const log = await this.getTodayLog();
        log.steps = Math.max(0, parseInt(steps) || 0);
        await this.saveTodayLog(log);
        return log.steps;
    }

    /* ===== ADD WATER ===== */
    async addWater(cups) {
        const log = await this.getTodayLog();
        log.water += Math.max(0, parseFloat(cups) || 0);
        await this.saveTodayLog(log);
        return log.water;
    }

    /* ===== SET WATER ===== */
    async setWater(cups) {
        const log = await this.getTodayLog();
        log.water = Math.max(0, parseFloat(cups) || 0);
        await this.saveTodayLog(log);
        return log.water;
    }

    /* ===== GET SETTINGS ===== */
    getSettings() {
        const stored = localStorage.getItem(this.settingsKey);
        if (stored) {
            return JSON.parse(stored);
        }
        return this.getDefaultSettings();
    }

    /* ===== DEFAULT SETTINGS ===== */
    getDefaultSettings() {
        return {
            calorieGoal: 2000,
            proteinGoal: 150,
            carbsGoal: 250,
            fatGoal: 65,
            waterGoal: 8,
            stepsGoal: 10000,
        };
    }

    /* ===== SAVE SETTINGS ===== */
    saveSettings(settings) {
        const validated = {
            calorieGoal: Math.max(1000, parseInt(settings.calorieGoal) || 2000),
            proteinGoal: Math.max(0, parseInt(settings.proteinGoal) || 150),
            carbsGoal: Math.max(0, parseInt(settings.carbsGoal) || 250),
            fatGoal: Math.max(0, parseInt(settings.fatGoal) || 65),
            waterGoal: Math.max(1, parseInt(settings.waterGoal) || 8),
            stepsGoal: Math.max(1000, parseInt(settings.stepsGoal) || 10000),
        };
        localStorage.setItem(this.settingsKey, JSON.stringify(validated));
        return validated;
    }

    /* ===== GET ALL LOGS (HISTORY) ===== */
    async getAllLogs() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                resolve([]);
                return;
            }

            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const logs = request.result.sort((a, b) => 
                    new Date(b.date) - new Date(a.date)
                );
                resolve(logs);
            };
        });
    }

    /* ===== EXPORT DATA ===== */
    async exportData() {
        const logs = await this.getAllLogs();
        const settings = this.getSettings();
        const todayLog = await this.getTodayLog();

        const exportData = {
            exportDate: new Date().toISOString(),
            settings: settings,
            logs: logs,
        };

        return exportData;
    }

    /* ===== EXPORT AS JSON FILE ===== */
    async exportAsFile() {
        const data = await this.exportData();
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `nutritrack_export_${this.getTodayKey()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /* ===== IMPORT DATA ===== */
    async importData(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

            if (data.settings) {
                this.saveSettings(data.settings);
            }

            if (data.logs && Array.isArray(data.logs)) {
                return new Promise((resolve, reject) => {
                    if (!this.db) {
                        resolve(data.logs.length);
                        return;
                    }

                    const transaction = this.db.transaction([this.storeName], 'readwrite');
                    const store = transaction.objectStore(this.storeName);

                    let count = 0;
                    data.logs.forEach(log => {
                        store.put(log);
                        count++;
                    });

                    transaction.onerror = () => reject(transaction.error);
                    transaction.oncomplete = () => resolve(count);
                });
            }

            return 0;
        } catch (error) {
            console.error('Import error:', error);
            throw new Error('Invalid import format');
        }
    }

    /* ===== CLEAR ALL DATA ===== */
    async clearAllData() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                localStorage.removeItem('nutritrack_today');
                localStorage.removeItem(this.settingsKey);
                resolve();
                return;
            }

            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                localStorage.removeItem('nutritrack_today');
                resolve();
            };
        });
    }

    /* ===== DELETE SPECIFIC LOG ===== */
    async deleteLog(date) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                resolve();
                return;
            }

            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(date);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    /* ===== GET LOG BY DATE ===== */
    async getLogByDate(date) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                resolve(this.getDefaultLog(date));
                return;
            }

            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(date);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                resolve(request.result || this.getDefaultLog(date));
            };
        });
    }

    /* ===== GET LOGS FOR DATE RANGE ===== */
    async getLogsByDateRange(startDate, endDate) {
        const allLogs = await this.getAllLogs();
        return allLogs.filter(log => 
            log.date >= startDate && log.date <= endDate
        );
    }
}

/* ===== INITIALIZE STORAGE ===== */
const storage = new NutriTrackStorage();
