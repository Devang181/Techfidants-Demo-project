import React from 'react'
import AddTransaction from './AddTransaction'
import TransactionsList from './TransactionsList'
import SummaryCards from './SummaryCard'
import Filter from './Filter'

const Budget = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Budget Management</h1>
          <p className="text-gray-600 text-lg">Track income, expenses, and analyze your financial position</p>
        </div>

        {/* Add Transaction Component */}
        <div className="mb-6">
          <AddTransaction />
        </div>

        <SummaryCards />
        <Filter />

        {/* Transactions List Component */}
        <div>
        <TransactionsList />

        </div>
      </div>
    </div>
  )
}

export default Budget

