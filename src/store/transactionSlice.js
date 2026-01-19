import { createSlice } from '@reduxjs/toolkit';

// Load transactions from localStorage
const loadTransactionsFromStorage = () => {
  try {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      return JSON.parse(storedTransactions);
    }
  } catch (error) {
    console.error('Error loading transactions from localStorage:', error);
  }
  return [];
};

// Save transactions to localStorage
const saveTransactionsToStorage = (transactions) => {
  try {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions to localStorage:', error);
  }
};

const initialState = {
  transactions: loadTransactionsFromStorage(),
  currentTransaction: {
    type: "income",
    Income_From: "",
    employeeName: "",
    title: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    paymentMode: ""
  },
  editingId: null,
  filters: {
    startDate: "",
    endDate: "",
    type: "",
    activeFilter: "all"
  }
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    // Update current transaction form data
    updateTransactionForm: (state, action) => {
      state.currentTransaction = {
        ...state.currentTransaction,
        ...action.payload
      };
    },

    // Add a new transaction
    addTransaction: (state, action) => {
      const newTransaction = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString()
      };
      state.transactions.push(newTransaction);
      
      // Save to localStorage
      saveTransactionsToStorage(state.transactions);
      
      // Reset form after adding
      state.currentTransaction = {
        type: "income",
        Income_From: "",
        employeeName: "",
        title: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        paymentMode: ""
      };
    },

    // Update an existing transaction
    updateTransaction: (state, action) => {
      const { id, ...updatedData } = action.payload;
      const index = state.transactions.findIndex(t => t.id === id);
      if (index !== -1) {
        state.transactions[index] = {
          ...state.transactions[index],
          ...updatedData,
          updatedAt: new Date().toISOString()
        };
        // Save to localStorage
        saveTransactionsToStorage(state.transactions);
        // Reset editing state
        state.editingId = null;
        state.currentTransaction = {
          type: "income",
          Income_From: "",
          employeeName: "",
          title: "",
          amount: "",
          date: new Date().toISOString().split("T")[0],
          paymentMode: ""
        };
      }
    },

    // Delete a transaction
    deleteTransaction: (state, action) => {
      state.transactions = state.transactions.filter(
        t => t.id !== action.payload
      );
      // Save to localStorage
      saveTransactionsToStorage(state.transactions);
    },

    // Load transaction for editing
    loadTransactionForEdit: (state, action) => {
      const transaction = state.transactions.find(t => t.id === action.payload);
      if (transaction) {
        const { id, createdAt, updatedAt, ...transactionData } = transaction;
        state.currentTransaction = transactionData;
        state.editingId = id;
      }
    },

    // Cancel editing
    cancelEdit: (state) => {
      state.editingId = null;
      state.currentTransaction = {
        type: "income",
        Income_From: "",
        employeeName: "",
        title: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        paymentMode: ""
      };
    },

    // Update filters
    updateFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = {
        startDate: "",
        endDate: "",
        type: "",
        activeFilter: "all"
      };
    }
  }
});

export const {
  updateTransactionForm,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  loadTransactionForEdit,
  cancelEdit,
  updateFilters,
  clearFilters
} = transactionSlice.actions;

export default transactionSlice.reducer;

