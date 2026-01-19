import React, { useState, useRef, useEffect, useMemo } from "react";
import moment from "moment";
import { BsThreeDots } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { BiTrash } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { deleteTransaction, loadTransactionForEdit } from "../store/transactionSlice";
import ConfirmModal from "../components/ConfirmModal";

const TransactionsList = () => {
  const dispatch = useDispatch();
  const allTransactions = useSelector((state) => state.transactions.transactions);
  const filters = useSelector((state) => state.transactions.filters);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, transactionId: null });
  const menuRefs = useRef({});

  // Filter transactions based on filter state
  const transactions = useMemo(() => {
    let filtered = [...allTransactions];

    // Filter by date range using moment for proper date comparison
    if (filters.startDate) {
      filtered = filtered.filter((tx) => {
        if (!tx.date) return false;
        // Try to parse transaction date (could be DD-MM-YYYY or YYYY-MM-DD)
        const txMoment = moment(tx.date, ["DD-MM-YYYY", "YYYY-MM-DD"], true);
        // Try to parse filter date (could be DD-MM-YYYY or YYYY-MM-DD)
        const startMoment = moment(filters.startDate, ["DD-MM-YYYY", "YYYY-MM-DD"], true);
        return txMoment.isValid() && startMoment.isValid() && txMoment.isSameOrAfter(startMoment, "day");
      });
    }

    if (filters.endDate) {
      filtered = filtered.filter((tx) => {
        if (!tx.date) return false;
        // Try to parse transaction date (could be DD-MM-YYYY or YYYY-MM-DD)
        const txMoment = moment(tx.date, ["DD-MM-YYYY", "YYYY-MM-DD"], true);
        // Try to parse filter date (could be DD-MM-YYYY or YYYY-MM-DD)
        const endMoment = moment(filters.endDate, ["DD-MM-YYYY", "YYYY-MM-DD"], true);
        return txMoment.isValid() && endMoment.isValid() && txMoment.isSameOrBefore(endMoment, "day");
      });
    }

    // Filter by type
    if (filters.type) {
      filtered = filtered.filter((tx) => tx.type === filters.type);
    }

    return filtered;
  }, [allTransactions, filters]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && menuRefs.current[openMenuId] && !menuRefs.current[openMenuId].contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const handleEdit = (transactionId) => {
    dispatch(loadTransactionForEdit(transactionId));
    setOpenMenuId(null);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteClick = (transactionId) => {
    setDeleteConfirm({ isOpen: true, transactionId });
    setOpenMenuId(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm.transactionId) {
      dispatch(deleteTransaction(deleteConfirm.transactionId));
      setDeleteConfirm({ isOpen: false, transactionId: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, transactionId: null });
  };

  const getSourceOrName = (tx) => {
    if (tx.type === "income") {
      return tx.Income_From || "-";
    } else if (tx.type === "salary") {
      return tx.employeeName || "-";
    } else {
      return "-";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 w-full ">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          All Transactions
        </h2>
        <span className="text-sm text-gray-500">
          {transactions.length} {transactions.length === 1 ? "record" : "records"}
          {filters.startDate || filters.endDate || filters.type ? (
            <span className="ml-2 text-blue-600">(filtered)</span>
          ) : null}
        </span>
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden mb-15">
        <table className="w-full text-sm mb-25">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-left font-medium">Name / Source</th>
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium">Amount</th>
              <th className="px-4 py-3 text-left font-medium">Payment Mode</th>
              <th className="px-4 py-3 text-left font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* Date */}
                  <td className="px-4 py-4 text-gray-700">
                    {formatDate(tx.date)}
                  </td>

                  {/* Type badge */}
                  <td className="px-4 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          tx.type === "income"
                            ? "bg-blue-100 text-blue-700"
                            : tx.type === "salary"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {tx.type === "income"
                        ? "Income"
                        : tx.type === "salary"
                        ? "Salary"
                        : "Misc Cost"}
                    </span>
                  </td>

                  {/* Name / Source */}
                  <td className="px-4 py-4 text-gray-800">
                    {getSourceOrName(tx)}
                  </td>

                  {/* Title */}
                  <td className="px-4 py-4 text-gray-700">
                    {tx.title || "-"}
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-4  font-semibold text-green-600">
                    ₹{Number(tx.amount || 0).toLocaleString("en-IN")}
                  </td>

                  {/* Payment Mode */}
                  <td className="px-4 py-4 text-gray-600 capitalize">
                    {tx.paymentMode || "-"}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-4  relative">
                    <div className="relative inline-block">
                      <BsThreeDots
                        className="text-gray-500 cursor-pointer hover:text-gray-700"
                        onClick={() => setOpenMenuId(openMenuId === tx.id ? null : tx.id)}
                      />
                      {openMenuId === tx.id && (
                        <div
                          ref={(el) => (menuRefs.current[tx.id] = el)}
                          className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                        >
                          <button
                            onClick={() => handleEdit(tx.id)}
                            className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                          >
                             <BiEdit className="text-gray-500" /><span>Edit</span>
                           
                          </button>
                          <button
                            onClick={() => handleDeleteClick(tx.id)}
                            className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                          >
                            <BiTrash className="text-red-500" /><span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-6 text-center text-gray-400"
                >
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
      />
    </div>
  );
};

export default TransactionsList;
