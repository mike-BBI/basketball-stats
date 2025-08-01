import { useEffect, useState } from "react";
import Papa from "papaparse";

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vStWvLtFSKMFjCtHqDsmSKPjC-sID47BtU_34o-rtb_wbCQfqiOWyPc6RYvZilkN-Ktt4h-nnbHDEVn/pub?output=csv";

export default function App() {
  const [players, setPlayers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "desc" });

  useEffect(() => {
    Papa.parse(SHEET_CSV_URL, {
      download: true,
      header: true,
      complete: (results) => setPlayers(results.data),
      error: (err) => console.error("CSV load error:", err),
    });
  }, []);

  const sortedPlayers = [...players].sort((a, b) => {
    const key = sortConfig.key;
    if (!key) return 0;
    const aVal = parseFloat(a[key]) || 0;
    const bVal = parseFloat(b[key]) || 0;
    return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
  });

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getColorClass = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return "";
    if (num > 2) return "bg-green-100 text-green-800 font-semibold";
    if (num > 0.5) return "bg-green-50 text-green-700";
    if (num < -2) return "bg-red-100 text-red-800 font-semibold";
    if (num < -0.5) return "bg-red-50 text-red-700";
    return "text-gray-700";
  };

  const sortableHeader = (label, key, align = "left") => (
    <th
      onClick={() => requestSort(key)}
      className={`sticky top-0 z-10 bg-gray-50 px-3 py-2 cursor-pointer text-${align} text-[11px] uppercase tracking-wider border-b border-gray-300`}
    >
      {label}
      {sortConfig.key === key ? (sortConfig.direction === "asc" ? " ▲" : " ▼") : ""}
    </th>
  );

  return (
    <div className="bg-white min-h-screen px-4 py-8 font-sans">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 tracking-tight">
        2025 WNBA LEBRON
      </h1>

      <div className="max-w-6xl mx-auto border border-gray-200 rounded-lg shadow overflow-hidden">
        <div className="overflow-auto max-h-[600px] relative">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                {sortableHeader("Player", "Player")}
                {sortableHeader("Team", "Current Team")}
                {sortableHeader("Role", "Offensive Role")}
                {sortableHeader("Minutes", "Minutes Played", "right")}
                {sortableHeader("LEBRON", "LEBRON", "right")}
                {sortableHeader("O-LEBRON", "O-LEBRON", "right")}
                {sortableHeader("D-LEBRON", "D-LEBRON", "right")}
                {sortableHeader("Rank", "LEBRON Rank", "right")}
                {sortableHeader("O-Rank", "O-LEBRON Rank", "right")}
                {sortableHeader("D-Rank", "D-LEBRON Rank", "right")}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-900">
              {sortedPlayers.map((p, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="px-3 py-2">{p["Player"]}</td>
                  <td className="px-3 py-2">{p["Current Team"]}</td>
                  <td className="px-3 py-2">{p["Offensive Role"]}</td>
                  <td className="px-3 py-2 text-right">{p["Minutes Played"]}</td>
                  <td className={`px-3 py-2 text-right ${getColorClass(p["LEBRON"])}`}>
                    {p["LEBRON"]}
                  </td>
                  <td className={`px-3 py-2 text-right ${getColorClass(p["O-LEBRON"])}`}>
                    {p["O-LEBRON"]}
                  </td>
                  <td className={`px-3 py-2 text-right ${getColorClass(p["D-LEBRON"])}`}>
                    {p["D-LEBRON"]}
                  </td>
                  <td className="px-3 py-2 text-right">{p["LEBRON Rank"]}</td>
                  <td className="px-3 py-2 text-right">{p["O-LEBRON Rank"]}</td>
                  <td className="px-3 py-2 text-right">{p["D-LEBRON Rank"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
