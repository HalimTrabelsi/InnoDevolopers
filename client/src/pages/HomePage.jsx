import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import dashboardAnimation from '../animations/dashboard.json';
import dataAnimation from '../animations/dataAnimation.json';
import robotAnimation from '../animations/robot.json';
import teamworkAnimation from '../animations/teamwork.json';
import insightAnimation from '../animations/insight.json';
import secureAnimation from '../animations/secure.json';
import javascriptAnimation from '../animations/javascript.json';
import mongodbAnimation from '../animations/mongo.json';
import reactAnimation from '../animations/react.json';
import devopsAnimation from '../animations/devops.json';

export default function HomePage() {
  const features = [
    { title: 'Simplify Accounting', desc: 'Smart dashboards and intuitive interfaces for faster bookkeeping.', anim: dashboardAnimation },
    { title: 'Automate & Optimize', desc: 'Automate repetitive tasks to reduce error and save time.', anim: dataAnimation },
    { title: 'Empower Decision-Making', desc: 'Real-time analytics and forecasting for strategic insights.', anim: robotAnimation },
    { title: 'Enhance Financial Insights', desc: 'Visual trends and KPIs help you act on key data.', anim: teamworkAnimation },
    { title: 'Secured Data and Transactions', desc: 'Well protected platform.', anim: secureAnimation },
    { title: 'AI-Powered Insights', desc: 'Leverage AI for predictive analytics and personalized recommendations.', anim: insightAnimation }
  ];
  const team = [
    { name: 'Halim Trabelsi', img: '/assets/images/Halim.jpg', linkedin: '#', github: '#' },
    { name: 'Saif Laameri', img: '/assets/images/saif.jpg', linkedin: '#', github: '#' },
    { name: 'Eya Chamekh', img: '/assets/images/Eya.jpg', linkedin: '#', github: '#' },
    { name: 'Ouday Ouesleti', img: '/assets/images/team4.jpg', linkedin: '#', github: '#' },
    { name: 'Mahmoud Abdulkareem', img: '/assets/images/team5.jpg', linkedin: '#', github: '#' }
  ];
  const techs = [
    { name: 'MongoDB', color: '#10A44C', anim: mongodbAnimation },
    { name: 'JavaScript', color: '#F7DF1E', anim: javascriptAnimation },
    { name: 'React', color: '#61DAFB', anim: reactAnimation }
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => { AOS.init({ duration: 1000, once: true }); }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: 'white', color: '#1f2937' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        html, body, #root { margin:0; padding:0; scroll-behavior: smooth; }

        .navbar { display:flex; justify-content:space-between; align-items:center; padding:1.5rem 3rem; background:#1e3a8a; color:white; position:sticky; top:0; z-index:100; box-shadow:0 2px 10px rgba(0,0,0,0.1); }
        .nav-left { font-weight:700; font-size:2.25rem; letter-spacing:1px; }
        .nav-links { display:flex; gap:2rem; font-size:1rem; text-transform:uppercase; list-style:none; margin:0; }
        .nav-links a { color:white; text-decoration:none; padding:0.5rem 1rem; transition:background 0.3s,color 0.3s; }
        .nav-links a:hover { background:rgba(255,255,255,0.2); border-radius:8px; color:#e0e7ff; }
        .sign-in-btn { background:transparent; color:white; border:2px solid white; padding:0.5rem 1.5rem; border-radius:25px; font-weight:600; text-decoration:none; transition:background 0.3s,color 0.3s; }
        .sign-in-btn:hover { background:white; color:#1e3a8a; }

        .hero { background:linear-gradient(rgba(30,58,138,0.8),rgba(107,33,168,0.8)),url('/assets/images/entreprise.jpg') center/cover no-repeat; color:white; text-align:center; padding:8rem 1rem; }
        .hero h1 { font-size:3rem; margin-bottom:1.5rem; font-weight:700; line-height:1.2; }
        .hero p { font-size:1.25rem; margin-bottom:2.5rem; font-weight:400; }
        .hero a { background:white; color:#1e3a8a; padding:1rem 2.5rem; border-radius:9999px; font-weight:600; text-decoration:none; box-shadow:0 4px 10px rgba(0,0,0,0.2); transition:background 0.3s,transform 0.3s; }
        .hero a:hover { background:#e0e7ff; transform:translateY(-2px); }

        /* Features Carousel */
        .features-carousel { overflow:hidden; padding:2rem 0; }
        .features-track { display:flex; width: calc(${features.length} * (100% / 3)); transform: translateX(-${index * (100 / 3)}%); transition: transform 0.5s ease-in-out; }
        .feature-card { flex:0 0 calc(100% / 4); background:#1f2937; border-radius:0.75rem; margin:0 0.5rem; display:flex; flex-direction:column; }
        .feature-animation { width:100%; height:200px; }
        .feature-content { padding:1.5rem; flex:1; display:flex; flex-direction:column; }
        .feature-title { color:#facc15; font-size:1.25rem; margin-bottom:0.75rem; }
        .feature-desc { color:#e5e7eb; flex:1; margin-bottom:1rem; font-size:1rem; line-height:1.5; }
        .feature-button { align-self:flex-start; padding:0.5rem 1rem; border:1px solid #e5e7eb; background:transparent; color:#e5e7eb; border-radius:0.25rem; font-weight:500; cursor:pointer; transition:background 0.3s,color 0.3s; }
        .feature-button:hover { background:#e5e7eb; color:#1f2937; }

        .section { padding:5rem 1rem; }
        .section-title { font-size:2.5rem; text-align:center; margin-bottom:3rem; letter-spacing:1px; }

        /* Team */
        #team { background:#f0f7ff; }
        .team-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:2rem; max-width:1200px; margin:auto; }
        .team-card { position:relative; background:white; border-radius:1.5rem; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1); transition:transform 0.3s ease; }
        .team-card:hover { transform:translateY(-5px); }
        .team-card img { width:100%; height:320px; object-fit:cover; }
        .team-overlay { position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(30,58,138,0.85); display:flex; align-items:center; justify-content:center; gap:1.5rem; opacity:0; transition:opacity 0.3s ease; }
        .team-card:hover .team-overlay { opacity:1; }
        .team-overlay a { display:inline-flex; align-items:center; justify-content:center; width:40px; height:40px; transition:transform 0.3s; }
        .team-overlay a:hover { transform:scale(1.15); }
        .team-overlay svg { width:32px; height:32px; fill:white; }
        .team-name { padding:1rem; background:rgb(54,103,238); color:white; font-weight:600; font-size:1.1rem; text-align:center; }

        /* About */
        #about { background:white; padding:4rem 1rem; }
        .about-container { max-width:1200px; margin:auto; display:flex; align-items:center; justify-content:space-between; gap:2rem; }
        @media(max-width:768px){ .about-container{ flex-direction:column; text-align:center; }}
        .about-text h2 { font-size:2rem; color:#5a2e8d; margin-bottom:1rem; font-weight:600; }
        .about-text p { font-size:1rem; color:#4b5563; line-height:1.6; margin-bottom:1.5rem; }
        .about-text a { padding:0.5rem 1.5rem; border:1px solid #4b5563; color:#4b5563; text-decoration:none; border-radius:4px; transition:background 0.3s,color 0.3s; }
        .about-text a:hover { background:#4b5563; color:white; }
        .about-animation { width:300px; height:auto; }

        /* Technologies */
        #technologies { background:white; }
        .tech-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:2rem; max-width:900px; margin:auto; }
        .tech-item { background:linear-gradient(135deg,#f9fafb,#e5e7eb); padding:2.5rem; border-radius:1.5rem; text-align:center; font-weight:600; display:flex; flex-direction:column; align-items:center; font-size:1.25rem; transition:transform 0.3s,box-shadow 0.3s; box-shadow:0 2px 8px rgba(0,0,0,0.05); }
        .tech-item:hover { transform:translateY(-5px); box-shadow:0 8px 16px rgba(0,0,0,0.1); }
        .tech-animation { width:100px; height:100px; margin-bottom:1rem; transition:transform 0.3s; }
        .tech-item:hover .tech-animation { transform:scale(1.1); }

        /* Contact */
        #contact { background:linear-gradient(to bottom right,#1e3a8a,#6b21a8); color:white; }
        #contact p { margin:0.5rem 0; font-size:1.1rem; text-align:center; }

        /* Footer */
        .footer { background:#1e3a8a; color:white; padding:1.5rem 2rem; display:flex; justify-content:space-between; font-size:1rem; }

        /* Back to top */
        .back-to-top { position:fixed; bottom:2rem; right:2rem; background:#1e3a8a; color:white; border:none; border-radius:50%; width:3rem; height:3rem; font-size:1.5rem; cursor:pointer; box-shadow:0 4px 10px rgba(0,0,0,0.2); z-index:1000; }
      `}</style>

      <nav className="navbar">
        <div className="nav-left">Finova</div>
        <ul className="nav-links">
          {['About','Features','Team','Technologies','Contact'].map((item,i)=>(<li key={i}><a href={`#${item.toLowerCase()}`}>{item}</a></li>))}
          <li><Link to="/sign-in" className="sign-in-btn">Sign In</Link></li>
        </ul>
      </nav>

      <header className="hero" data-aos="fade-up">
        <h1>Simplify Your Finance<br/>with Smart Solutions</h1>
        <p>From automated accounting to intelligent insights, we redefine financial management.</p>
        <Link to="/sign-in" className="sign-in-btn">Get Started</Link>
      </header>

      <section id="features" className="section" data-aos="fade-up">
        <h2 className="section-title">Key Features</h2>
        <div className="features-carousel">
          <div className="features-track">
            {features.map((f,i)=>(
              <div key={i} className="feature-card">
                <Lottie animationData={f.anim} loop className="feature-animation" />
                <div className="feature-content">
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-desc">{f.desc}</p>
                  <button className="feature-button">Learn more</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="section" data-aos="fade-up">
        <h2 className="section-title">Meet Our Team</h2>
        <div className="team-grid">
          {team.map((m,i)=>(
            <div key={i} className="team-card" data-aos="fade-up" data-aos-delay={i*100}>
              <img src={m.img} alt={m.name} />
              <div className="team-overlay">
                <a href={m.linkedin} target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-1.337-.03-3.06-1.864-3.06-1.867 0-2.152 1.458-2.152 2.964v5.7h-3v-11h2.879v1.503h.041c.401-.757 1.378-1.557 2.832-1.557 3.027 0 3.584 1.992 3.584 4.583v6.471z"/>
                  </svg>
                </a>
                <a href={m.github} target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
              <div className="team-name">{m.name}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="section" data-aos="fade-up">
        <div className="about-container">
          <div className="about-text">
            <h2 className="section-title">About Us</h2>
            <p>Profitable growth in financial management with Finova. This platform leverages the MERN stack to deliver a seamless experience for business owners and financial administrators. With DevOps integration, we ensure continuous deployment, scalability, and reliability, empowering you with smart financial tools and insights.</p>
            <a href="#">More insights on finance</a>
          </div>
          <Lottie animationData={devopsAnimation} loop className="about-animation" />
        </div>
      </section>

      <section id="technologies" className="section" data-aos="fade-up">
        <h2 className="section-title">Technologies We Use</h2>
        <div className="tech-grid">
          {techs.map((t,i)=>(
            <div key={i} className="tech-item" style={{ color: t.color }} data-aos="fade-up" data-aos-delay={i*100}>
              <Lottie animationData={t.anim} loop className="tech-animation" />
              {t.name}
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="section" data-aos="fade-up">
        <h2 className="section-title">Get In Touch</h2>
        <p>📧 info@innodevolopers.com</p>
        <p>📞 +216 123 456 789</p>
        <p>📍 Tunis, Tunisia</p>
      </section>

      <footer className="footer">
        <div>© {new Date().getFullYear()}</div>
        <div>Team Innodevolopers</div>
      </footer>

      <button className="back-to-top" onClick={scrollToTop}>↑</button>
    </div>
  );
}