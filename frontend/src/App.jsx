import { useState } from "react";
import "./App.css";

function App() {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("10000");
  const [travelers, setTravelers] = useState("2");
  const [travelStyle, setTravelStyle] = useState("Adventure");
  const [interests, setInterests] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [trip, setTrip] = useState(null);

  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const interestOptions = [
    "Nature",
    "Food",
    "Adventure",
    "Culture",
    "Shopping",
    "Beaches",
  ];

  const toggleInterest = (interest) => {
    setInterests((previous) =>
      previous.includes(interest)
        ? previous.filter((item) => item !== interest)
        : [...previous, interest]
    );
  };

  
const handleSubmit = async (event) => {
  event.preventDefault();

  if (!destination.trim()) {
    alert("Please enter your destination.");
    return;
  }

  if (!budget || Number(budget) <= 0) {
    alert("Please enter a valid budget.");
    return;
  }

  if (!startDate || !endDate) {
    alert("Please select your travel dates.");
    return;
  }

  if (startDate < todayString) {
    alert("Start date cannot be in the past.");
    return;
  }

  if (endDate < startDate) {
    alert("End date cannot be before the start date.");
    return;
  }

  if (interests.length === 0) {
    alert("Please select at least one interest.");
    return;
  }

  const tripData = {
    destination: destination.trim(),
    budget: Number(budget),
    travelers,
    travelStyle,
    interests: [...interests],
    startDate,
    endDate,
  };

  try {
    const response = await fetch("http://127.0.0.1:8000/plan-trip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tripData),
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    const numberOfDays =
      Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

    setTrip({
      ...data.trip,
      numberOfDays,
    });

    document.getElementById("trip-preview")?.scrollIntoView({
      behavior: "smooth",
    });
  } catch (error) {
    console.error("Trip API error:", error);
    alert(
      "Backend se connection nahi ho paya. Check karo ki FastAPI server running hai."
    );
  }
};

  const resetTrip = () => {
    setTrip(null);
    document.getElementById("planner")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const formatDate = (date) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">✈</span>
          TripVibe
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#planner">Plan a Trip</a>
        </nav>

        <a className="nav-button" href="#planner">
          Start Planning
        </a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">✦ YOUR JOURNEY, YOUR VIBE</span>

            <h1>
              Your next adventure,
              <br />
              <span>perfectly planned.</span>
            </h1>

            <p>
              Tell us what you love. Our AI-powered travel planner helps
              you discover destinations and build a personalized itinerary
              that fits your budget and travel style.
            </p>

            <a className="primary-button" href="#planner">
              Plan My Trip <span>→</span>
            </a>

            <div className="hero-stats">
              <div>
                <strong>Personalized</strong>
                <span>For your travel style</span>
              </div>
              <div>
                <strong>Day by day</strong>
                <span>Easy-to-follow plans</span>
              </div>
              <div>
                <strong>Budget friendly</strong>
                <span>Trips that fit you</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="travel-image">
              <div className="image-overlay">
                <span>YOUR NEXT ESCAPE</span>
                <h2>Discover somewhere wonderful.</h2>
              </div>
            </div>

            <div className="floating-card">
              <span className="floating-icon">✦</span>
              <div>
                <strong>Made for you</strong>
                <p>Your journey, your way.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="features section" id="features">
          <div className="section-heading">
            <span className="eyebrow">TRAVEL SMARTER</span>
            <h2>Less planning. More exploring.</h2>
            <p>Everything you need to turn your travel ideas into a trip.</p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <span className="feature-icon purple">✦</span>
              <h3>AI-Powered Plans</h3>
              <p>Get itinerary suggestions tailored to your preferences.</p>
            </article>

            <article className="feature-card">
              <span className="feature-icon orange">⌖</span>
              <h3>Discover Places</h3>
              <p>Explore attractions, local food, culture and hidden gems.</p>
            </article>

            <article className="feature-card">
              <span className="feature-icon green">₹</span>
              <h3>Budget Conscious</h3>
              <p>Plan your experiences around your available budget.</p>
            </article>
          </div>
        </section>

        <section className="planner section" id="planner">
          <div className="section-heading">
            <span className="eyebrow">LET'S BUILD YOUR TRIP</span>
            <h2>Where would you love to go?</h2>
            <p>Share a few preferences to get your journey started.</p>
          </div>

          <form className="trip-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="destination">Destination</label>
              <input
                id="destination"
                type="text"
                placeholder="e.g. Manali, Goa, Jaipur"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  min={todayString}
                  onChange={(event) => {
                    setStartDate(event.target.value);
                    if (endDate && endDate < event.target.value) {
                      setEndDate("");
                    }
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  min={startDate || todayString}
                  onChange={(event) => setEndDate(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="budget">Total budget (₹)</label>
                <input
                  id="budget"
                  type="number"
                  min="1"
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="travelers">Number of travelers</label>
                <select
                  id="travelers"
                  value={travelers}
                  onChange={(event) => setTravelers(event.target.value)}
                >
                  <option value="1">1 traveler</option>
                  <option value="2">2 travelers</option>
                  <option value="3">3 travelers</option>
                  <option value="4">4 travelers</option>
                  <option value="5">5 travelers</option>
                  <option value="6+">6+ travelers</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>What is your travel vibe?</label>
              <div className="style-options">
                {["Relaxed", "Adventure", "Romantic", "Cultural", "Luxury"].map(
                  (style) => (
                    <button
                      key={style}
                      type="button"
                      className={
                        travelStyle === style
                          ? "choice-button selected"
                          : "choice-button"
                      }
                      onClick={() => setTravelStyle(style)}
                      aria-pressed={travelStyle === style}
                    >
                      {style}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="form-group">
              <label>What do you enjoy?</label>
              <div className="interest-options">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    className={
                      interests.includes(interest)
                        ? "choice-button selected"
                        : "choice-button"
                    }
                    onClick={() => toggleInterest(interest)}
                    aria-pressed={interests.includes(interest)}
                  >
                    {interests.includes(interest) ? "✓ " : "+ "}
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <button className="submit-button" type="submit">
              Create My Travel Plan <span>→</span>
            </button>

            <p className="form-note">
              Your preferences will be used to personalize your trip.
            </p>
          </form>
        </section>

        {trip && (
          <section className="section" id="trip-preview">
            <div className="section-heading">
              <span className="eyebrow">YOUR TRIP DETAILS</span>
              <h2>Your trip preview is ready!</h2>
              <p>Review your selected travel preferences below.</p>
            </div>

            <div className="feature-grid">
              <article className="feature-card">
                <span className="feature-icon purple">⌖</span>
                <h3>Destination</h3>
                <p>{trip.destination}</p>
              </article>

              <article className="feature-card">
                <span className="feature-icon green">₹</span>
                <h3>Total Budget</h3>
                <p>₹{trip.budget.toLocaleString("en-IN")}</p>
              </article>

              <article className="feature-card">
                <span className="feature-icon orange">♙</span>
                <h3>Travelers</h3>
                <p>{trip.travelers}</p>
              </article>

              <article className="feature-card">
                <span className="feature-icon purple">▦</span>
                <h3>Trip Duration</h3>
                <p>
                  {trip.numberOfDays}{" "}
                  {trip.numberOfDays === 1 ? "day" : "days"}
                </p>
              </article>
            </div>

            <div className="trip-form">
              <div className="form-group">
                <strong>Travel dates</strong>
                <p>
                  {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                </p>
              </div>

              <div className="form-group">
                <strong>Travel style</strong>
                <p>{trip.travelStyle}</p>
              </div>

              <div className="form-group">
                <strong>Your interests</strong>
                <p>{trip.interests.join(", ")}</p>
              </div>

              <p className="form-note">
                This is a preference preview. AI-generated daily activities
                will be added when the backend and AI API are connected.
              </p>

              <button
                className="submit-button"
                type="button"
                onClick={resetTrip}
              >
                Edit Trip Preferences
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <a className="brand" href="#home">
          <span className="brand-icon">✈</span>
          TripVibe
        </a>
        <p>Made for curious travelers and unforgettable journeys.</p>
        <span>© {new Date().getFullYear()} TripVibe</span>
      </footer>
    </div>
  );
}

export default App;