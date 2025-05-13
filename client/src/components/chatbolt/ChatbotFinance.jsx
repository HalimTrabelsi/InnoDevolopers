import React, { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const FinancialAssistant = () => {
  // Définition des 4 types de documents avec leurs champs requis
  const documentTypes = [
    { 
      id: 1, 
      name: "Business Plan", 
      description: "Comprehensive business strategy document",
      icon: "📊",
      requiredFields: ['projectName', 'sector', 'businessModel', 'initialInvestment', 'operatingCosts', 'employees']
    },
    { 
      id: 2, 
      name: "Feasibility Study", 
      description: "Detailed financial viability analysis",
      icon: "💰",
      requiredFields: ['initialInvestment', 'operatingCosts', 'revenueStreams', 'breakEvenAnalysis']
    },
    { 
      id: 3, 
      name: "Financial Forecast", 
      description: "3-5 year financial projections",
      icon: "📈",
      requiredFields: ['initialInvestment', 'monthlyExpenses', 'revenueProjections', 'growthRate']
    },
    { 
      id: 4, 
      name: "Investment Proposal", 
      description: "Detailed proposal for potential investors",
      icon: "📑",
      requiredFields: ['projectName', 'sector', 'businessModel', 'initialInvestment', 'operatingCosts', 'employees']
    }
  ];

  // Gestion de l'état global
  const [state, setState] = useState({
    messages: [
      { 
        sender: "bot", 
        text: "Welcome to your Financial Assistant.\nWhat type of document would you like to generate?",
        options: documentTypes
      }
    ],
    input: "",
    isLoading: false,
    documentType: null,
    projectData: {
      projectName: "",
      sector: "",
      businessModel: "",
      initialInvestment: 0,
      operatingCosts: 0, // coûts opérationnels annuels
      employees: 0,
      averageSalary: 0,
      marketSize: 0,
      marketShare: 0.01, // 1% de part de marché par défaut
      duration: 12, // durée en mois
      growthRate: 0.05
    },
    currentStep: 0,
    showInput: false,
    validationError: ""
  });

  const chatRef = useRef();
  const inputRef = useRef();

  // Schéma de couleurs
  const colors = {
    primary: '#2c3e50',
    secondary: '#18bc9c',
    accent: '#3498db',
    danger: '#e74c3c',
    light: '#ecf0f1'
  };

  // Autofocus et scroll dans la zone de chat
  useEffect(() => {
    if (state.showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [state.showInput]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [state.messages]);

  // Validation de l'input utilisateur par étape
  const validateInput = (step, value) => {
    const numValue = parseFloat(value);
    switch(step) {
      case 4: // Initial Investment
        if (isNaN(numValue)) return "Please enter a valid number";
        return numValue >= 1000 ? "" : "Minimum investment $1,000";
      case 5: // Employees
        return Number.isInteger(numValue) && numValue >= 0 ? "" : "Invalid employee count";
      case 6: // Average Salary
        return numValue >= 15 ? "" : "Minimum $15/hour";
      case 7: // Operating Costs (annuels)
        return numValue >= 0 ? "" : "Operating costs must be positive";
      case 8: // Market Size
        return numValue >= 10000 ? "" : "Market size too small";
      case 9: // Duration en mois
        return numValue >= 6 && numValue <= 60 ? "" : "Duration must be between 6 and 60 months";
      case 10: // Growth Rate
        return numValue >= 0 && numValue <= 1 ? "" : "Growth rate must be between 0 and 1";
      default:
        return "";
    }
  };

  // Gestion de la conversation
  const handleResponse = (userInput) => {
    const inputValue = userInput !== undefined ? userInput : state.input;
    const errorMsg = validateInput(state.currentStep, inputValue);

    if (errorMsg && userInput === undefined) {
      setState(prev => ({ ...prev, validationError: errorMsg, input: "" }));
      return;
    }

    const newMessages = [...state.messages];
    
    if (userInput !== undefined) {
      const selectedType = documentTypes.find(t => t.id === userInput);
      newMessages.push({
        sender: "user",
        text: selectedType ? `${selectedType.icon} ${selectedType.name}` : "Option"
      });
    } else {
      newMessages.push({ sender: "user", text: inputValue });
    }

    setState(prev => ({ 
      ...prev, 
      messages: newMessages,
      isLoading: true,
      showInput: false,
      validationError: "",
      input: ""
    }));

    setTimeout(() => {
      let response = "";
      let nextStep = state.currentStep;
      let showInput = true;
      const newData = { ...state.projectData };

      switch(state.currentStep) {
        case 0:
          // Sélection du type de document
          const selectedType = documentTypes.find(t => t.id === parseInt(inputValue));
          if (selectedType) {
            setState(prev => ({ ...prev, documentType: selectedType.id }));
            response = `Selected: ${selectedType.name}\n\nLet's begin:\n1. Project name?`;
            nextStep = 1;
          }
          break;
        case 1:
          newData.projectName = inputValue;
          response = "2. Industry sector?";
          nextStep = 2;
          break;
        case 2:
          newData.sector = inputValue;
          response = "3. Business model?";
          nextStep = 3;
          break;
        case 3:
          newData.businessModel = inputValue;
          response = "4. Initial investment amount? ($)";
          nextStep = 4;
          break;
        case 4:
          newData.initialInvestment = parseFloat(inputValue);
          response = "5. Number of full-time employees?";
          nextStep = 5;
          break;
        case 5:
          newData.employees = parseInt(inputValue);
          response = "6. Average hourly wage? ($)";
          nextStep = 6;
          break;
        case 6:
          newData.averageSalary = parseFloat(inputValue);
          response = "7. Annual Operating Costs? ($)";
          nextStep = 7;
          break;
        case 7:
          newData.operatingCosts = parseFloat(inputValue);
          response = "8. Total addressable market size? ($)";
          nextStep = 8;
          break;
        case 8:
          newData.marketSize = parseFloat(inputValue);
          response = "9. Project duration in months? (6-60)";
          nextStep = 9;
          break;
        case 9:
          newData.duration = parseInt(inputValue);
          response = "10. Expected annual growth rate? (0-1)";
          nextStep = 10;
          break;
        case 10:
          newData.growthRate = parseFloat(inputValue);
          response = "✅ Data collection complete!";
          nextStep = 11;
          showInput = false;
          break;
        default:
          response = "Invalid step";
      }

      setState(prev => ({
        ...prev,
        projectData: newData,
        messages: [...newMessages, { sender: "bot", text: response }],
        currentStep: nextStep,
        isLoading: false,
        showInput
      }));
    }, 800);
  };

  // Calculs financiers
  const calculateFinancials = () => {
    const { projectData } = state;
    
    // Calcul des coûts mensuels
    const monthlyLaborCost = projectData.employees * projectData.averageSalary * 160 * 1.3; // 160h/mois + 30% charges
    const monthlyOperatingCost = projectData.operatingCosts / 12;
    const totalMonthlyCost = monthlyLaborCost + monthlyOperatingCost;
    
    // Estimation du revenu mensuel
    const estimatedMonthlyRevenue = (projectData.marketSize * projectData.marketShare) / 12;
    
    const monthlyProfit = estimatedMonthlyRevenue - totalMonthlyCost;
    const breakEvenMonths = monthlyProfit > 0 
      ? Math.ceil(projectData.initialInvestment / monthlyProfit)
      : "N/A";
    
    const totalRevenue = estimatedMonthlyRevenue * projectData.duration;
    const totalCost = projectData.initialInvestment + (totalMonthlyCost * projectData.duration);
    const roi = ((totalRevenue - totalCost) / projectData.initialInvestment) * 100;
    
    // Projections financières (par année)
    const projections = [];
    let cumulativeProfit = -projectData.initialInvestment;
    for (let month = 1; month <= projectData.duration; month++) {
      const monthlyRev = estimatedMonthlyRevenue * Math.pow(1 + projectData.growthRate/12, month);
      const monthlyCost = totalMonthlyCost * (1 + 0.0015 * month); // augmentation mensuelle de 1.5%
      cumulativeProfit += monthlyRev - monthlyCost;
      
      if (month % 12 === 0 || month === projectData.duration) {
        projections.push({
          period: `Year ${Math.ceil(month/12)}`,
          revenue: monthlyRev,
          cost: monthlyCost,
          cumulativeProfit
        });
      }
    }
    
    return {
      breakEvenMonths,
      roi: roi.toFixed(1),
      monthlyMargin: estimatedMonthlyRevenue ? ((monthlyProfit / estimatedMonthlyRevenue) * 100).toFixed(1) : "0",
      annualProfit: (monthlyProfit * 12).toLocaleString(),
      projections,
      monthlyRevenue: estimatedMonthlyRevenue,
      totalMonthlyCost
    };
  };

  // Génération du PDF avec détails en fonction du type de document
  const generateProfessionalDocument = () => {
    const doc = new jsPDF();
    const { projectData, documentType } = state;
    const financials = calculateFinancials();

    // En-tête du document
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    const docTitle = documentTypes.find(t => t.id === documentType)?.name || "Document";
    doc.text(docTitle, 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Project: ${projectData.projectName}`, 105, 27, { align: 'center' });

    // Tableau des indicateurs clés
    autoTable(doc, {
      startY: 40,
      head: [['Metric', 'Value', 'Details']],
      body: [
        [
          'Initial Investment', 
          `$${projectData.initialInvestment.toLocaleString('en-US')}`, 
          'Startup capital'
        ],
        [
          'Monthly Revenue', 
          `$${Math.round(financials.monthlyRevenue).toLocaleString('en-US')}`, 
          `${(projectData.marketShare * 100).toFixed(1)}% of $${projectData.marketSize.toLocaleString('en-US')} market`
        ],
        [
          'Monthly Expenses', 
          `$${Math.round(financials.totalMonthlyCost).toLocaleString('en-US')}`, 
          'Labor + Operations'
        ],
        [
          'Break-even Point', 
          financials.breakEvenMonths === "N/A" ? "Not achievable" : financials.breakEvenMonths, 
          financials.breakEvenMonths === "N/A" ? "Not achievable" : "Months"
        ],
        [
          'Projected ROI', 
          `${financials.roi}%`, 
          `Over ${projectData.duration} months`
        ]
      ],
      styles: { fontSize: 10, cellPadding: 3, halign: 'left' },
      headStyles: { fillColor: [44, 62, 80], textColor: 255, fontStyle: 'bold' }
    });

    // Section "Détails Réels" de la simulation
    let detailsStartY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.text("Détails Réels de la Simulation", 14, detailsStartY);
    detailsStartY += 5;
    autoTable(doc, {
      startY: detailsStartY,
      head: [['Description', 'Value']],
      body: [
        ['Revenu mensuel estimé', `$${Math.round(financials.monthlyRevenue).toLocaleString('en-US')}`],
        ['Dépenses mensuelles', `$${Math.round(financials.totalMonthlyCost).toLocaleString('en-US')}`],
        ['Profit mensuel', `$${Math.round(financials.monthlyRevenue - financials.totalMonthlyCost).toLocaleString('en-US')}`],
        ['Profit annuel (estimé)', `$${(Math.round((financials.monthlyRevenue - financials.totalMonthlyCost)*12)).toLocaleString('en-US')}`]
      ],
      styles: { fontSize: 10, cellPadding: 3, halign: 'left' },
      headStyles: { fillColor: [52, 73, 94], textColor: 255, fontStyle: 'bold' }
    });

    // Ajout d'une section spécifique selon le type de document
    if (documentType === 3) {
      // Financial Forecast : ajouter les projections financières
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 15,
        head: [['Period', 'Revenue', 'Expenses', 'Cumulative Profit']],
        body: financials.projections.map(proj => [
          proj.period,
          `$${proj.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
          `$${proj.cost.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
          `$${proj.cumulativeProfit.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
        ]),
        styles: { fontSize: 9, cellPadding: 2 }
      });
    } else if (documentType === 4) {
      // Investment Proposal : ajouter une section "Investment Highlights"
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 15,
        head: [['Highlight', 'Value']],
        body: [
          ['Expected ROI', `${financials.roi}%`],
          ['Break-even Point', financials.breakEvenMonths === "N/A" ? "Not achievable" : financials.breakEvenMonths],
          ['Market Share', `${(projectData.marketShare * 100).toFixed(1)}%`],
          ['Project Duration', `${projectData.duration} months`]
        ],
        styles: { fontSize: 10, cellPadding: 3, halign: 'left' },
        headStyles: { fillColor: [0, 123, 255], textColor: 255, fontStyle: 'bold' }
      });
    }

    // Pied de page
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('Confidential - Generated by Financial Assistant', 105, 285, { align: 'center' });

    // Sauvegarde du PDF
    doc.save(`${projectData.projectName.replace(/ /g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Styles des composants UI
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '1.5rem',
      borderRadius: '12px',
      backgroundColor: '#ffffff',
      boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
    },
    chatContainer: {
      height: '500px',
      overflowY: 'auto',
      padding: '1rem',
      marginBottom: '1rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #e9ecef'
    },
    message: {
      padding: '0.8rem 1.2rem',
      marginBottom: '0.8rem',
      borderRadius: '15px',
      maxWidth: '80%',
      lineHeight: '1.5'
    },
    inputContainer: {
      display: 'flex',
      gap: '0.5rem',
      padding: '0.8rem',
      backgroundColor: '#ffffff',
      borderRadius: '25px',
      border: `1px solid ${colors.light}`,
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
    },
    button: {
      padding: '0.8rem 1.5rem',
      borderRadius: '25px',
      border: 'none',
      fontWeight: '600',
      transition: 'all 0.2s ease'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: 'center', color: colors.primary, marginBottom: '1.5rem' }}>
        💼 Financial Documentation Assistant
      </h2>

      <div ref={chatRef} style={styles.chatContainer}>
        {state.messages.map((msg, i) => (
          <div key={i} style={{
            ...styles.message,
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: msg.sender === 'user' ? colors.light : '#ffffff',
            border: msg.sender === 'bot' ? `1px solid ${colors.light}` : 'none',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <div style={{ 
              color: msg.sender === 'user' ? colors.secondary : colors.primary,
              fontWeight: '500',
              marginBottom: '0.3rem'
            }}>
              {msg.sender === 'user' ? 'You' : 'Financial Assistant'}
            </div>
            <div style={{ color: '#495057' }}>
              {msg.text}
              {msg.options && (
                <div style={{ marginTop: '1rem' }}>
                  {msg.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleResponse(option.id)}
                      style={{
                        ...styles.button,
                        backgroundColor: colors.light,
                        color: colors.primary,
                        marginBottom: '0.5rem',
                        width: '100%',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ marginRight: '0.8rem' }}>{option.icon}</span>
                      {option.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {state.validationError && (
        <div style={{ color: colors.danger, textAlign: 'center', margin: '0.5rem 0' }}>
          {state.validationError}
        </div>
      )}

      {state.showInput && (
        <div style={styles.inputContainer}>
          <input
            ref={inputRef}
            type="text"
            value={state.input}
            onChange={(e) => setState(prev => ({ ...prev, input: e.target.value }))}
            onKeyPress={(e) => e.key === 'Enter' && handleResponse()}
            placeholder="Type your response..."
            style={{
              flex: 1,
              padding: '0.8rem',
              border: 'none',
              borderRadius: '20px',
              outline: 'none'
            }}
          />
          <button
            onClick={() => handleResponse()}
            style={{
              ...styles.button,
              backgroundColor: colors.secondary,
              color: 'white'
            }}
          >
            Send
          </button>
        </div>
      )}

      {state.currentStep === 11 && (
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={generateProfessionalDocument}
            style={{
              ...styles.button,
              backgroundColor: colors.primary,
              color: 'white',
              padding: '1rem 2rem',
              fontSize: '1.1rem'
            }}
          >
            📄 Generate Professional Document
          </button>
        </div>
      )}
    </div>
  );
};

export default FinancialAssistant;
