import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import moment from "moment-timezone";

const TunisianStockMarket = () => {
  // Stock states
  const [symbol, setSymbol] = useState("IBM");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  // Crypto ticker states
  const [cryptoData, setCryptoData] = useState([]);
  const [loadingCrypto, setLoadingCrypto] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState("usd");

  // Static financial statements
  const statement1 = [
    { label: "Assets", value: "1,200,000", trend: "up" },
    { label: "Liabilities", value: "800,000", trend: "down" },
  ];
  const statement2 = [
    { label: "Equity", value: "400,000", trend: "up" },
    { label: "Net Income", value: "50,000", trend: "up" },
  ];

  // Alpha Vantage API Key
  const apiKey = "V0F7PRZK1JAVR6IE";

  // Fetch stock data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`
        );
        if (response.data["Time Series (5min)"]) {
          const timeSeries = response.data["Time Series (5min)"];
          const timeZone = "Africa/Tunis";
          const formattedData = Object.keys(timeSeries).map((timestamp) => {
            const localTime = moment
              .utc(timestamp)
              .tz(timeZone)
              .format("YYYY-MM-DD HH:mm:ss");
            return {
              timestamp: localTime,
              open: parseFloat(timeSeries[timestamp]["1. open"]),
              high: parseFloat(timeSeries[timestamp]["2. high"]),
              low: parseFloat(timeSeries[timestamp]["3. low"]),
              close: parseFloat(timeSeries[timestamp]["4. close"]),
              volume: timeSeries[timestamp]["5. volume"],
            };
          });
          setData(formattedData);
          setError(null);
        } else {
          setError("No data available for this symbol.");
        }
      } catch (error) {
        console.error("Error fetching data", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, apiKey]);

  // Fetch crypto data
  useEffect(() => {
    const fetchCrypto = async () => {
      try {
        setLoadingCrypto(true);
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${selectedCurrency}&order=market_cap_desc&per_page=5&page=1&sparkline=false`
        );
        setCryptoData(response.data);
      } catch (error) {
        console.error("Error fetching crypto data", error);
      } finally {
        setLoadingCrypto(false);
      }
    };

    fetchCrypto();
  }, [selectedCurrency]);

  // Load TradingView widget
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en", // Changed to English
      toolbar_bg: "#f1f3f6",
      enable_publishing: true,
      hide_top_toolbar: false,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      container_id: "tradingview-widget",
    });

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(script);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol]);

  // Trend icon
  const getTrendIcon = (trend) => {
    if (trend === "up") return "▲";
    if (trend === "down") return "▼";
    return "-";
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Crypto Ticker */}
      <div
        style={{
          background: "#f0f8ff",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        <h2>🚀 Cryptocurrency Ticker</h2>
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="currency-select"
            style={{ marginRight: "1rem", fontWeight: "bold" }}
          >
            Select Currency:
          </label>
          <select
            id="currency-select"
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
          </select>
        </div>
        {loadingCrypto ? (
          <p>Loading crypto data...</p>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
              overflowX: "auto",
            }}
          >
            {cryptoData.map((coin) => (
              <div
                key={coin.id}
                style={{ textAlign: "center", minWidth: "100px" }}
              >
                <img
                  src={coin.image}
                  alt={coin.name}
                  style={{ width: "30px", height: "30px" }}
                />
                <p style={{ margin: "0.5rem 0", fontWeight: "bold" }}>
                  {coin.symbol.toUpperCase()}
                </p>
                <p style={{ margin: 0 }}>
                  {selectedCurrency === "usd"
                    ? "$"
                    : selectedCurrency === "eur"
                    ? "€"
                    : ""}
                  {coin.current_price}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stock Selector */}
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <label
          htmlFor="symbol"
          style={{ marginRight: "1rem", fontWeight: "bold" }}
        >
          Select Stock:
        </label>
        <select
          id="symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          <option value="IBM">IBM</option>
          <option value="AAPL">Apple (AAPL)</option>
          <option value="MSFT">Microsoft (MSFT)</option>
          <option value="GOOGL">Google (GOOGL)</option>
        </select>
      </div>

      {/* Main Layout */}
      <div
        style={{
          display: "flex",
          gap: "2rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        {/* TradingView Widget */}
        <div style={{ flex: 2, minWidth: "300px" }}>
          <div
            ref={containerRef}
            id="tradingview-widget"
            style={{
              height: "500px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          ></div>
        </div>

        {/* Financial Statements */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            minWidth: "250px",
          }}
        >
          <div
            style={{
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ textAlign: "center", color: "#2c3e50" }}>Balance Sheet</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#2196F3", color: "white" }}>
                  <th style={{ padding: "0.5rem" }}>Label</th>
                  <th style={{ padding: "0.5rem" }}>Value</th>
                  <th style={{ padding: "0.5rem" }}>Trend</th>
                </tr>
              </thead>
              <tbody>
                {statement1.map((item, idx) => (
                  <tr
                    key={idx}
                    style={{
                      backgroundColor: idx % 2 === 0 ? "#f1f1f1" : "white",
                    }}
                  >
                    <td style={{ padding: "0.5rem" }}>{item.label}</td>
                    <td style={{ padding: "0.5rem" }}>{item.value}</td>
                    <td style={{ padding: "0.5rem", textAlign: "center" }}>
                      {getTrendIcon(item.trend)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            style={{
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ textAlign: "center", color: "#2c3e50" }}>Income Statement</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#FF9800", color: "white" }}>
                  <th style={{ padding: "0.5rem" }}>Label</th>
                  <th style={{ padding: "0.5rem" }}>Value</th>
                  <th style={{ padding: "0.5rem" }}>Trend</th>
                </tr>
              </thead>
              <tbody>
                {statement2.map((item, idx) => (
                  <tr
                    key={idx}
                    style={{
                      backgroundColor: idx % 2 === 0 ? "#f1f1f1" : "white",
                    }}
                  >
                    <td style={{ padding: "0.5rem" }}>{item.label}</td>
                    <td style={{ padding: "0.5rem" }}>{item.value}</td>
                    <td style={{ padding: "0.5rem", textAlign: "center" }}>
                      {getTrendIcon(item.trend)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Intraday Data Table */}
      <h2 style={{ color: "#2c3e50", marginBottom: "1rem" }}>📈 Intraday Data</h2>
      {loading ? (
        <p style={{ textAlign: "center", color: "#666" }}>Loading data...</p>
      ) : error ? (
        <p style={{ textAlign: "center", color: "#F44336" }}>{error}</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            fontSize: "0.9rem",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#4CAF50", color: "white" }}>
              <th style={{ padding: "1rem", textAlign: "left" }}>Date & Time</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Open</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>High</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Low</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Close</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Volume</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Trend</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const trend =
                item.close > item.open
                  ? "up"
                  : item.close < item.open
                  ? "down"
                  : "neutral";
              return (
                <tr
                  key={index}
                  style={{
                    borderBottom: "1px solid #ddd",
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                  }}
                >
                  <td style={{ padding: "1rem" }}>{item.timestamp}</td>
                  <td style={{ padding: "1rem" }}>{item.open.toFixed(2)}</td>
                  <td style={{ padding: "1rem" }}>{item.high.toFixed(2)}</td>
                  <td style={{ padding: "1rem" }}>{item.low.toFixed(2)}</td>
                  <td style={{ padding: "1rem" }}>{item.close.toFixed(2)}</td>
                  <td style={{ padding: "1rem" }}>{item.volume}</td>
                  <td
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      fontSize: "1.2rem",
                    }}
                  >
                    {getTrendIcon(trend)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TunisianStockMarket;