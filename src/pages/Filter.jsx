import React from "react"
import moment from "moment";
import { CiFilter } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import { updateFilters, clearFilters } from "../store/transactionSlice";

const Filter = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.transactions.filters);
  const today = moment().format("DD-MM-YYYY")

  const handleQuick = (value) => {
    let startDate = ""
    let endDate = ""

    if (value === "all") {
      startDate = ""
      endDate = ""
    } else if (value === "today") {
      startDate = today
      endDate = today
    } else if (value === "week") {
      // Start from the Sunday of the current week
      startDate = moment().startOf("week").format("DD-MM-YYYY")
      // End at today to keep it "current week"
      endDate = moment().endOf("week").format("DD-MM-YYYY")
    } else if (value === "month") {
      // Current calendar month: from 1st of this month to today
      startDate = moment().startOf("month").format("DD-MM-YYYY")
      endDate = moment().endOf("month").format("DD-MM-YYYY")
    }

    dispatch(updateFilters({ startDate, endDate, activeFilter: value }))
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
  }

  return (
    <div className="bg-white rounded-xl shadow-sm  p-4 w-full mb-6">
      <div className="flex items-center gap-3 flex-wrap">

        {/* Filters icon */}
        <div className="flex items-center gap-2 text-gray-600 font-medium">
          <CiFilter  className="w-5 h-5" />
          Filters:
        </div>

        {/* Quick buttons */}
        {[
          { label: "All Time", value: "all" },
          { label: "Today", value: "today" },
          { label: "This Week", value: "week" },
          { label: "This Month", value: "month" },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => handleQuick(item.value)}
            className={`px-4 py-2 rounded-lg text-sm border transition
              ${
                filters.activeFilter === item.value
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            {item.label}
          </button>
        ))}

        {/* Start date */}
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm">
         
          <input
            type="date"
            value={filters.startDate ? moment(filters.startDate, ["DD-MM-YYYY", "YYYY-MM-DD"], true).format("YYYY-MM-DD") : ""}
            onChange={(e) => {
              const dateValue = e.target.value ? moment(e.target.value).format("DD-MM-YYYY") : "";
              dispatch(updateFilters({ ...filters, startDate: dateValue, activeFilter: "" }))
            }}
            className="outline-none"
          />
        </div>

        <span className="text-gray-500 text-sm">to</span>

        {/* End date */}
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm">
          
          <input
            type="date"
            value={filters.endDate ? moment(filters.endDate, ["DD-MM-YYYY", "YYYY-MM-DD"], true).format("YYYY-MM-DD") : ""}
            onChange={(e) => {
              const dateValue = e.target.value ? moment(e.target.value).format("DD-MM-YYYY") : "";
              dispatch(updateFilters({ ...filters, endDate: dateValue, activeFilter: "" }))
            }}
            className="outline-none"
          />
        </div>

        {/* Type select */}
        <select
          value={filters.type}
          onChange={(e) => {
            dispatch(updateFilters({ ...filters, type: e.target.value }))
          }}
          className="border rounded-lg px-4 py-2 text-sm outline-none"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="salary">Salary</option>
          <option value="misc cost">Misc Cost</option>
        </select>
        <button 
          onClick={handleClearFilters}
          className="text-sm text-gray-500 hover:text-gray-700 transition"
        >
          Clear Filters
        </button>
      </div>    
      
    </div>
  )
}

export default Filter
