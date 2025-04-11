import React from 'react'

import LatestRegisteredOne from './child/LatestRegisteredOne';
import UnitCountOne from './child/UnitCountOne';
import TextGeneratonLayer from './CompilanceLayer';
import FileTranslator from './FileTranslator';
import  TotslSubscription from './child/TotalSubscriberOne';
import TopPerformer from './child/TopPerformerOne';
import UsersOverviewOne from './child/UsersOverviewOne';
import StatStatisticOne from './child/StatStatisticOne';
import SalesStatisticOne from './child/SalesStatisticOne';


const AdminDashboard = () => {

    return (
        <>
                <UnitCountOne />
                <section className="row gy-4 mt-1">
                <LatestRegisteredOne />
                <TextGeneratonLayer/>
                <FileTranslator/>
                <TotslSubscription/>
                <StatStatisticOne />
                <TopPerformer/>
                <UsersOverviewOne />
                <SalesStatisticOne />
                
            </section>
        </>


    )
}

export default AdminDashboard
