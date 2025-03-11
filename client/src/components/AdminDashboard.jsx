import React from 'react'

import LatestRegisteredOne from './child/LatestRegisteredOne';
import UnitCountOne from './child/UnitCountOne';
import TextGeneratonLayer from './CompilanceLayer';

const AdminDashboard = () => {

    return (
        <>
                <UnitCountOne />
                <section className="row gy-4 mt-1">
                <LatestRegisteredOne />
                <TextGeneratonLayer/>

            </section>
        </>


    )
}

export default AdminDashboard