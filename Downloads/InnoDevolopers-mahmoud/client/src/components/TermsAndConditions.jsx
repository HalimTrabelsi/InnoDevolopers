import React from 'react';

const TermsAndConditions = () => {
    const styles = {
        container: {
            maxWidth: '800px',
            margin: '0 auto',
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            lineHeight: 1.6,
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            position: 'relative', // To position the background
            zIndex: 1, // Ensure content is above background
        },
        background: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url("https://imgs.search.brave.com/gcJVHRvCyNp92TKPPcer71-G2KmxOjAdgXAPVaoDjko/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly92ZW5u/Z2FnZS13b3JkcHJl/c3MuczMuYW1hem9u/YXdzLmNvbS91cGxv/YWRzLzIwMjIvMDkv/YnVzaW5lc3MtYmFj/a2dyb3VuZC0yLnBu/Zw")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
            zIndex: 0,
        },
        title: {
            fontSize: '26px',
            color: '#2c3e50',
            marginBottom: '20px',
            textAlign: 'center',
        },
        lastUpdated: {
            color: '#595959',
            fontSize: '14px',
            marginBottom: '30px',
            textAlign: 'center',
        },
        section: {
            marginTop: '20px',
            marginBottom: '30px',
        },
        heading: {
            fontSize: '22px',
            color: '#2980b9',
            margin: '15px 0 10px',
        },
        text: {
            color: '#595959',
            fontSize: '16px',
            marginBottom: '15px',
        },
        logo: {
            display: 'block',
            margin: '0 auto 20px',
            width: '150px',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.background}></div> {/* Background image */}
            <img
                src="/assets/images/LogoFinova.png" // Replace with your logo URL
                alt="Finova Logo"
                style={styles.logo}
            />
            <h1 style={styles.title}>TERMS AND CONDITIONS</h1>
            <div style={styles.lastUpdated}>
                <strong>Last updated: </strong> March 04, 2025
            </div>

            <div style={styles.section}>
                <h2 style={styles.heading}>AGREEMENT TO OUR LEGAL TERMS</h2>
                <p style={styles.text}>
                    We are <strong>Finova</strong> ("Company," "we," "us," "our"). These Terms and Conditions outline your rights and responsibilities when using our services. By accessing or using our services, you agree to comply with these terms. If you do not agree, you must not use our services.
                </p>
            </div>

            <div style={styles.section}>
                <h2 style={styles.heading}>1. OUR SERVICES</h2>
                <p style={styles.text}>
                    The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation. We offer a variety of services, including financial solutions and resources tailored to meet your needs.
                </p>
            </div>

            <div style={styles.section}>
                <h2 style={styles.heading}>2. INTELLECTUAL PROPERTY RIGHTS</h2>
                <p style={styles.text}>
                    We are the owner or the licensee of all intellectual property rights in our Services, including source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics. All rights are reserved, and any unauthorized use is strictly prohibited.
                </p>
            </div>

            <div style={styles.section}>
                <h2 style={styles.heading}>3. USER REPRESENTATIONS</h2>
                <p style={styles.text}>
                    By using the Services, you represent and warrant that all registration information you submit is true, accurate, current, and complete. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.
                </p>
            </div>

            <div style={styles.section}>
                <h2 style={styles.heading}>4. USER REGISTRATION</h2>
                <p style={styles.text}>
                    You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We may remove or change a username you select if we determine that it is inappropriate.
                </p>
            </div>

            <div style={styles.section}>
                <h2 style={styles.heading}>CONTACT US</h2>
                <p style={styles.text}>
                    If you have any questions or concerns about these Terms and Conditions, please contact us at:
                </p>
                <p style={styles.text}>
                    Email: support@finova.com<br />
                    Address: Finova, Tunisia
                </p>
            </div>
        </div>
    );
};

export default TermsAndConditions;