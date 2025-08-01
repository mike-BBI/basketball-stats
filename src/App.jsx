import { useEffect, useState } from "react";
import Papa from "papaparse";

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vStWvLtFSKMFjCtHqDsmSKPjC-sID47BtU_34o-rtb_wbCQfqiOWyPc6RYvZilkN-Ktt4h-nnbHDEVn/pub?output=csv";

export default function App() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    Papa.parse(SHEET_CSV_URL, {
      download: true,
      header: true,
      complete: (results) => setPlayers(results.data),
    });
  }, []);

  return (
    <div className="min-h-screen bg-white px-6 py-10 font-sans">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
        2025 WNBA LEBRON
      </h1>

      <div className="max-w-7xl mx-auto border border-gray-200 rounded-md shadow">
        <div className="h-[600px] overflow-y-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                {[
                  "Player",
                  "Current Team",
                  "Offensive Role",
                  "Minutes Played",
                  "LEBRON",
                  "O-LEBRON",
                  "D-LEBRON",
                  "LEBRON Rank",
                  "O-LEBRON Rank",
                  "D-LEBRON Rank",
                ].map((header, idx) => (
                  <th
                    key={idx}
                    className="sticky top-0 z-10 bg-gray-100 px-4 py-2"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-800">
              {players.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{p["Player"]}</td>
                  <td className="px-4 py-2">{p["Current Team"]}</td>
                  <td className="px-4 py-2">{p["Offensive Role"]}</td>
                  <td className="px-4 py-2 text-right">{p["Minutes Played"]}</td>
                  <td className="px-4 py-2 text-right">{p["LEBRON"]}</td>
                  <td className="px-4 py-2 text-right">{p["O-LEBRON"]}</td>
                  <td className="px-4 py-2 text-right">{p["D-LEBRON"]}</td>
                  <td className="px-4 py-2 text-right">{p["LEBRON Rank"]}</td>
                  <td className="px-4 py-2 text-right">{p["O-LEBRON Rank"]}</td>
                  <td className="px-4 py-2 text-right">{p["D-LEBRON Rank"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
