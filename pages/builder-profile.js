import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const BuilderProfilePage = () => {
  // In a real app, this would be dynamic, e.g., /builder/[builderId]
  // Data would be fetched using getStaticProps or getServerSideProps
  const [builderData, setBuilderData] = useState({
    name: 'Loading...',
    specialty: '',
    projects: [],
    reviews: [],
    followerCount: 0,
  });

  useEffect(() => {
    // Mock fetching data
    setTimeout(() => {
      setBuilderData({
        name: 'ABC Constructions',
        specialty: 'Specialized in Luxury Apartments & Villas',
        projects: [
          { id: 1, name: 'Skyline Towers', location: 'Pune', image: 'https://via.placeholder.com/300x200' },
          { id: 2, name: 'Green Valley Homes', location: 'Mumbai', image: 'https://via.placeholder.com/300x200' },
        ],
        reviews: [
          { id: 1, author: 'John Doe', text: 'Excellent quality and timely delivery.' },
        ],
        followerCount: 1250,
      });
    }, 1000);
  }, []);

  return (
    <>
      <Head>
        <title>{builderData.name} - Builder Profile - NewPropertyHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <nav className="top-navbar">
        <div className="logo"><Link href="/">NewPropertyHub</Link></div>
      </nav>

      <main>
        <section className="builder-profile">
          <h1 id="builderName">{builderData.name}</h1>
          <p id="builderSpecialty">{builderData.specialty}</p>

          <div className="builder-projects">
            <h2>Ongoing Projects</h2>
            <div id="projectsList" className="projects-grid">
              {builderData.projects.map((project) => (
                <div className="project-card" key={project.id}>
                  <img src={project.image} alt={project.name} />
                  <h3>{project.name}</h3>
                  <p>{project.location}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="social-follow">
            <button id="followBtn">Follow</button>
            <span id="followerCount">{builderData.followerCount} Followers</span>
            <button id="shareBtn">Share</button>
          </div>

          <div className="builder-reviews">
            <h2>Reviews</h2>
            <div id="reviewsList">{/* Reviews would be mapped here */}</div>
          </div>
        </section>
      </main>

      <footer><p>&copy; 2025 NewPropertyHub</p></footer>
    </>
  );
};

export default BuilderProfilePage;