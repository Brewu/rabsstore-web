import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { FaShoppingCart, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { query,  limit, startAfter, orderBy } from 'firebase/firestore';

const Homepage = () => {
  const [beats, setBeats] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const BEATS_PER_PAGE = 6;
  const [lastVisibleBeat, setLastVisibleBeat] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const fetchBeats = async () => {
    try {
      const beatsQuery = lastVisibleBeat
        ? query(
          collection(db, 'beats'),
          orderBy('title'),
          startAfter(lastVisibleBeat),
          limit(BEATS_PER_PAGE)
        )
        : query(
          collection(db, 'beats'),
          orderBy('title'),
          limit(BEATS_PER_PAGE)
        );

      const snapshot = await getDocs(beatsQuery);
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const lastVisible = snapshot.docs[snapshot.docs.length - 1];

      setBeats(prev => [...prev, ...items]);
      setLastVisibleBeat(lastVisible);
      setHasMore(snapshot.docs.length === BEATS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching beats:', error);
    }
  };

  useEffect(() => {
    fetchBeats(); // fetch first page on load
  }, []);


  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const drawerItemStyle = {
    margin: '0.8rem 0',
    cursor: 'pointer',
    fontWeight: 500,
    color: '#ffffffcc'
  };

  const handleBeatClick = (beat) => {
    const isDiscounted = beat.discount > 0 && (!beat.discountEndDate || new Date() < new Date(beat.discountEndDate));
    const finalPrice = isDiscounted
      ? (Number(beat.price) * (1 - beat.discount / 100)).toFixed(2)
      : Number(beat.price).toFixed(2);

    const discountedBeat = {
      ...beat,
      price: finalPrice,
    };

    navigate('/Home', { state: { beat: discountedBeat } });
  };

  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      padding: '2rem',
      maxWidth: 1200,
      margin: '0 auto',
      backgroundColor: '#121418',
      color: '#f1f1f1',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <FaBars size={22} onClick={toggleDrawer} style={{ cursor: 'pointer', color: '#ffffffcc' }} />
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 'bold',
          letterSpacing: '-0.5px'
        }}>🎵 RabsStore</h1>
        <div style={{ position: 'relative' }} onClick={() => navigate('/Cart')}>
          <FaShoppingCart size={22} style={{ cursor: 'pointer', color: '#ffffffcc' }} />
          {totalItems > 0 && (
            <span style={{
              position: 'absolute',
              top: -10,
              right: -10,
              background: '#e63946',
              color: '#fff',
              borderRadius: '50%',
              padding: '0.3rem 0.6rem',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              {totalItems}
            </span>
          )}
        </div>
      </div>

      {/* Drawer Menu */}
      {drawerOpen && (
        <div style={{
          background: 'rgba(36, 39, 48, 0.95)',
          padding: '1.2rem',
          marginBottom: '2rem',
          borderRadius: 12,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
        }}>
          <p style={drawerItemStyle} onClick={() => { setDrawerOpen(false); navigate('/'); }}>🏠 Home</p>
          <p style={drawerItemStyle} onClick={() => { setDrawerOpen(false); window.open('https://youtube.com/@rabsbeats', '_blank'); }}>🎥 YouTube</p>
          <p style={drawerItemStyle} onClick={() => { setDrawerOpen(false); navigate('/Account'); }}>👤 My Account</p>
          <p style={drawerItemStyle} onClick={() => { setDrawerOpen(false); navigate('/Success'); }}>🎧 My Beats</p>
        </div>
      )}

      {/* Beats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1.5rem'
      }}>
        {beats.map(beat => (
          <div
            key={beat.id}
            onClick={() => handleBeatClick(beat)}
            style={{
              background: '#1d1f27',
              borderRadius: 14,
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img src={beat.image} alt={beat.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
            <div style={{ padding: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{beat.title}</h3>
              <p style={{ color: '#aaa', marginTop: 4 }}>{beat.genre}</p>
              <p style={{ fontWeight: 'bold', color: '#fefefe', marginTop: 6 }}>
                ₵{Number(beat.price).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Hot Deals Section */}
      {beats.some(b => b.discount > 0) && (
        <section style={{
          marginTop: '4rem',
          padding: '2rem',
          background: 'linear-gradient(135deg, #2b2d42, #1d1f27)',
          borderRadius: 16,
          boxShadow: '0 6px 20px rgba(0,0,0,0.4)'
        }}>
          <h2 style={{ fontSize: '1.6rem', color: '#ffffff', textAlign: 'center' }}>🔥 Hot Deals!</h2>
          <p style={{ color: '#ccc', textAlign: 'center', marginBottom: '1.5rem' }}>
            Grab these beats at discounted prices!
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}>
            {beats
              .filter(b => b.discount > 0)
              .map(beat => {
                const discountedPrice = (Number(beat.price) * (1 - beat.discount / 100)).toFixed(2);
                return (
                  <div
                    key={beat.id}
                    onClick={() => handleBeatClick(beat)}
                    style={{
                      background: '#1d1f27',
                      borderRadius: 14,
                      overflow: 'hidden',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease-in-out'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <img src={beat.image} alt={beat.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                    <div style={{ padding: '1rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{beat.title}</h3>
                      <p style={{ color: '#aaa', marginTop: 4 }}>{beat.genre}</p>
                      <p style={{ fontWeight: 'bold', color: '#ff5252', marginTop: 6 }}>
                        ₵{discountedPrice}
                        <span style={{ color: '#888', textDecoration: 'line-through', marginLeft: 6 }}>₵{Number(beat.price).toFixed(2)}</span>
                      </p>
                      <p style={{ color: '#4ecdc4', fontSize: '0.85rem', marginTop: 4 }}>
                        Save {beat.discount}%!
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{ marginTop: '5rem', textAlign: 'center', color: '#555', fontSize: '0.85rem' }}>
        <p>&copy; {new Date().getFullYear()} RabsStore. Designed with 🔥</p>
      </footer>
    </div>
  );
};

export default Homepage;
