import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import InputFormWithF from './child/InputFormWithF';
import UnitCountTwo from './child/UnitCountTwo';
import LastTransactionAcc from './child/LastTransactionAcc';
import Tax from './Tax.jsx' ;
import FinancialTrends from './FinancialTrends';
import FinancialSimulation from './FinancialSimulation';

const socket = io('http://localhost:5001', { withCredentials: true });

const FinancialMangerLayer = () => {
  const [notification, setNotification] = useState('');

  
   
     useEffect(() => {
         // Écouter les changements de statut (approbation/refus)
         socket.on('approvalStatus', (message) => {
           console.log('FinancialManger received approvalStatus:', message);
           setNotification(message);
           // Pas de setTimeout, mais pas d'affichage direct non plus
         });
     
         return () => {
           socket.off('approvalStatus');
         };
       }, []);

  return (
    <section className="row gy-4">
      {/* Suppression de l'affichage direct */}
      <InputFormWithF />
      <UnitCountTwo />
      <LastTransactionAcc showActions={false} title="Approval History" setNotification={setNotification} />
      <Tax />
      <FinancialTrends />
      <FinancialSimulation/>
    </section>
  );
};

export default FinancialMangerLayer;