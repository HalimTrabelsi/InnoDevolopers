import React from 'react'


import TextGeneratonLayer from './CompilanceLayer';
import FileTranslator from './FileTranslator';
import  TotslSubscription from './child/TotalSubscriberOne';
import UsersOverviewOne from './child/UsersOverviewOne';
import StatStatisticOne from './child/StatStatisticOne';
import SalesStatisticOne from './child/SalesStatisticOne';
import PdfSummarizer  from './PdfSummarize';
import InputFormWithA from './child/InputFormWithAdmin';


const AdminDashboard = () => {

    return (
        <>
                
                <section className="row gy-4 mt-1">
                <TextGeneratonLayer/>
                <FileTranslator/>
                <UsersOverviewOne />
                <SalesStatisticOne />
                <PdfSummarizer/>
                <InputFormWithA/>
            </section>
        </>


    )
}

export default AdminDashboard
