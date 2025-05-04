import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import CampaignStaticAcc from './child/CampaignStaticAcc';
import LastTransactionAcc from './child/LastTransactionAcc';
import UnitCountAcc from './child/UnitCountAcc';
import TaxValidation from './child/TaxValidationDashboard';
import PrioritizedTasks from './PrioritizedTasks'; 

const socket = io('http://localhost:5001', { withCredentials: true });

const AccountantDashboardLayer = () => {
  const [notification, setNotification] = useState('');

useEffect(() => {
     
      socket.on('newApproval', (message) => {
        console.log(' newApproval:', message);
        setNotification(message);
        
      });
  
      return () => {
        socket.off('newApproval');
      };
    }, []);

  return (
    <section className="row gy-4">
      {/* Suppression de l'affichage direct */}
      <UnitCountAcc />
      <CampaignStaticAcc />
      <LastTransactionAcc showActions={true} setNotification={setNotification} />
      <TaxValidation setNotification={setNotification} />
      <PrioritizedTasks /> {/* Ajout du composant PrioritizedTasks */}
    </section>
  );
};

export default AccountantDashboardLayer;