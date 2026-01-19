import React from "react";
import { useSelector } from "react-redux";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { BiWallet } from "react-icons/bi";

import SummaryCardItem from "../components/SummaryCardItem";

const SummaryCards = () => {
  const transactions = useSelector((state) => state.transactions.transactions);

  const totalIncome = transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0);

  const totalExpenses = transactions
    .filter((tx) => tx.type === "salary" || tx.type === "misc cost")
    .reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0);

  const netProfit = totalIncome - totalExpenses;
  const isProfit = netProfit >= 0;

  const formatNumber = (num) =>
    num.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 bg-gray-50 rounded-xl mb-6">
      <SummaryCardItem
        title="Total Income"
        amount={formatNumber(totalIncome)}
        subtitle="Based on current filters"
        icon={<FaArrowTrendUp />}
        bgColor="bg-green-50"
        borderColor="border-green-200"
        textColor="text-green-700"
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      />

      <SummaryCardItem
        title="Total Expenses"
        amount={formatNumber(totalExpenses)}
        subtitle="Based on current filters"
        icon={<FaArrowTrendDown />}
        bgColor="bg-red-50"
        borderColor="border-red-200"
        textColor="text-red-700"
        iconBgColor="bg-red-100"
        iconColor="text-red-600"
      />
        
      <SummaryCardItem
        title={isProfit ? "Net Profit" : "Net Loss"}
        amount={formatNumber(netProfit) }
        subtitle="Based on current filters"
        icon={<BiWallet />}
        bgColor={isProfit ? "bg-green-50" : "bg-red-50"}
        borderColor={isProfit ? "border-green-200" : "border-red-200"}
        textColor={isProfit ? "text-green-700" : "text-red-700"}
        iconBgColor={isProfit ? "bg-green-100" : "bg-red-100"}
        iconColor={isProfit ? "text-green-600" : "text-red-600"}
      />
    </div>
  );
};

export default SummaryCards;
