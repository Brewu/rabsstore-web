import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaYoutube } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Homepage = () => {
  const [beats, setBeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const cartArray = Object.values(cartItems || {});

  useEffect(() => {
    const fetchBeats = async () => {
      try {
        const beatsQuery = query(collection(db, 'beats'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(beatsQuery);
        const fetchedBeats = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(0)
          };
        });
        setBeats(fetchedBeats);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching beats:', error);
        setLoading(false);
      }
    };

    fetchBeats();
  }, []);

  if (loading) return <p style={{ color: '#fff', padding: '2rem' }}>Loading beats...</p>;

  return (
    <div style={{ backgroundColor: '#121418', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Scrollbar Styling */}
      <style>{`
        .scrollbar-visible {
          display: flex;
          overflow-x: auto;
          padding-bottom: 1rem;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: auto;
          scrollbar-color: #555 #1d1f27;
        }
        .scrollbar-visible::-webkit-scrollbar {
          height: 12px;
        }
        .scrollbar-visible::-webkit-scrollbar-thumb {
          background-color: #555;
          border-radius: 6px;
        }
        .scrollbar-visible::-webkit-scrollbar-track {
          background-color: #1d1f27;
        }
      `}</style>

      {/* Navigation Bar */}
      <nav style={navStyle}>
        <h2 style={{ color: '#fff', fontWeight: 'bold', margin: 0 }}>🎵 RabsStore</h2>

        <div style={navButtonGroupStyle}>
          <button onClick={() => navigate('/')} style={navBtnStyle}>Home</button>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowCartDropdown(prev => !prev)}
              style={{ ...navBtnStyle, position: 'relative' }}
            >
              <FaShoppingCart />
              Cart
              {cartArray.length > 0 && (
                <span style={cartCountStyle}>
                  {cartArray.length}
                </span>
              )}
            </button>

            {showCartDropdown && (
              <div style={cartDropdownStyle}>
                {cartArray.length === 0 ? (
                  <p style={{ color: '#ccc', fontSize: '0.9rem' }}>Cart is empty</p>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {cartArray.slice(0, 3).map(({ beat, quantity }) => (
                      <li key={beat.id} style={{ marginBottom: '0.8rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img src={beat.image} alt={beat.title} style={cartImageStyle} />
                          <div>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#fff' }}>{beat.title} × {quantity}</p>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#aaa' }}>₵{beat.price}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  onClick={() => {
                    setShowCartDropdown(false);
                    navigate('/Cart');
                  }}
                  style={viewCartBtnStyle}
                >
                  View Full Cart
                </button>
              </div>
            )}
          </div>

          <a
            href="https://www.youtube.com/@rabsbeats"
            target="_blank"
            rel="noopener noreferrer"
            style={navBtnStyle}
          >
            <FaYoutube style={{ color: 'red' }} />
            YouTube
          </a>
          <button onClick={() => navigate('/Account')} style={navBtnStyle}>
            <FaUser /> Account
          </button>
        </div>

        <button onClick={() => navigate('/Success')} style={navBtnStyle}>
          🧾 Purchases
        </button>
      </nav>

      {/* Beat Grid */}
      <div style={{ padding: '2rem', color: '#fff' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>🎵 RabsStore</h1>
        <div className="scrollbar-visible">
          {beats.map(beat => (
            <div
              key={beat.id}
              style={beatCardStyle}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img src={beat.image} alt={beat.title} style={beatImageStyle} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>{beat.title}</h3>
              <p style={{ color: '#bbb', marginBottom: '0.2rem' }}>Genre: {beat.genre}</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>₵{beat.price}</p>
              {beat.createdAt && (
                <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.3rem' }}>
                  {(() => {
                    const daysAgo = Math.floor((new Date() - beat.createdAt) / (1000 * 60 * 60 * 24));
                    return `Added: ${daysAgo === 0 ? 'Today' : `${daysAgo} day(s) ago`}`;
                  })()}
                </p>
              )}
              {beat.youtubeUrl && (
                <a
                  href={beat.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={youtubeBtnStyle}
                >
                  Watch on YouTube
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// === Styles ===
const navStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#1e1f25',
  padding: '10px',
  borderBottom: '1px solid #2a2b33',
  rowGap: '1rem',
  width: '100%',
};

const navButtonGroupStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
};

const navBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#fff',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem'
};

const cartCountStyle = {
  position: 'absolute',
  top: -5,
  right: -10,
  background: 'red',
  color: '#fff',
  borderRadius: '50%',
  padding: '2px 6px',
  fontSize: '0.75rem',
  fontWeight: 'bold'
};

const cartDropdownStyle = {
  position: 'absolute',
  right: 0,
  top: '2.8rem',
  backgroundColor: '#1d1f27',
  padding: '1rem',
  borderRadius: 8,
  width: 250,
  boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
  zIndex: 100
};

const cartImageStyle = {
  width: 40,
  height: 40,
  objectFit: 'cover',
  borderRadius: 6
};

const viewCartBtnStyle = {
  marginTop: '0.5rem',
  width: '100%',
  padding: '0.5rem',
  backgroundColor: '#4caf50',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontWeight: 600
};

const beatCardStyle = {
  background: '#1d1f27',
  borderRadius: 10,
  textDecoration: 'none',
  color: '#fff',
  padding: '1rem',
  width: '80vw',
  maxWidth: 300,
  minWidth: 200,
  flex: '0 0 auto',
  scrollSnapAlign: 'start',
  transition: 'transform 0.2s ease-in-out',
  marginRight: '1rem'
};

const beatImageStyle = {
  width: '100%',
  height: 'auto',
  aspectRatio: '16 / 9',
  objectFit: 'cover',
  borderRadius: 10,
  marginBottom: '0.8rem'
};

const youtubeBtnStyle = {
  marginTop: '0.5rem',
  display: 'inline-block',
  backgroundColor: '#FF0000',
  padding: '0.4rem 0.8rem',
  color: '#fff',
  borderRadius: 6,
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '0.9rem'
};

export default Homepage;
