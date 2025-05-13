import React, { useEffect, useMemo, useState, useRef } from "react";
import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";
import axios from "axios";
import moment from "moment-timezone";
import {
  Table,
  Input,
  Button,
  Label,
  FormGroup,
  Form,
  Col,
  Row,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Badge
} from "reactstrap";
import { FaArrowUp, FaArrowDown, FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import MasterLayout from "../../masterLayout/MasterLayout";
const FinancialDashboard = () => {
  // Référence pour le widget TradingView
  const tradingViewContainerRef = useRef(null);

  // Stock states
  const [symbol, setSymbol] = useState("IBM");
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Crypto states
  const [cryptoData, setCryptoData] = useState([]);
  const [loadingCrypto, setLoadingCrypto] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState("usd");

  // Schéma statique des états financiers
  const financialStatements = {
    balanceSheet: [
      { id: 1, label: "Actifs", value: "1,200,000", trend: "up", variant: "success" },
      { id: 2, label: "Passifs", value: "800,000", trend: "down", variant: "danger" }
    ],
    incomeStatement: [
      { id: 1, label: "Equity", value: "400,000", trend: "up", variant: "success" },
      { id: 2, label: "Net Income", value: "50,000", trend: "up", variant: "success" }
    ]
  };

  const apiKey = "V0F7PRZK1JAVR6IE";

  // Chargement du widget TradingView
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `NASDAQ:${symbol}`,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "fr",
      toolbar_bg: "#f1f3f6",
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      container_id: "tradingview-widget-container"
    });

    if (tradingViewContainerRef.current) {
      tradingViewContainerRef.current.innerHTML = "";
      tradingViewContainerRef.current.appendChild(script);
    }

    return () => {
      if (tradingViewContainerRef.current) {
        tradingViewContainerRef.current.innerHTML = "";
      }
    };
  }, [symbol]);

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
              id: timestamp,
              timestamp: localTime,
              open: parseFloat(timeSeries[timestamp]["1. open"]),
              high: parseFloat(timeSeries[timestamp]["2. high"]),
              low: parseFloat(timeSeries[timestamp]["3. low"]),
              close: parseFloat(timeSeries[timestamp]["4. close"]),
              volume: parseInt(timeSeries[timestamp]["5. volume"]),
              trend: parseFloat(timeSeries[timestamp]["4. close"]) > parseFloat(timeSeries[timestamp]["1. open"]) ? "up" : "down"
            };
          });
          setStockData(formattedData);
          setError(null);
        } else {
          setError("Aucune donnée disponible pour ce symbole.");
        }
      } catch (error) {
        console.error("Erreur de récupération des données", error);
        setError("Échec du chargement des données. Veuillez réessayer.");
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
        console.error("Erreur de récupération des crypto-monnaies", error);
      } finally {
        setLoadingCrypto(false);
      }
    };

    fetchCrypto();
  }, [selectedCurrency]);

  // Columns for main data table
  const columns = useMemo(
    () => [
      {
        Header: "Date & Heure",
        accessor: "timestamp",
        Cell: ({ value }) => <span className="text-nowrap">{value}</span>
      },
      {
        Header: "Ouverture",
        accessor: "open",
        Cell: ({ value }) => value.toFixed(2)
      },
      {
        Header: "Haut",
        accessor: "high",
        Cell: ({ value }) => value.toFixed(2)
      },
      {
        Header: "Bas",
        accessor: "low",
        Cell: ({ value }) => value.toFixed(2)
      },
      {
        Header: "Clôture",
        accessor: "close",
        Cell: ({ value }) => value.toFixed(2)
      },
      {
        Header: "Volume",
        accessor: "volume",
        Cell: ({ value }) => value.toLocaleString()
      },
      {
        Header: "Tendance",
        accessor: "trend",
        Cell: ({ value }) => (
          <Badge color={value === "up" ? "success" : "danger"}>
            {value === "up" ? <FaArrowUp /> : <FaArrowDown />}
          </Badge>
        ),
        disableSortBy: true
      }
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter,
    nextPage,
    previousPage,
    setPageSize
  } = useTable(
    {
      columns,
      data: stockData,
      initialState: { pageIndex: 0, pageSize: 10 }
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return ( <MasterLayout>
    <div className="p-4">
      {/* Crypto Ticker */}
      <Card className="mb-4">
        <CardHeader className="bg-primary text-white">
          <h4 className="mb-0">📊 Crypto-monnaies</h4>
        </CardHeader>
        <CardBody>
          <Row className="align-items-center mb-3">
            <Col md={3}>
              <Label for="currency-select">Devise :</Label>
              <Input
                type="select"
                id="currency-select"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
              >
                <option value="usd">USD ($)</option>
                <option value="eur">EUR (€)</option>
              </Input>
            </Col>
            <Col md={9}>
              {loadingCrypto ? (
                <div className="text-center py-3">
                  <Spinner color="primary" />
                </div>
              ) : (
                <div className="d-flex flex-wrap gap-4">
                  {cryptoData.map((coin) => (
                    <div key={coin.id} className="text-center">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        style={{ width: "30px", height: "30px" }}
                        className="mb-1"
                      />
                      <div className="fw-bold">{coin.symbol.toUpperCase()}</div>
                      <div>
                        {selectedCurrency === "usd" ? "$" : "€"}
                        {coin.current_price.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Stock Selector */}
      <FormGroup row className="mb-4">
        <Col md={3}>
          <Label for="symbol">Action :</Label>
          <Input
            type="select"
            id="symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          >
            <option value="IBM">IBM</option>
            <option value="AAPL">Apple (AAPL)</option>
            <option value="MSFT">Microsoft (MSFT)</option>
            <option value="GOOGL">Google (GOOGL)</option>
          </Input>
        </Col>
      </FormGroup>

      {/* TradingView Widget */}
      <Card className="mb-4">
        <CardHeader className="bg-dark text-white">
          <h4 className="mb-0">Graphique TradingView - {symbol}</h4>
        </CardHeader>
        <CardBody>
          <div 
            ref={tradingViewContainerRef}
            id="tradingview-widget-container"
            style={{ height: "500px", width: "100%" }}
          >
            <div className="tradingview-widget-container__widget"></div>
          </div>
        </CardBody>
      </Card>

      {/* Financial Statements - Schéma statique */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <CardHeader className="bg-info text-white">Bilan</CardHeader>
            <CardBody>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>Compte</th>
                    <th>Valeur</th>
                    <th>Tendance</th>
                  </tr>
                </thead>
                <tbody>
                  {financialStatements.balanceSheet.map((item) => (
                    <tr key={item.id}>
                      <td>{item.label}</td>
                      <td>{item.value}</td>
                      <td>
                        <Badge color={item.variant}>
                          {item.trend === "up" ? <FaArrowUp /> : <FaArrowDown />}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <CardHeader className="bg-warning text-white">Compte de résultat</CardHeader>
            <CardBody>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>Compte</th>
                    <th>Valeur</th>
                    <th>Tendance</th>
                  </tr>
                </thead>
                <tbody>
                  {financialStatements.incomeStatement.map((item) => (
                    <tr key={item.id}>
                      <td>{item.label}</td>
                      <td>{item.value}</td>
                      <td>
                        <Badge color={item.variant}>
                          {item.trend === "up" ? <FaArrowUp /> : <FaArrowDown />}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Main Data Table */}
      <Card>
        <CardHeader className="bg-success text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Données intraday</h4>
          <div style={{ width: "300px" }}>
            <Input
              type="text"
              placeholder="Rechercher..."
              value={globalFilter || ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="ps-4"
            />
            <FaSearch className="position-absolute top-50 translate-middle-y ms-2" />
          </div>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="text-center py-5">
              <Spinner color="primary" size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-5 text-danger">{error}</div>
          ) : (
            <>
              <div className="table-responsive">
                <Table {...getTableProps()} striped hover responsive>
                  <thead>
                    {headerGroups.map(headerGroup => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                          <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                            <div className="d-flex align-items-center">
                              {column.render("Header")}
                              {column.canSort && (
                                <span className="ms-1">
                                  {column.isSorted ? (
                                    column.isSortedDesc ? (
                                      <FaSortDown />
                                    ) : (
                                      <FaSortUp />
                                    )
                                  ) : (
                                    <FaSort />
                                  )}
                                </span>
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()}>
                          {row.cells.map(cell => (
                            <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <span className="me-2">Afficher :</span>
                  <Input
                    type="select"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    style={{ width: "auto", display: "inline-block" }}
                  >
                    {[10, 20, 30, 40, 50].map(size => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </Input>
                </div>
                <div>
                  <span className="mx-2">
                    Page{" "}
                    <strong>
                      {pageIndex + 1} sur {pageOptions.length}
                    </strong>
                  </span>
                  <Button
                    color="primary"
                    outline
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                    size="sm"
                    className="me-2"
                  >
                    Précédent
                  </Button>
                  <Button
                    color="primary"
                    outline
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                    size="sm"
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
    </MasterLayout>
  );
};

export default FinancialDashboard;