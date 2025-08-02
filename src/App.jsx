import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Papa from "papaparse";

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTuzTZgkvYRKJ4ViQSDTndoVyQQXycIgEEDNTgwwnZE3O5j4AxHM0Xi1q45m6Uv9eThUWO4V4zHC3N_/pub?gid=0&single=true&output=csv";

const STANDINGS_SHEET_URL = 
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQ9OYi-dBc7irC7wwXkPvqJzLi7PAf87EYjxOnFJFacRXV4rmsi3UY_fKtwp2odLAym6s4J2S0QNV35/pub?gid=0&single=true&output=csv";

const GAME_PROJECTIONS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ9OYi-dBc7irC7wwXkPvqJzLi7PAf87EYjxOnFJFacRXV4rmsi3UY_fKtwp2odLAym6s4J2S0QNV35/pub?gid=887014072&single=true&output=csv";

const TEAM_WINS_URL = 
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ9OYi-dBc7irC7wwXkPvqJzLi7PAf87EYjxOnFJFacRXV4rmsi3UY_fKtwp2odLAym6s4J2S0QNV35/pub?gid=1832300028&single=true&output=csv"


const TEAM_LEBRON_URL = 
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ9OYi-dBc7irC7wwXkPvqJzLi7PAf87EYjxOnFJFacRXV4rmsi3UY_fKtwp2odLAym6s4J2S0QNV35/pub?gid=1670159200&single=true&output=csv"

const teamStyles = {
  ATL: { bg: "#C8102E", color: "#469AF0" },
  CHI: { bg: "#418FDE", color: "#FFCD00" },
  CON: { bg: "#DC4405", color: "#041E42" },
  DAL: { bg: "#0C2340", color: "#C4D600" },
  GSV: { bg: "#AD96DC", color: "#000000" },
  IND: { bg: "#041E42", color: "#FFCD00" },
  LAS: { bg: "#702F8A", color: "#FFC72C" },
  LVA: { bg: "#000000", color: "#8A8D8F" },
  MIN: { bg: "#236192", color: "#78BE20" },
  NYL: { bg: "#6ECEB2", color: "#000000" },
  PHO: { bg: "#201747", color: "#CB6015" },
  SEA: { bg: "#2C5234", color: "#FBE122" },
  WAS: { bg: "#0C2340", color: "#C8102E" },
  FA: { bg: "#D8D8D8", color: "#000000" },
};

function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <img
          src="https://sp-ao.shortpixel.ai/client/to_webp,q_lossy,ret_img/https://www.bball-index.com/wp-content/uploads/2018/10/logo1-copy.png"
          alt="Logo"
          className="h-12 w-auto"
        />
        <Link to="/" className="hover:underline"> Player LEBRON</Link>
        <Link to="/team-lebron" className="hover:underline">Team LEBRON</Link>
        <Link to="/games" className="hover:underline">Game Projections</Link>
        <Link to="/standings" className="hover:underline">Projected Standings</Link>
        <Link to="/seeding" className="hover:underline">Playoff Seeding</Link>
        <Link to="/team-wins" className="hover:underline">Team Wins</Link>
      </div>
    </nav>
  );
}

function PlayerLEBRONPage() {
  const [players, setPlayers] = useState([]);
  const [filters, setFilters] = useState({
    Player: "",
    Team: "",
    "Offensive Archetype": "",
    Season: "",
  });
  const [sortKey, setSortKey] = useState("LEBRON");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    Papa.parse(SHEET_CSV_URL, {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data;
        setPlayers(data);

        const seasons = data.map((p) => parseInt(p.Season)).filter(Boolean);
        const maxSeason = Math.max(...seasons).toString();
        setFilters((f) => ({ ...f, Season: maxSeason }));
      },
    });
  }, []);

  const headers = [
    "Player",
    "Team",
    "Offensive Archetype",
    "Age",
    "GP",
    "MPG",
    "Minutes",
    "LEBRON",
    "O-LEBRON",
    "D-LEBRON",
    "LEBRON WAR",
  ];

  const interpolateColor = (value, min, max) => {
    if (value === undefined || isNaN(value)) return "transparent";
    const range = max - min;
    if (range === 0) return "transparent";
    const ratio = (value - min) / range;
    const midpoint = 0.5;

    let r, g, b;
    if (ratio < midpoint) {
      const t = ratio / midpoint;
      r = Math.round(200 + (240 - 200) * t);
      g = Math.round(100 + (240 - 100) * t);
      b = Math.round(100 + (240 - 100) * t);
    } else {
      const t = (ratio - midpoint) / (1 - midpoint);
      r = Math.round(240 - (240 - 100) * t);
      g = Math.round(240 - (240 - 200) * t);
      b = Math.round(240 - (240 - 100) * t);
    }
    return `rgb(${r},${g},${b})`;
  };

  const uniqueOptions = (key) => {
    const values = new Set(players.map((p) => p[key]).filter(Boolean));
    return Array.from(values).sort();
  };

  const filteredPlayers = players
    .filter((p) =>
      Object.entries(filters).every(
        ([key, value]) =>
          key === "Player"
            ? p[key]?.toLowerCase().includes(value.toLowerCase())
            : !value || p[key] === value
      )
    )
    .sort((a, b) => {
      const aVal = isNaN(a[sortKey]) ? a[sortKey] : parseFloat(a[sortKey]);
      const bVal = isNaN(b[sortKey]) ? b[sortKey] : parseFloat(b[sortKey]);
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const computeFilteredStatRanges = () => {
    const statKeys = ["LEBRON", "O-LEBRON", "D-LEBRON", "LEBRON WAR"];
    const ranges = {};
    statKeys.forEach((key) => {
      const values = filteredPlayers.map((p) => parseFloat(p[key])).filter((v) => !isNaN(v));
      ranges[key] = {
        min: Math.min(...values),
        max: Math.max(...values),
      };
    });
    return ranges;
  };

  const statRangesFiltered = computeFilteredStatRanges();

  const getGradientColor = (val, key) => {
    const num = parseFloat(val);
    if (isNaN(num) || !statRangesFiltered[key]) return { backgroundColor: "transparent", color: "black" };

    const { min, max } = statRangesFiltered[key];
    const bgColor = interpolateColor(num, min, max);
    return {
      backgroundColor: bgColor,
      color: "black",
    };
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 text-sm text-black font-sans">
      <div className="max-w-7xl mx-auto mb-4">
        <h1 className="text-2xl font-bold mb-4">WNBA LEBRON</h1>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            className="px-2 py-1 border rounded text-sm"
            placeholder="Search Player"
            value={filters["Player"]}
            onChange={(e) => setFilters({ ...filters, Player: e.target.value })}
          />
          <select
            className="px-2 py-1 border rounded text-sm"
            value={filters["Team"]}
            onChange={(e) => setFilters({ ...filters, Team: e.target.value })}
          >
            <option value="">All Teams</option>
            {uniqueOptions("Team").map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <select
            className="px-2 py-1 border rounded text-sm"
            value={filters["Offensive Archetype"]}
            onChange={(e) => setFilters({ ...filters, "Offensive Archetype": e.target.value })}
          >
            <option value="">All Roles</option>
            {uniqueOptions("Offensive Archetype").map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <select
            className="px-2 py-1 border rounded text-sm"
            value={filters["Season"]}
            onChange={(e) => setFilters({ ...filters, Season: e.target.value })}
          >
            {uniqueOptions("Season").sort((a, b) => b - a).map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="overflow-y-auto border rounded-lg shadow-md max-h-[75vh]">
          <table className="min-w-full text-sm text-center border-collapse">
            <thead className="bg-gray-800 text-white sticky top-0 z-10">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="px-2 sm:px-4 py-2 sm:py-3 text-xs font-semibold uppercase tracking-wider border-b border-gray-700 cursor-pointer"
                    onClick={() => {
                      const initialOrder = ["Player", "Team", "Offensive Archetype"].includes(header) ? "asc" : "desc";
                      if (sortKey === header) {
                        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                      } else {
                        setSortKey(header);
                        setSortOrder(initialOrder);
                      }
                    }}
                  >
                    {header}
                    {sortKey === header && (sortOrder === "asc" ? " ▲" : " ▼")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPlayers.map((p, i) => {
                const team = p.Team;
                const style = teamStyles[team] || { bg: "transparent", color: "black" };
                return (
                  <tr key={i} className="hover:bg-gray-100">
                    <td className="px-2 sm:px-4 py-2 font-medium text-center whitespace-nowrap" style={{ backgroundColor: style.bg, color: style.color }}>
                      {p["Player"]}
                    </td>
                    <td className="px-2 sm:px-4 py-2 font-bold text-center whitespace-nowrap" style={{ backgroundColor: style.bg, color: style.color }}>
                      {p["Team"]}
                    </td>
                    <td className="px-2 sm:px-4 py-2 text-center whitespace-nowrap" style={{ backgroundColor: style.bg, color: style.color }}>
                      {p["Offensive Archetype"]}
                    </td>
                    <td className="px-2 sm:px-4 py-2 text-center whitespace-nowrap" style={{ backgroundColor: style.bg, color: style.color }}>{p["Age"]}</td>
                    <td className="px-2 sm:px-4 py-2 text-center whitespace-nowrap" style={{ backgroundColor: style.bg, color: style.color }}>{p["GP"]}</td>
                    <td className="px-2 sm:px-4 py-2 text-center whitespace-nowrap" style={{ backgroundColor: style.bg, color: style.color }}>{p["MPG"]}</td>
                    <td className="px-2 sm:px-4 py-2 text-center whitespace-nowrap" style={{ backgroundColor: style.bg, color: style.color }}>{p["Minutes"]}</td>
                    {[
                      "LEBRON",
                      "O-LEBRON",
                      "D-LEBRON",
                      "LEBRON WAR",
                    ].map((key) => (
                      <td
                        key={key}
                        className="px-2 sm:px-4 py-2 text-center whitespace-nowrap"
                        style={getGradientColor(p[key], key)}
                      >
                        <div className="font-bold">{p[key]}</div>
                        {[
                          "LEBRON",
                          "O-LEBRON",
                          "D-LEBRON",
                        ].includes(key) && (
                          <div className="text-xs text-gray-600">{p[`${key} Rank`]}</div>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProjectedStandingsPage() {
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    Papa.parse(STANDINGS_SHEET_URL, {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data
          .filter((row) => row.Team && row.Pct)
          .map((row, idx) => ({ ...row, __index: idx }));
        data.sort((a, b) => parseFloat(b.Pct) - parseFloat(a.Pct));
        setStandings(data);
      },
    });
  }, []);

  const playoffFields = ["Playoffs", "Semifinals", "Finals", "Champ"];

  const getPlayoffColor = (valueStr) => {
    const val = parseFloat(valueStr) * 100;
    if (isNaN(val)) return "transparent";

    const ratio = val / 100;
    const midpoint = 0.5;

    let r, g, b;
    if (ratio < midpoint) {
      const t = ratio / midpoint;
      r = Math.round(200 + (240 - 200) * t);
      g = Math.round(100 + (240 - 100) * t);
      b = Math.round(100 + (240 - 100) * t);
    } else {
      const t = (ratio - midpoint) / (1 - midpoint);
      r = Math.round(240 - (240 - 100) * t);
      g = Math.round(240 - (240 - 200) * t);
      b = Math.round(240 - (240 - 100) * t);
    }
    return `rgb(${r},${g},${b})`;
  };

  const formatValue = (key, value) => {
    if (["W", "L"].includes(key)) {
      return parseFloat(value).toFixed(1);
    }
    if (key === "Pct") {
      return parseFloat(value).toFixed(3);
    }
    if (playoffFields.includes(key)) {
      const pct = parseFloat(value) * 100;
      return isNaN(pct) ? "-" : `${pct.toFixed(1)}%`;
    }
    return value;
  };

  const visibleHeaders = [
    "Seed",
    "Team",
    "Conference",
    "W",
    "L",
    "Pct",
    "Playoffs",
    "Semifinals",
    "Finals",
    "Champ",
  ];

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-6 text-sm font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Projected Standings</h1>
        <div className="overflow-x-auto border rounded-lg shadow-md">
          <table className="min-w-full text-center border-collapse">
            <thead className="bg-gray-800 text-white sticky top-0 z-10">
              <tr>
                {visibleHeaders.map((header) => (
                  <th
                    key={header}
                    className="px-2 sm:px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b border-gray-700 whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {standings.map((row, idx) => {
                const teamStyle = teamStyles[row.Team] || {
                  bg: "transparent",
                  color: "black",
                };
                return (
                  <tr key={idx} className="hover:bg-gray-100">
                    {visibleHeaders.map((key, colIdx) => {
                      const rawValue =
                        key === "Seed" ? idx + 1 : row[key] ?? "";

                      const isPlayoffField = playoffFields.includes(key);
                      const bgStyle = isPlayoffField
                        ? {
                            backgroundColor: getPlayoffColor(row[key]),
                            color: "black",
                          }
                        : {};

                      if (key === "Team") {
                        return (
                          <td
                            key={colIdx}
                            className="px-2 sm:px-4 py-2 font-bold text-center whitespace-nowrap"
                            style={{
                              backgroundColor: teamStyle.bg,
                              color: teamStyle.color,
                            }}
                          >
                            {row.Team}
                          </td>
                        );
                      }

                      return (
                        <td
                          key={colIdx}
                          className="px-2 sm:px-4 py-2 text-center whitespace-nowrap"
                          style={bgStyle}
                        >
                          {formatValue(key, rawValue)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function GameProjectionsPage() {
  const [games, setGames] = useState([]);

  const teamLogos = {
    ATL: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/atl.png",
    CHI: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/chi.png",
    CON: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/conn.png",
    DAL: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/dal.png",
    GSV: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/gs.png",
    IND: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/ind.png",
    LAS: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/la.png",
    LVA: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/lv.png",
    MIN: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/min.png",
    NYL: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/ny.png",
    PHO: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/phx.png",
    SEA: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/sea.png",
    WAS: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/wnba/500/wsh.png",
  };

  useEffect(() => {
    Papa.parse(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ9OYi-dBc7irC7wwXkPvqJzLi7PAf87EYjxOnFJFacRXV4rmsi3UY_fKtwp2odLAym6s4J2S0QNV35/pub?gid=887014072&single=true&output=csv",
      {
        download: true,
        header: true,
        complete: (results) => {
          const cleanedData = results.data.map((row) => {
            const cleanedRow = {};
            Object.keys(row).forEach((key) => {
              const cleanKey = key.trim();
              cleanedRow[cleanKey] = row[key];
            });
            return cleanedRow;
          });
          const filtered = cleanedData.filter((row) => row["Date"] && row["Away"] && row["Home"]);
          setGames(filtered);
        },
      }
    );
  }, []);

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-6 text-sm font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Game Projections</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {games.map((game, index) => {
            const mov = parseFloat(game["MOV"]);
            const total = parseFloat(game["Total"]);
            const showMovTop = mov > 0;

            const formattedMOV = !isNaN(mov) ? mov.toFixed(1) : "-";
            const formattedTotal = !isNaN(total) ? total.toFixed(1) : "-";

            return (
              <div
                key={index}
                className="border rounded-lg shadow-md p-4 flex flex-col justify-between min-h-[170px]"
              >
                <div className="text-xs text-gray-500 mb-1">
                  {game["Date"]} • {game["Time (ET)"]}
                </div>

                {/* Teams section with fixed spacing */}
                <div className="flex flex-col justify-start">
                  {/* Away team */}
                  <div className="flex justify-between items-center font-bold mt-2">
                    <div className="flex items-center space-x-2">
                      <img
                        src={teamLogos[game["Away"]]}
                        alt={game["Away"]}
                        className="w-5 h-5"
                      />
                      <span className="font-medium">{game["Away"]}</span>
                    </div>
                    <span className="text-sm text-gray-700">
                      {showMovTop ? (-mov).toFixed(1) : formattedTotal}
                    </span>
                  </div>

                  {/* Home team */}
                  <div className="flex justify-between items-center font-bold mt-2">
                    <div className="flex items-center space-x-2">
                      <img
                        src={teamLogos[game["Home"]]}
                        alt={game["Home"]}
                        className="w-5 h-5"
                      />
                      <span className="font-medium">{game["Home"]}</span>
                    </div>
                    <span className="text-sm text-gray-700">
                      {showMovTop ? formattedTotal : formattedMOV}
                    </span>
                  </div>
                </div>
                
                {/* Injury info */}
                <div className="mt-3 text-xs text-gray-600 h-16 flex flex-col justify-start">
                  <div className="pb-3">Out: {game["Out"] || "-"}</div>
                  <div>Ques: {game["Ques"] || "-"}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PlayoffSeedingPage() {
  const [seedData, setSeedData] = useState([]);

  useEffect(() => {
    Papa.parse(STANDINGS_SHEET_URL, {
      download: true,
      header: true,
      complete: (results) => {
        const filtered = results.data.filter((row) => row.Team && row.Seed);
        filtered.sort((a, b) => parseFloat(a.Seed) - parseFloat(b.Seed));
        setSeedData(filtered);
      },
    });
  }, []);

  const visibleHeaders = [
    "Team",
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13",
    "Average Seed",
  ];

  const headerMap = {
    "Seed1": "1", "Seed2": "2", "Seed3": "3", "Seed4": "4", "Seed5": "5",
    "Seed6": "6", "Seed7": "7", "Seed8": "8", "Seed9": "9", "Seed10": "10",
    "Seed11": "11", "Seed12": "12", "Seed13": "13", "Seed": "Average Seed",
  };

const getSeedCellStyle = (valueStr) => {
  const value = parseFloat(valueStr) * 100;
  if (isNaN(value)) return {};

  if (value === 0) {
    return {
      backgroundColor: "#e5e7eb", // light gray fill
      color: "#e5e7eb", // gray text to match fill (appears blank)
    };
  }

  // Clamp ratio between 0 and 1
  const ratio = Math.min(Math.max(value / 100, 0), 1);

  // Interpolate between white (255,255,255) and green (100,200,100)
  const r = Math.round(255 - (155 * ratio)); // 255 → 100
  const g = Math.round(255 - (55 * ratio));  // 255 → 200
  const b = Math.round(255 - (155 * ratio)); // 255 → 100

  return {
    backgroundColor: `rgb(${r}, ${g}, ${b})`,
    color: "black",
  };
};

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-6 text-sm font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Playoff Seeding</h1>
        <div className="overflow-x-auto border rounded-lg shadow-md">
          <table className="min-w-full text-center border-collapse">
            <thead className="bg-gray-800 text-white sticky top-0 z-10">
              <tr>
                {visibleHeaders.map((header) => (
                  <th
                    key={header}
                    className="px-2 sm:px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b border-gray-700 whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {seedData.map((row, idx) => {
                const teamStyle = teamStyles[row.Team] || {
                  bg: "transparent",
                  color: "black",
                };

                return (
                  <tr key={idx} className="hover:bg-gray-100">
                    {visibleHeaders.map((header, colIdx) => {
                      if (header === "Team") {
                        return (
                          <td
                            key={colIdx}
                            className="px-2 sm:px-4 py-2 font-bold text-center whitespace-nowrap"
                            style={{
                              backgroundColor: teamStyle.bg,
                              color: teamStyle.color,
                            }}
                          >
                            {row.Team}
                          </td>
                        );
                      }

                      if (header === "Average Seed") {
                        return (
                          <td key={colIdx} className="px-2 sm:px-4 py-2 text-center whitespace-nowrap">
                            {parseFloat(row.Seed).toFixed(1)}
                          </td>
                        );
                      }

                      const seedKey = Object.keys(headerMap).find(k => headerMap[k] === header);
                      const rawValue = row[seedKey];
                      const pct = parseFloat(rawValue) * 100;
                      const formatted =
                        !isNaN(pct) && pct > 0 ? `${pct.toFixed(1)}%` : "-";

                      return (
                        <td
                          key={colIdx}
                          className="px-2 sm:px-4 py-2 text-center whitespace-nowrap"
                          style={getSeedCellStyle(rawValue)}
                        >
                          {formatted}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TeamWinsPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    Papa.parse(
      TEAM_WINS_URL,
      {
        download: true,
        header: true,
        complete: (results) => {
          const cleaned = results.data.filter((row) => row.Team);
          cleaned.sort((a, b) => parseFloat(a.Mean) - parseFloat(b.Mean));
          setData(cleaned);
        },
      }
    );
  }, []);

  const winFields = [
    "<= 5", "6", "7", "8", "9", "10", "11", "12", "13",
    "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26",
    "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40"
  ];

  const visibleHeaders = ["Team", ...winFields];

  const getWinColor = (valueStr) => {
    const val = parseFloat(valueStr);
    if (isNaN(val)) return "transparent";
    if (val === 0) return { backgroundColor: "#eee", color: "#eee" };
    const ratio = Math.min(Math.max(val / 30, 0), 1);
    const r = Math.round(255 - (155 * ratio)); // 255 → 100
    const g = Math.round(255 - (55 * ratio));  // 255 → 200
    const b = Math.round(255 - (155 * ratio)); // 255 → 100
    return {
      backgroundColor: `rgb(${r},${g},${b})`,
      color: "black",
    };
  };

  const formatValue = (key, value) => {
    if (winFields.includes(key)) {
      const pct = parseFloat(value);
      return isNaN(pct) ? "-" : `${pct.toFixed(2)}%`;
    }
    return value;
  };

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-6 text-xs font-sans">
      <div className="max-w-full mx-auto">
        <h1 className="text-xl font-bold mb-4">Team Wins</h1>
        <div className="w-full overflow-x-auto border rounded-lg shadow-md">
          <table className="min-w-full text-center border-collapse text-[10.75px]">
            <thead className="bg-gray-800 text-white sticky top-0 z-10">
              <tr>
                {visibleHeaders.map((header) => (
                  <th
                    key={header}
                    className="px-1 sm:px-2 py-1 text-xs font-semibold uppercase tracking-wider border-b border-gray-700 whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((row, idx) => {
                const teamStyle = teamStyles[row.Team] || {
                  bg: "transparent",
                  color: "black",
                };
                return (
                  <tr key={idx} className="hover:bg-gray-100">
                    {visibleHeaders.map((key, colIdx) => {
                      const rawValue = row[key] ?? "";
                      const bgStyle = winFields.includes(key)
                        ? getWinColor(row[key])
                        : {};

                      if (key === "Team") {
                        return (
                          <td
                            key={colIdx}
                            className="px-1 sm:px-2 py-1 font-bold text-center whitespace-nowrap"
                            style={{
                              backgroundColor: teamStyle.bg,
                              color: teamStyle.color,
                            }}
                          >
                            {row.Team}
                          </td>
                        );
                      }

                      return (
                        <td
                          key={colIdx}
                          className="px-1 sm:px-2 py-1 text-center whitespace-nowrap"
                          style={bgStyle}
                        >
                          {formatValue(key, rawValue)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TeamLEBRONPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    Papa.parse(TEAM_LEBRON_URL, {
      download: true,
      header: true,
      complete: (results) => {
        const cleaned = results.data.filter(row => row.Team && row.LEBRON);
        setData(cleaned);
      },
    });
  }, []);

  const headers = ["Team", "LEBRON", "O-LEBRON", "D-LEBRON"];

  const statKeys = ["LEBRON", "O-LEBRON", "D-LEBRON"];
  const computeRanges = () => {
    const ranges = {};
    statKeys.forEach(key => {
      const nums = data.map(row => parseFloat(row[key])).filter(n => !isNaN(n));
      ranges[key] = {
        min: Math.min(...nums),
        max: Math.max(...nums),
      };
    });
    return ranges;
  };

  const ranges = computeRanges();

  const getCellStyle = (valStr, key) => {
    const val = parseFloat(valStr);
    if (isNaN(val)) return { backgroundColor: "transparent", color: "black" };
    const { min, max } = ranges[key];
    const range = max - min || 1;
    const ratio = (val - min) / range;

    let r, g, b;
    const midpoint = 0.5;
    if (ratio < midpoint) {
      const t = ratio / midpoint;
      r = Math.round(200 + (240 - 200) * t);
      g = Math.round(100 + (240 - 100) * t);
      b = Math.round(100 + (240 - 100) * t);
    } else {
      const t = (ratio - midpoint) / (1 - midpoint);
      r = Math.round(240 - (240 - 100) * t);
      g = Math.round(240 - (240 - 200) * t);
      b = Math.round(240 - (240 - 100) * t);
    }

    return {
      backgroundColor: `rgb(${r}, ${g}, ${b})`,
      color: "black",
    };
  };

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-6 text-sm font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Team LEBRON</h1>
        <div className="overflow-x-auto border rounded-lg shadow-md">
          <table className="min-w-full text-center border-collapse">
            <thead className="bg-gray-800 text-white sticky top-0 z-10">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="px-2 sm:px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b border-gray-700 whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((row, idx) => {
                const teamStyle = teamStyles[row.Team] || {
                  bg: "transparent",
                  color: "black",
                };

                return (
                  <tr key={idx} className="hover:bg-gray-100">
                    {headers.map((key, colIdx) => {
                      if (key === "Team") {
                        return (
                          <td
                            key={colIdx}
                            className="px-2 sm:px-4 py-2 font-bold text-center whitespace-nowrap"
                            style={{
                              backgroundColor: teamStyle.bg,
                              color: teamStyle.color,
                            }}
                          >
                            {row.Team}
                          </td>
                        );
                      }

                      return (
                        <td
                          key={colIdx}
                          className="px-2 sm:px-4 py-2 text-center whitespace-nowrap"
                          style={getCellStyle(row[key], key)}
                        >
                        <div className="font-bold">
                          {(() => {
                            const val = parseFloat(row[key]);
                            if (isNaN(val)) return "-";
                            return `${val > 0 ? "+" : ""}${val.toFixed(2)}`;
                          })()}
                        </div>
                          <div className="text-xs text-gray-600">{row[`${key} Rank`] || "-"}</div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<PlayerLEBRONPage />} />
        <Route path="/standings" element={<ProjectedStandingsPage />} />
        <Route path="/seeding" element={<PlayoffSeedingPage />} />
        <Route path="/team-lebron" element={<TeamLEBRONPage />} />
        <Route path="/games" element={<GameProjectionsPage />} />
        <Route path="/team-wins" element={<TeamWinsPage />} /> 
      </Routes>
    </Router>
  );
}
