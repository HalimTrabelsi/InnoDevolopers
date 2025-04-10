import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import CampaignStaticAcc from './child/CampaignStaticAcc';
import LastTransactionAcc from './child/LastTransactionAcc';
import UnitCountAcc from './child/UnitCountAcc';


const socket = io('http://localhost:5001', { withCredentials: true });

const AccountantDashboardLayer = () => {
  const [notification, setNotification] = useState('');

useEffect(() => {
      // Écouter les nouvelles demandes uniquement
      socket.on('newApproval', (message) => {
        console.log(' newApproval:', message);
        setNotification(message);
        // Pas de setTimeout, mais pas d'affichage direct non plus
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
    </section>
  );
};

export default AccountantDashboardLayer;