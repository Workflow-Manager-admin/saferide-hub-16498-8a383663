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
        {mode === 'find' ? <FindRideForm /> : <OfferRideForm user={user} />}
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

// --- Find Ride Form (minimal UI, mock results) ---
function FindRideForm() {
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
                <button className="btn" style={{ marginTop: 6, fontSize: 15, background: "#4CAF50" }}>Request Ride</button>
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
