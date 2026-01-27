import { Transaction } from "./supabase";

const STORAGE_KEY = "app_transactions";

export const storageService = {
  // Get all transactions
  getTransactions(): Transaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      
      const transactions = JSON.parse(data);
      // Ensure created_at and updated_at are strings
      return transactions.map((t: any) => ({
        ...t,
        created_at: t.created_at || new Date().toISOString(),
        updated_at: t.updated_at || new Date().toISOString(),
      }));
    } catch (error) {
      console.error("Error reading transactions from localStorage:", error);
      return [];
    }
  },

  // Save a single transaction
  saveTransaction(transaction: Omit<Transaction, "id" | "created_at" | "updated_at">): Transaction {
    const transactions = this.getTransactions();
    const newTransaction: Transaction = {
      ...transaction,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    transactions.push(newTransaction);
    this.saveTransactions(transactions);
    return newTransaction;
  },

  // Update a transaction
  updateTransaction(id: string, updates: Partial<Transaction>): Transaction | null {
    const transactions = this.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    
    if (index === -1) return null;

    const updatedTransaction = {
      ...transactions[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    transactions[index] = updatedTransaction;
    this.saveTransactions(transactions);
    return updatedTransaction;
  },

  // Delete a transaction
  deleteTransaction(id: string): boolean {
    const transactions = this.getTransactions();
    const filteredTransactions = transactions.filter(t => t.id !== id);
    
    if (filteredTransactions.length === transactions.length) return false;

    this.saveTransactions(filteredTransactions);
    return true;
  },

  // Save multiple transactions (for import)
  saveTransactions(transactions: Transaction[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error("Error saving transactions to localStorage:", error);
      throw new Error("Gagal menyimpan data");
    }
  },

  // Clear all transactions
  clearTransactions(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Generate unique ID
  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // Get transactions count
  getTransactionsCount(): number {
    return this.getTransactions().length;
  }
};
