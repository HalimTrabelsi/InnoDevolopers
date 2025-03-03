import React, { useEffect, useState, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const Dashboard = () => {
    const [loginStats, setLoginStats] = useState([]);
    const chartRef = useRef(null); // Référence pour le canvas

    useEffect(() => {
        // Charger les statistiques de connexion
        fetch('http://localhost:5001/api/userstats/login-stats')
            .then(res => res.json())
            .then(data => {
                console.log("Données reçues pour loginStats :", data);
                setLoginStats(data.loginPerDay);
            })
            .catch(error => console.error("Erreur lors du fetch login-stats :", error));
    }, []);

    useEffect(() => {
        if (chartRef.current && loginStats.length > 0) {
            new Chart(chartRef.current, {
                type: "bar", // Graphique en barres
                data: {
                    labels: loginStats.map(entry => entry.date), // Dates
                    datasets: [{
                        label: "Connexions par jour",
                        data: loginStats.map(entry => entry.count), // Nombre de connexions
                        backgroundColor: "blue"
                    }]
                }
            });
        }
    }, [loginStats]); // Met à jour le graphique si les données changent

    return (
        <div>
            <h2>📊 Tableau de Bord</h2>
            <canvas ref={chartRef} />
        </div>
    );
};

export default Dashboard;
