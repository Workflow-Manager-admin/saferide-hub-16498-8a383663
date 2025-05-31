import React, { useState } from 'react';
import './App.css';

/**
 * SafeRideHub Main Container
 *
 * Features:
 * 1. Verified Sign Up (only college/company emails)
 * 2. Find or Offer Rides
 * 3. Guardian Tracking (mock: live location sharing)
 * 4. SOS Button (mock: sends location alert)
 *
 * Minimal, light theme, blue & green accents, bottom navigation.
 */

// Utility function: validate email with college/company domains
function isVerifiedEmail(email) {
  // Allow emails ending with .edu, .ac.*, .edu.*, .org, or .company, or custom domains
  const regex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.(edu|ac|org|company)(\.[a-zA-Z]+)?|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})$/i;
  return regex.test(email.trim());
}

// Navigation configuration
const NAV_TABS = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'rides', label: 'Rides', icon: '🚗' },
  { key: 'profile', label: 'Profile', icon: '👤' },
];

// Main App
// PUBLIC_INTERFACE
function App() {
  // App State
  const [tab, setTab] = useState('home');
  const [user, setUser] = useState(null); // { name, email }
  const [showSignup, setShowSignup] = useState(false);

  // --- Verified Sign Up Modal Logic ---
  const [signupForm, setSignupForm] = useState({ name: '', email: '', error: '', loading: false });
  function handleSignupInput(e) {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value, error: '' });
  }
  function submitSignup(e) {
    e.preventDefault();
    if (!signupForm.name.trim() || !signupForm.email.trim()) {
      setSignupForm(form => ({ ...form, error: 'All fields are required.' }));
      return;
    }
    if (!isVerifiedEmail(signupForm.email)) {
      setSignupForm(form => ({
        ...form,
        error: 'Use a valid college or company email address.',
      }));
      return;
    }
    setUser({ name: signupForm.name.trim(), email: signupForm.email.trim() });
    setShowSignup(false);
    setSignupForm({ name: '', email: '', error: '', loading: false });
  }
  function signOut() {
    setUser(null);
    setTab('home');
  }

  // --- Home Screen ---
  const HomeScreen = (
    <div className="srh-main-home" style={{ textAlign: 'center', paddingTop: 32 }}>
      <div style={{
        fontSize: 38, fontWeight: 700, color: "#2196F3", marginBottom: 6
      }}>SafeRide Hub</div>
      <div style={{ color: '#4CAF50', fontSize: 18, fontWeight: 500, marginBottom: 20 }}>
        Eco-Friendly, Trusted Ride Pooling
      </div>
      <div style={{
        maxWidth: 480,
        color: '#555',
        margin: '0 auto 32px auto',
        fontSize: 16
      }}>
        Connect with trusted peers for safe, sustainable travel. Find rides, offer rides, and share your journey with guardians for complete peace of mind.
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "14px", marginBottom: 28 }}>
        <ActionButton
          color="#2196F3"
          icon="🔍"
          label="Find Ride"
          onClick={() => setTab('rides')}
        />
        <ActionButton
          color="#4CAF50"
          icon="➕"
          label="Offer Ride"
          onClick={() => setTab('rides')}
        />
      </div>
      <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginBottom: 22 }}>
        <GuardianTrackingBtn user={user} />
        <SOSButton user={user} />
      </div>
      {!user && (
        <div style={{ marginTop: 32 }}>
          <button className="btn btn-large"
            style={{
              background: "#2196F3",
              fontWeight: 600
            }}
            onClick={() => setShowSignup(true)}
          >Sign Up / Log In</button>
        </div>
      )}
    </div>
  );

  // --- Ride main workflow state
  // rideStep: null | 'progress' | 'complete'
  const [rideStep, setRideStep] = useState(null); 
  const [currentRide, setCurrentRide] = useState(null); // object: details about selected ride

  // --- Rides Screen (Find/Offer) ---
  function RidesTab() {
    const [mode, setMode] = useState('find'); // 'find' | 'offer'
    return (
      <div className="srh-rides" style={{ maxWidth: 475, margin: "0 auto", paddingTop: 24 }}>
        <div style={{ display: "flex", gap: 5, marginBottom: 24 }}>
          <button onClick={() => setMode('find')}
            style={{
              flex: 1,
              background: mode === 'find' ? "#2196F3" : "#fff",
              color: mode === 'find' ? "#fff" : "#2196F3",
              border: "2px solid #2196F3",
              borderRadius: 6,
              fontWeight: 600,
              padding: "11px 0",
              cursor: "pointer",
              fontSize: '1.08rem'
            }}>
            Find Ride
          </button>
          <button onClick={() => setMode('offer')}
            style={{
              flex: 1,
              background: mode === 'offer' ? "#4CAF50" : "#fff",
              color: mode === 'offer' ? "#fff" : "#4CAF50",
              border: "2px solid #4CAF50",
              borderRadius: 6,
              fontWeight: 600,
              padding: "11px 0",
              cursor: "pointer",
              fontSize: '1.08rem'
            }}>
            Offer Ride
          </button>
        </div>
        {
          mode === 'find'
            ? (
              <FindRideForm onRequestRide={(ride) => {
                setCurrentRide(ride);
                setRideStep("progress");
              }} />
            )
            : <OfferRideForm user={user} />
        }
      </div>
    );
  }

  // --- Main Content Rendering ---
  let mainContent;
  if (!user) {
    // If not signed in, show Home only, but allow modal for sign up
    mainContent = HomeScreen;
  } else if (tab === 'home') {
    mainContent = HomeScreen;
  } else if (tab === 'rides') {
    mainContent = <RidesTab />;
  } else if (tab === 'profile') {
    mainContent =
      <ProfileTab user={user} onSignOut={signOut}/>;
  }

  return (
    <div className="app" style={{ background: "#fff", color: "#222", minHeight: "100vh", position: "relative" }}>
      <nav className="navbar" style={{ background: "#fff", borderBottom: "1.5px solid #e3e5ea", color: "#2196F3" }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center", width: '100%' }}>
            <div className="logo" style={{ color: "#2196F3" }}>
              <span className="logo-symbol" style={{ color: "#4CAF50", fontSize: 22 }}>🛡️</span>
              SafeRide Hub
            </div>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ color: "#4CAF50", fontWeight: 500, fontSize: 15 }}>
                  {user.name} &nbsp;
                  <span style={{ fontSize: 13, color: "#777" }}>({user.email})</span>
                </span>
                <button className="btn"
                  style={{ background: "#2196F3", fontWeight: 500, fontSize: 15 }}
                  onClick={signOut}>Sign out</button>
              </div>
            ) : (
              <button className="btn"
                style={{ background: "#2196F3", fontWeight: 500 }}
                onClick={() => setShowSignup(true)}>
                Sign Up / Log In
              </button>
            )}
          </div>
        </div>
      </nav>

      <main style={{ minHeight: '84vh', paddingTop: 90, marginBottom: 64 }}>
        <div className="container">
          {mainContent}
        </div>
      </main>
      <BottomNav tab={tab} setTab={setTab} user={user} />

      {/* Verified Sign Up Modal */}
      {showSignup && (
        <Modal onClose={() => setShowSignup(false)}>
          <form style={{ maxWidth: 330, margin: "0 auto"}}
            onSubmit={submitSignup}
          >
            <div style={{
              fontWeight: 600,
              fontSize: 20,
              marginBottom: 18,
              color: "#2196F3"
            }}>Sign Up / Log In</div>
            <div className="input-group" style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 500, marginBottom: 5 }}>Full Name</label>
              <input
                name="name"
                type="text"
                autoFocus
                required
                placeholder="Your Name"
                style={inputStyle}
                value={signupForm.name}
                onChange={handleSignupInput}
              />
            </div>
            <div className="input-group" style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 500, marginBottom: 5 }}>College/Company Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="your@email.edu"
                style={inputStyle}
                value={signupForm.email}
                onChange={handleSignupInput}
              />
            </div>
            {signupForm.error && (
              <div style={{ color: "#e53935", marginBottom: 10, fontSize: 14 }}>{signupForm.error}</div>
            )}
            <button type="submit" className="btn btn-large"
              style={{
                width: "100%", background: "#2196F3", fontWeight: 600, marginTop: 5
              }}>Continue</button>
            <div style={{ marginTop: 12, textAlign: "center" }}>
              <button type="button" style={{
                background: "transparent", border: "none", color: "#888", cursor: "pointer"
              }} onClick={() => setShowSignup(false)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// Bottom Navigation Bar
function BottomNav({ tab, setTab, user }) {
  return (
    <nav
      style={{
        position: "fixed", left: 0, right: 0, bottom: 0,
        height: 58, borderTop: "1px solid #e3e5ea",
        background: "#fff", zIndex: 50, display: "flex", justifyContent: "center",
      }}
    >
      <div style={{
        display: "flex", width: 320, maxWidth: "95vw", justifyContent: "space-between", alignItems: "center",
        margin: "0 auto", height: "100%"
      }}>
        {NAV_TABS.map(nav => (
          <button
            key={nav.key}
            aria-label={nav.label}
            disabled={(!user && nav.key !== "home")}
            onClick={() => setTab(nav.key)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: 'none',
              color: tab === nav.key ? nav.key === 'rides' ? "#4CAF50" : "#2196F3" : "#8b909a",
              fontWeight: tab === nav.key ? 700 : 400,
              fontSize: 22,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: (!user && nav.key !== "home") ? 0.38 : 1,
              padding: "5px 0", cursor: (!user && nav.key !== "home") ? "not-allowed" : "pointer"
            }}
          >
            <span style={{ marginBottom: 2 }}>{nav.icon}</span>
            <span style={{ fontSize: 13, marginTop: 0 }}>{nav.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// Action Button for home
function ActionButton({ color, icon, label, onClick }) {
  return (
    <button
      className="btn btn-large"
      style={{
        background: color,
        fontWeight: 700,
        minWidth: 120,
        fontSize: 19,
        borderRadius: 7,
        boxShadow: "0 2px 12px #e9ecee",
        display: "flex",
        alignItems: "center",
        gap: 9,
      }}
      onClick={onClick}
    >
      <span style={{ fontSize: 26 }}>{icon}</span>
      {label}
    </button>
  );
}

/**
 * Ride Progress Page: shows live location, SOS button, and guardian tracking.
 * Receives props: onComplete (callback to finish ride), rideDetails (selected ride info), user.
 */
function RideProgressPage({ onComplete, rideDetails, user }) {
  // For mock purposes: live location could just be a box (no real GPS/map integration)
  // Simulate 'ride in progress' by a "Mark as Complete" button.
  return (
    <div style={{
      maxWidth: 460, margin: "0 auto", background: "#f8fbff",
      borderRadius: 10, padding: "28px 20px", boxShadow: "0 4px 26px #e5ebfb14"
    }}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{
          fontSize: 28, fontWeight: 700, color: "#2196F3", marginBottom: 5
        }}>Ride In Progress</div>
        <div style={{
          color: "#4CAF50", fontWeight: 500, fontSize: 17,
          marginBottom: 6
        }}>with {rideDetails.driver}</div>
        <div style={{ color: "#888", marginBottom: 16, fontSize: 15 }}>Live guardian tracking is active.</div>
        <div style={{ marginBottom: 18 }}>
          <div style={{
            background: "#cbeffa",
            border: "2px solid #2196F3",
            borderRadius: 11,
            minHeight: 170,
            margin: "0 auto",
            maxWidth: 340,
            position: "relative",
            marginBottom: 8,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}>
            <div style={{ margin: 16, color: "#1A4574" }}>
              <span style={{ fontSize: 23, fontWeight: 600 }}>🗺️ Map Placeholder</span>
              <div style={{ color: "#555", fontSize: 15, margin: "5px 0" }}>
                (Your Live Location &amp; Route)
              </div>
            </div>
            <div style={{
              position: "absolute", top: 8, right: 16, color: "#4CAF50",
              fontSize: 16, fontWeight: 500, display: "flex", alignItems: "center"
            }}>
              🛰️ Guardian: {user.name?.split(" ")[0] || "User"}
            </div>
          </div>
        </div>
        <div style={{
          display: "flex", justifyContent: "center", gap: 23, marginBottom: 32
        }}>
          <SOSButton user={user} />
          <button
            className="btn"
            onClick={onComplete}
            style={{
              background: "#4CAF50",
              color: "#fff",
              fontWeight: 700,
              fontSize: 17,
              borderRadius: 7
            }}
          >Mark Ride as Complete</button>
        </div>
        <div style={{
          padding: "9px 0", color: "#2196F3", fontSize: 15, fontWeight: 500
        }}>
          Guardian tracking:<br />
          <span style={{ fontWeight: 600, color: "#0677e1" }}>Active</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Ride Completion Page: show mark ride as completed, prompt to rate driver, and eco score.
 * Receives props: rideDetails, onReturnHome.
 */
function RideCompletePage({ rideDetails, onReturnHome }) {
  const [rated, setRated] = useState(false);
  const [rating, setRating] = useState(0);

  // Random Eco score for demonstration
  const ecoScore = rideDetails.eco ? (Math.round(Math.random() * 3 + 6)) : (Math.round(Math.random() * 2 + 2));
  const ecoSavings = rideDetails.eco ? (Math.round(Math.random() * 2) + 2) : 1;

  return (
    <div style={{
      maxWidth: 420, margin: "0 auto", background: "#f9fff8",
      borderRadius: 10, padding: "28px 22px", boxShadow: "0 4px 26px #e3fbe514"
    }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{
          fontSize: 26, fontWeight: 700, color: "#4CAF50", marginBottom: 6
        }}>Ride Complete</div>
        <div style={{ color: "#555", marginBottom: 16, fontSize: 15 }}>
          Thank you for using SafeRide! Please rate your driver.
        </div>
        <div style={{
          fontSize: 19,
          fontWeight: 600,
          marginBottom: 10,
          color: "#2196F3"
        }}>{rideDetails.driver} ({rideDetails.contact})</div>

        <div style={{ margin: "11px 0", fontSize: 17 }}>
          Rate your ride:
        </div>
        <div style={{ marginBottom: 15, display: "flex", justifyContent: "center" }}>
          {[1, 2, 3, 4, 5].map(num => (
            <span
              key={num}
              style={{
                fontSize: 30,
                cursor: rated ? "default" : "pointer",
                color: num <= rating ? "#FFD600" : "#bbb",
                transition: "color 0.18s",
                marginRight: num < 5 ? 6 : 0
              }}
              onClick={() => !rated && setRating(num)}
              aria-label={`Rate ${num}`}
            >★</span>
          ))}
        </div>
        <button
          className="btn"
          disabled={rated || !rating}
          style={{
            background: "#2196F3",
            color: "#fff",
            fontWeight: 700,
            fontSize: 17,
            borderRadius: 7,
            marginBottom: 16,
            minWidth: 120,
            opacity: rating && !rated ? 1 : 0.7,
            cursor: rating && !rated ? "pointer" : "not-allowed"
          }}
          onClick={() => setRated(true)}
        >
          {rated ? "Thank You!" : "Submit Rating"}
        </button>
        {rated && (
          <div style={{
            marginBottom: 20,
            color: "#4CAF50",
            fontSize: 16,
            fontWeight: 600
          }}>
            ★ Your rating was submitted!
          </div>
        )}

        <div style={{
          borderTop: "1.2px solid #e3e5ea", marginTop: 20, paddingTop: 14
        }}>
          <div style={{
            color: "#169718", fontSize: 18, fontWeight: 600, marginBottom: 2
          }}>Your Eco Score: <span style={{ color: "#388e3c" }}>{ecoScore}/10</span></div>
          <div style={{ color: "#444", fontSize: 14 }}>
            Estimated CO₂ Savings: <b>{ecoSavings} kg</b>
          </div>
          <div style={{
            color: "#888", fontSize: 13, marginTop: 4
          }}>
            (Riding with eco-friendly vehicles increases your savings!)
          </div>
        </div>
        <button
          className="btn btn-large"
          onClick={onReturnHome}
          style={{
            background: "#2196F3",
            fontWeight: 700,
            fontSize: 18,
            borderRadius: 7,
            marginTop: 26,
            minWidth: 180
          }}
        >Back to Home</button>
      </div>
    </div>
  );
}


// --- Find Ride Form (minimal UI, mock results, now with Request Ride navigation) ---
function FindRideForm({ onRequestRide }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [rides, setRides] = useState([]);
  const [searched, setSearched] = useState(false);

  function handleSearch(e) {
    e.preventDefault();
    setSearched(true);
    // Mock available rides
    setRides([
      {
        id: 1,
        driver: 'Priya Narang',
        contact: 'priya@univ.edu',
        from,
        to,
        seats: 2,
        time: '8:00 AM',
        eco: true,
      },
      {
        id: 2,
        driver: 'Rahul Menon',
        contact: 'rmenon@corp.com',
        from,
        to,
        seats: 1,
        time: '8:05 AM',
        eco: false,
      }
    ]);
  }

  return (
    <div>
      <form style={{ marginBottom: 20 }} onSubmit={handleSearch}>
        <label>From
          <input style={inputStyle} required placeholder="Start location" value={from} onChange={e => setFrom(e.target.value)} />
        </label>
        <label>To
          <input style={inputStyle} required placeholder="Destination" value={to} onChange={e => setTo(e.target.value)} />
        </label>
        <button className="btn btn-large" style={{ background: "#2196F3", width: "100%", marginTop: 8 }}>
          Search Rides
        </button>
      </form>
      {searched && rides.length > 0 && (
        <div>
          <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 7 }}>Available Rides</div>
          <ul style={{ padding: 0, listStyle: "none", margin: 0 }}>
            {rides.map(r => (
              <li key={r.id} style={{
                padding: 13, border: "1px solid #e4e9ef",
                borderRadius: 7, marginBottom: 9,
                background: "#fafcff"
              }}>
                <div>
                  <span style={{ color: "#2196F3", fontWeight: 600 }}>{r.driver}</span> &nbsp; &#8226; <span style={{ fontSize: 13 }}>{r.contact}</span>
                </div>
                <div style={{ fontSize: 15, margin: "3px 0", color: "#555" }}>
                  {r.from} <span style={{ fontWeight: 700, color: "#2196F3" }}>&rarr;</span> {r.to}
                </div>
                <div style={{ fontSize: 14, color: "#888" }}>
                  {r.seats} seat(s) &nbsp;|&nbsp; {r.time} &nbsp;{r.eco && <span style={{color:"#4CAF50"}}>🌱Eco</span>}
                </div>
                <button
                  className="btn"
                  style={{ marginTop: 6, fontSize: 15, background: "#4CAF50" }}
                  onClick={() => onRequestRide(r)}
                >
                  Request Ride
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {searched && rides.length < 1 && (
        <div style={{ color: "#888", marginTop: 18 }}>
          No rides found. Try offering a ride!
        </div>
      )}
    </div>
  );
}

// --- Offer Ride Form (minimal, no backend, mock preview) ---
function OfferRideForm({ user }) {
  const [form, setForm] = useState({
    from: '', to: '', seats: 1, eco: false, time: '', submitted: false
  });
  function update(e) {
    const { name, value, type, checked } = e.target;
    setForm(form => ({
      ...form,
      [name]: type === "checkbox" ? checked : value
    }));
  }
  function submit(e) {
    e.preventDefault();
    setForm(form => ({ ...form, submitted: true }));
    // Would send to backend (out of scope)
  }
  if (form.submitted) {
    return (
      <div style={{ textAlign: "center", marginTop: 28 }}>
        <div style={{ fontWeight: 600, fontSize: 18, color: "#4CAF50", marginBottom: 10 }}>
          Ride Offered! 🎉
        </div>
        <div style={{ color: "#555", fontSize: 15 }}>
          Your ride from <span style={{ fontWeight: 500, color: "#2196F3" }}>{form.from}</span> to <span style={{ fontWeight: 500, color: "#2196F3" }}>{form.to}</span> is now available for others to join.
        </div>
      </div>
    );
  }
  return (
    <form onSubmit={submit}>
      <label>From
        <input style={inputStyle} required placeholder="Start location" name="from" value={form.from} onChange={update} />
      </label>
      <label>To
        <input style={inputStyle} required placeholder="Destination" name="to" value={form.to} onChange={update} />
      </label>
      <label>Time
        <input style={inputStyle} required type="time" name="time" value={form.time} onChange={update} />
      </label>
      <label>Seats
        <input style={inputStyle} required type="number" min="1" max="8" name="seats" value={form.seats} onChange={update} />
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <input type="checkbox" name="eco" checked={form.eco} onChange={update} style={{ accentColor: "#4CAF50" }}/>
        Eco-Friendly Vehicle
      </label>
      <button className="btn btn-large" style={{ background: "#4CAF50", width: "100%", marginTop: 11 }}>
        Post Ride
      </button>
    </form>
  );
}

// Guardian Tracking Button/Feature (minimal dummy, no real GPS)
function GuardianTrackingBtn({ user }) {
  const [tracking, setTracking] = useState(false);

  function toggleTracking() {
    setTracking(val => !val);
    // Would invoke location sharing backend
  }
  return (
    <button
      className="btn"
      style={{
        background: tracking ? "#FFF" : "#E8F5E9",
        color: "#4CAF50",
        border: "2px solid #4CAF50",
        borderRadius: 7,
        fontWeight: 700,
        fontSize: 16,
        minWidth: 120,
        display: "flex", alignItems: "center", gap: 9
      }}
      onClick={toggleTracking}
      disabled={!user}
      aria-label="Guardian Tracking"
    >
      <span style={{ fontSize: 22 }}>🛰️</span>
      {tracking ? "Sharing..." : "Guardian Tracking"}
    </button>
  );
}

// SOS Button (alerts guardians/authorities, mock)
function SOSButton({ user }) {
  const [sent, setSent] = useState(false);
  function triggerSOS() {
    setSent(true);
    setTimeout(() => setSent(false), 2900);
    // Would send SOS via backend
    alert("SOS Alert sent! Your live location has been shared with guardians and local authorities.");
  }
  return (
    <button
      className="btn"
      style={{
        background: "#fff",
        color: "#e53935",
        border: "2px solid #e53935",
        borderRadius: 7,
        fontWeight: 700,
        fontSize: 16,
        minWidth: 120,
        display: "flex", alignItems: "center", gap: 9
      }}
      onClick={triggerSOS}
      disabled={!user || sent}
      aria-label="SOS"
    >
      <span style={{ fontSize: 21 }}>🆘</span>
      {sent ? "SOS Sent!" : "SOS"}
    </button>
  );
}

// ProfileTab - minimal user profile info
function ProfileTab({ user, onSignOut }) {
  return (
    <div style={{ maxWidth: 425, margin: "0 auto", paddingTop: 28 }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 45, margin: "0 auto" }}>👤</div>
        <div style={{ fontWeight: 700, fontSize: 21, marginTop: 7, color: "#2196F3" }}>
          {user.name}
        </div>
        <div style={{ color: "#333", fontSize: 15, marginBottom: 6 }}>{user.email}</div>
        <button className="btn" style={{ background: "#2196F3" }} onClick={onSignOut}>Sign Out</button>
      </div>
      <hr style={{ border: "none", borderBottom: "1.2px solid #e3e5ea", margin: "20px auto", width: "80%" }} />
      <div>
        <div style={{ fontWeight: 600, color: "#4CAF50", fontSize: 16, marginBottom: 5 }}>Features:</div>
        <ul style={{ color: "#444", fontSize: 14, lineHeight: "1.8" }}>
          <li>Verified Sign Up (email required)</li>
          <li>Find or Offer Rides with eco-friendly emphasis</li>
          <li>Guardian Tracking for live safety sharing</li>
          <li>SOS emergency alerts</li>
        </ul>
      </div>
    </div>
  );
}

// Minimal Modal
function Modal({ children, onClose }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(44,47,51,0.17)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#fff", boxShadow: "0 8px 36px #bccadd12", borderRadius: 8,
        padding: "32px 22px 18px 22px", minWidth: 320, maxWidth: "90vw", position: "relative"
      }}>
        <button onClick={onClose}
          aria-label="Close"
          style={{
            background: "none", border: "none", color: "#2196F3", fontSize: 20,
            position: "absolute", top: 10, right: 15, cursor: "pointer"
          }}>✕</button>
        {children}
      </div>
    </div>
  );
}

// Consistent input style
const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  fontSize: 15,
  margin: "6px 0 14px 0",
  border: "1.5px solid #e3e5ea",
  borderRadius: 5,
  outline: "none",
  background: "#f7fafd",
};


export default App;
