import React from 'react'

import LatestRegisteredOne from './child/LatestRegisteredOne';
import UnitCountOne from './child/UnitCountOne';
import TextGeneratonLayer from './CompilanceLayer';
import FileTranslator from './FileTranslator';

const AdminDashboard = () => {

    return (
        <>
                <UnitCountOne />
                <section className="row gy-4 mt-1">
                <LatestRegisteredOne />
                <TextGeneratonLayer/>
                <FileTranslator/>

            </section>
        </>


    )
}

export default AdminDashboard