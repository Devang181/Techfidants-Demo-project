import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import {
  updateTransactionForm,
  addTransaction,
  updateTransaction,
  cancelEdit
} from "../store/transactionSlice";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";

const AddTransaction = () => {
  const dispatch = useDispatch();
  const currentTransaction = useSelector(
    (state) => state.transactions.currentTransaction
  );
  const editingId = useSelector((state) => state.transactions.editingId);

  const normalizedInitialValues = {
    ...currentTransaction,
    date: currentTransaction.date
      ? moment(currentTransaction.date).format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD")
  };

  const validationSchema = Yup.object({
    type: Yup.string()
      .oneOf(["income", "salary", "misc cost"], "Select a transaction type")
      .required("Transaction type is required"),
    Income_From: Yup.string().when("type", {
      is: "income",
      then: (schema) => schema.required("Income from is required"),
      otherwise: (schema) => schema.notRequired()
    }),
    employeeName: Yup.string().when("type", {
      is: "salary",
      then: (schema) => schema.required("Employee name is required"),
      otherwise: (schema) => schema.notRequired()
    }),
    title: Yup.string().required("Title is required"),
    amount: Yup.number()
      .typeError("Amount must be a number")
      .positive("Amount must be greater than zero")
      .required("Amount is required"),
    date: Yup.string()
      .required("Date is required")
      .test("valid-date", "Invalid date", (value) =>
        value ? moment(value, "YYYY-MM-DD", true).isValid() : false
      ),
    paymentMode: Yup.string().required("Payment mode is required")
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: normalizedInitialValues,
    validationSchema,
    onSubmit: (values) => {
      // Date is already in YYYY-MM-DD format from HTML5 date input
      const payload = { ...values };
      if (editingId) {
        dispatch(updateTransaction({ id: editingId, ...payload }));
      } else {
        dispatch(addTransaction(payload));
      }
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // HTML5 date input already returns YYYY-MM-DD format, no conversion needed
    formik.setFieldValue(name, value);
    dispatch(updateTransactionForm({ [name]: value }));
  };

  const handleBlur = (e) => {
    formik.handleBlur(e);
  };

  const handleCancel = () => {
    dispatch(cancelEdit());
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {editingId ? "Edit Transaction" : "Add Transaction"}
        </h2>
        {editingId && (
          <button
            onClick={handleCancel}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={formik.handleSubmit}  className="space-y-5">

        {/* Transaction Type */}
        <FormSelect
          label="Transaction Type"
          name="type"
          value={formik.values.type}
          onChange={handleChange}
          onBlur={handleBlur}
          error={
            formik.touched.type && formik.errors.type ? formik.errors.type : ""
          }
          
          options={[
            { label: "Income", value: "income" },
            { label: "Salary", value: "salary" },
            { label: "Misc Cost", value: "misc cost" }
          ]}
        />

        {/* ================= INCOME ================= */}
        {formik.values.type === "income" && (
          <div className="grid grid-cols-5 gap-4">
            <FormInput
              label="Income From"
              name="Income_From"
              value={formik.values.Income_From}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                formik.touched.Income_From && formik.errors.Income_From
                  ? formik.errors.Income_From
                  : ""
              }
              
              placeholder="Income Source"
            />

            <FormInput
              label="Title"
              name="title"
              value={formik.values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                formik.touched.title && formik.errors.title
                  ? formik.errors.title
                  : ""
              }
              
              placeholder="Transaction Title"
            />

            <FormInput
              label="Amount"
              name="amount"
              type="number"
              value={formik.values.amount}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                formik.touched.amount && formik.errors.amount
                  ? formik.errors.amount
                  : ""
              }
              
              placeholder="10000"
            />

            <FormInput
              label="Date"
              name="date"
              type="date"
              value={formik.values.date}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                formik.touched.date && formik.errors.date
                  ? formik.errors.date
                  : ""
              }
              
            />

            <FormSelect
              label="Payment Mode"
              name="paymentMode"
              value={formik.values.paymentMode}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                formik.touched.paymentMode && formik.errors.paymentMode
                  ? formik.errors.paymentMode
                  : ""
              }
              
              options={[
                { label: "Bank", value: "bank" },
                { label: "Cash", value: "cash" }
              ]}
            />
          </div>
        )}

        {/* ================= SALARY ================= */}
        {formik.values.type === "salary" && (
          <div className="grid grid-cols-5 gap-4">
            <FormInput
              label="Employee Name"
              name="employeeName"
              value={formik.values.employeeName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                formik.touched.employeeName && formik.errors.employeeName
                  ? formik.errors.employeeName
                  : ""
              }
              
              placeholder="Employee Name"
            />

            <FormInput
              label="Title"
              name="title"
              value={formik.values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                formik.touched.title && formik.errors.title
                  ? formik.errors.title
                  : ""
              }
              
              placeholder="Transaction Title"
            />

            <FormInput
              label="Amount"
              name="amount"
              type="number"
              value={formik.values.amount}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                formik.touched.amount && formik.errors.amount
                  ? formik.errors.amount
                  : ""
              }
              
              placeholder="10000"
            />

            <FormInput
              label="Date"
              name="date"
              type="date"
              value={formik.values.date}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                formik.touched.date && formik.errors.date
                  ? formik.errors.date
                  : ""
              }
              
            />

            <FormSelect
              label="Payment Mode"
              name="paymentMode"
              value={formik.values.paymentMode}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                formik.touched.paymentMode && formik.errors.paymentMode
                  ? formik.errors.paymentMode
                  : ""
              }
              
              options={[
                { label: "Bank", value: "bank" },
                { label: "Cash", value: "cash" }
              ]}
            />
          </div>
        )}

        {/* ================= MISC COST ================= */}
        {formik.values.type === "misc cost" && (
          <div className="grid grid-cols-4 gap-4">
            <FormInput
              label="Title"
              name="title"
              value={formik.values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                formik.touched.title && formik.errors.title
                  ? formik.errors.title
                  : ""
              }
              
              placeholder="Transaction Title"
            />

            <FormInput
              label="Amount"
              name="amount"
              type="number"
              value={formik.values.amount}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                formik.touched.amount && formik.errors.amount
                  ? formik.errors.amount
                  : ""
              }
              
              placeholder="10000"
            />

            <FormInput
              label="Date"
              name="date"
              type="date"
              value={formik.values.date}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                formik.touched.date && formik.errors.date
                  ? formik.errors.date
                  : ""
              }
              
            />

            <FormSelect
              label="Payment Mode"
              name="paymentMode"
              value={formik.values.paymentMode}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                formik.touched.paymentMode && formik.errors.paymentMode
                  ? formik.errors.paymentMode
                  : ""
              }
              required
              options={[
                { label: "Bank", value: "bank" },
                { label: "Cash", value: "cash" }
              ]}
            />
          </div>
        )}

        <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            {editingId ? "Update Transaction" : "Save Transaction"}
          </button>

      </form>
    </div>
  );
};

export default AddTransaction;
