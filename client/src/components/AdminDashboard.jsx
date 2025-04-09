import React from 'react'

import LatestRegisteredOne from './child/LatestRegisteredOne';
import UnitCountOne from './child/UnitCountOne';
import TextGeneratonLayer from './CompilanceLayer';
import UsersListLayer from './UsersListLayer';

const AdminDashboard = () => {

    return (
        <>
                <UnitCountOne />
                <section className="row gy-4 mt-1">
                <LatestRegisteredOne />
                <TextGeneratonLayer/>
                <UsersListLayer />
            </section>
        </>


    )
}

export default AdminDashboard