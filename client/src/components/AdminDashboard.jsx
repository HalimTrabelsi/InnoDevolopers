import React from 'react'

import LatestRegisteredOne from './child/LatestRegisteredOne';
import UnitCountOne from './child/UnitCountOne';
import ComplianceLayer from './CompilanceLayer';

const AdminDashboard = () => {

    return (
        <>  
        <section className="row gy-4 mt-1">

                <UnitCountOne />
                <LatestRegisteredOne />
                <ComplianceLayer/>

         </section>
        </>


    )
}

export default AdminDashboard