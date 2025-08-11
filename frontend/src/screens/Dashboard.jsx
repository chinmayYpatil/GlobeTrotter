import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../contexts/TripContext';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { trips, cities, searchCities } = useTrips();
  const { user } = useAuth();

  const previousTrips = trips.filter(trip => new Date(trip.startDate) < new Date()).slice(0, 3);

  // Controls state
  const [query, setQuery] = useState('');
  const [priceBand, setPriceBand] = useState('all'); // all | budget | mid | luxury
  const [sortBy, setSortBy] = useState('popularity_desc'); // name_asc | popularity_desc | cost_asc | cost_desc

  // Derived cities based on search/filter/sort
  const filteredAndSorted = useMemo(() => {
    let list = searchCities ? searchCities(query) : cities;

    if (priceBand !== 'all') {
      list = list.filter(c => {
        if (priceBand === 'budget') return c.costIndex <= 60;
        if (priceBand === 'mid') return c.costIndex > 60 && c.costIndex <= 80;
        return c.costIndex > 80; // luxury
      });
    }

    const listCopy = [...list];
    switch (sortBy) {
      case 'name_asc':
        listCopy.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'cost_asc':
        listCopy.sort((a, b) => a.costIndex - b.costIndex);
        break;
      case 'cost_desc':
        listCopy.sort((a, b) => b.costIndex - a.costIndex);
        break;
      default:
        listCopy.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
    }

    return listCopy;
  }, [cities, query, priceBand, sortBy, searchCities]);

  // Horizontal auto-infinite carousel for Top Regions
  const carouselRef = useRef(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const duplicatedList = useMemo(() => [...filteredAndSorted, ...filteredAndSorted], [filteredAndSorted]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    let rafId;
    const speedPxPerFrame = 0.7;

    const step = () => {
      if (!isAutoScroll) {
        rafId = requestAnimationFrame(step);
        return;
      }
      el.scrollLeft += speedPxPerFrame;
      const half = el.scrollWidth / 2;
      if (el.scrollLeft >= half) {
        el.scrollLeft -= half;
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [duplicatedList, isAutoScroll]);

  const scrollBy = (delta) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const handlePrev = () => {
    const width = carouselRef.current?.clientWidth || 600;
    scrollBy(-Math.floor(width * 0.9));
  };
  const handleNext = () => {
    const width = carouselRef.current?.clientWidth || 600;
    scrollBy(Math.floor(width * 0.9));
  };

  return (
    <Layout title="Dashboard">
      {/* Banner */}
      <div className="rounded-3xl overflow-hidden shadow-xl mb-6 h-56 md:h-72 flex items-center justify-center bg-gradient-to-r from-blue-700 to-teal-500 relative">
        <span className="text-4xl md:text-5xl text-white font-extrabold drop-shadow-lg tracking-wider">Banner Image</span>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col md:flex-row items-center gap-3 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search bar ......"
          className="flex-1 rounded-xl px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 shadow"
        />
        <div className="flex gap-2 w-full md:w-auto">
          <select
            value={priceBand}
            onChange={(e) => setPriceBand(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 shadow text-gray-700 font-medium"
          >
            <option value="all">Filter: All budgets</option>
            <option value="budget">Filter: Budget (&lt;=60)</option>
            <option value="mid">Filter: Mid (61-80)</option>
            <option value="luxury">Filter: Luxury (&gt;80)</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 shadow text-gray-700 font-medium"
          >
            <option value="popularity_desc">Sort by: Popularity</option>
            <option value="name_asc">Sort by: Name (A-Z)</option>
            <option value="cost_asc">Sort by: Cost (Low-High)</option>
            <option value="cost_desc">Sort by: Cost (High-Low)</option>
          </select>
        </div>
      </div>

      {/* Top Regional Selections - horizontal auto-infinite carousel with side arrows */}
      <div className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-blue-900 tracking-wide mb-3">Top Regional Selections</h2>

        {filteredAndSorted.length === 0 ? (
          <div className="rounded-2xl bg-white/60 p-8 border border-gray-200 text-center text-gray-600">
            No destinations match your filters.
          </div>
        ) : (
          <div
            className="relative group"
            onMouseEnter={() => setIsAutoScroll(false)}
            onMouseLeave={() => setIsAutoScroll(true)}
          >
            <div
              ref={carouselRef}
              className="rounded-2xl bg-white/60 p-4 border border-gray-200 overflow-hidden"
            >
              <div className="flex gap-4 w-max">
                {duplicatedList.map((region, idx) => (
                  <div
                    key={`${region.id}-${idx}`}
                    className="w-56 flex-shrink-0 bg-white rounded-2xl shadow hover:shadow-lg overflow-hidden border border-gray-200 cursor-pointer transition-transform hover:-translate-y-0.5"
                  >
                    <img src={region.image} alt={region.name} className="w-full h-36 object-cover" />
                    <div className="p-3">
                      <div className="font-semibold text-gray-900 truncate">{region.name}</div>
                      <div className="text-xs text-gray-500">{region.country}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Side arrows */}
            <button
              onClick={handlePrev}
              aria-label="Scroll left"
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 rounded-full bg-white/90 border border-gray-200 shadow opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Scroll right"
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 rounded-full bg-white/90 border border-gray-200 shadow opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Previous Trips */}
      <div className="mb-24">
        <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-4 tracking-wide">Previous Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {previousTrips.length > 0 ? previousTrips.map(trip => (
            <div
              key={trip.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 cursor-pointer hover:shadow-2xl transition-shadow"
              onClick={() => navigate(`/trip/${trip.id}/view`)}
            >
              <div className="h-36 bg-gradient-to-r from-blue-400 to-teal-400 relative overflow-hidden">
                {trip.coverImage && (
                  <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute bottom-3 left-3">
                  <h3 className="text-white font-bold text-lg">{trip.name}</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="text-gray-600 mb-2 line-clamp-2 text-sm">{trip.description}</div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{trip.startDate} - {trip.endDate}</span>
                  <span>${trip.budget.total}</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-gray-200">
              <span className="block text-gray-400 text-3xl mb-4">🗺️</span>
              <p className="text-gray-600 mb-4">No previous trips found</p>
              <button
                onClick={() => navigate('/create-trip')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Plan Your First Trip
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Plan a Trip Button */}
      <button
        onClick={() => navigate('/create-trip')}
        className="fixed bottom-8 right-8 z-50 bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-2 text-lg font-semibold hover:bg-blue-700 transition-all"
      >
        <Plus className="w-6 h-6" /> Plan a trip
      </button>
    </Layout>
  );
};

export default Dashboard;