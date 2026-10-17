import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { formatCurrency, formatMonth } from "../utils/format";

const COLORS = ["#A2B5E2", "#A9B67C", "#F3D883", "#EAA4C1", "#E87CA6", "#1A1A1A"];

function EmptyChart({ text }) {
  return <p className="py-16 text-center text-[#1A1A1A]/60">{text}</p>;
}

export function ExpensePieChart({ data }) {
  if (data.length === 0) return <EmptyChart text="No expenses in this period." />;

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="total" nameKey="category" outerRadius={100}>
            {data.map((d, i) => (
              <Cell key={d.category} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => formatCurrency(v)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MonthlyBarChart({ data }) {
  if (data.length === 0) return <EmptyChart text="No data in this period." />;
  const rows = data.map((d) => ({ ...d, label: formatMonth(d.month) }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EBE6D8" />
          <XAxis dataKey="label" stroke="#1A1A1A" />
          <YAxis stroke="#1A1A1A" />
          <Tooltip formatter={(v) => formatCurrency(v)} />
          <Legend />
          <Bar dataKey="income" name="Income" fill="#A9B67C" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" name="Expense" fill="#EAA4C1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}