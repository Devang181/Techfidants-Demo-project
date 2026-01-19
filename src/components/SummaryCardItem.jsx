import React from "react";

const SummaryCardItem = ({
  title,
  amount,
  subtitle,
  icon,
  bgColor,
  borderColor,
  textColor,
  iconBgColor,
  iconColor,
}) => {
  return (
    <div className={`flex flex-1 ${bgColor} border ${borderColor} rounded-xl p-5 justify-between`}>
      <div>
        <p className={`text-sm font-medium ${textColor}`}>{title}</p>
        <p className={`text-3xl font-semibold mt-1 ${textColor}`}>₹{amount}</p>
        <p className={`text-xs mt-3 flex items-center gap-1 ${textColor}`}>
          {subtitle}
        </p>
      </div>
      <div className={`${iconBgColor} rounded-full flex items-center justify-center w-8 h-8 leading-0`}>
        {React.cloneElement(icon, { className: `${iconColor} w-5 h-5 block` })}
      </div>
    </div>
  );
};

export default SummaryCardItem;
