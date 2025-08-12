import React, { useEffect, useState } from 'react';
import { getAITrips } from '../services/viewTripService';
import tripService from '../services/tripService';
import Layout from '../components/Layout';
import { Loader2, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

function UserTripCardItem({ trip }) {
    const destination = trip.userSelection?.destination || trip.name;
    const details = trip.userSelection 
        ? `${trip.userSelection.noOfDays} Days trip with ${trip.userSelection.budget} Budget`
        : trip.description;
    const imageUrl = trip.coverImage || (trip.tripData?.[0]?.travelPlan?.hotelOptions?.[0]?.hotelImageUrl) || "/default-cover.jpg";
    
    // --- THIS IS THE CORRECTED LINK ---
    // All trips now point to the same unified view route.
    const link = `/trip/${trip.id}/view`;

    return (
        <Link to={link}>
            <div className='hover:scale-105 transition-all p-4 border rounded-xl shadow-sm bg-white'>
                <img src={imageUrl} className='object-cover rounded-xl h-[180px]' alt={destination}/>
                <div className='mt-2'>
                    <h2 className='font-bold text-lg text-black'>{destination}</h2>
                    <h2 className='text-sm text-gray-500 truncate'>{details}</h2>
                </div>
            </div>
        </Link>
    );
}

function MyTrips() {
    // ... (The rest of the component logic for fetching trips remains the same) ...
    const [allTrips, setAllTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllTrips = async () => {
            setLoading(true);
            const aiTripsResult = await getAITrips();
            const manualTripsResult = await tripService.getMyTrips();
            const combinedTrips = [];
            if (aiTripsResult.success) combinedTrips.push(...aiTripsResult.data);
            if (manualTripsResult.success) combinedTrips.push(...manualTripsResult.data);
            combinedTrips.sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id));
            setAllTrips(combinedTrips);
            setLoading(false);
        };
        fetchAllTrips();
    }, []);

    return (
        <Layout title="My Trips">
            <div className='mt-10'>
                <h2 className='font-bold text-3xl'>My Trip History</h2>
                <p className='text-gray-500'>Here are all the trips you have planned, both manually and with AI.</p>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mt-10'>
                    {loading ? (
                        [1, 2, 3].map((item) => <div key={item} className='h-[250px] w-full bg-slate-200 animate-pulse rounded-xl'/>)
                    ) : allTrips.length > 0 ? (
                        allTrips.map((trip) => <UserTripCardItem trip={trip} key={trip.id} />)
                    ) : (
                        <div className='col-span-full flex flex-col items-center justify-center text-center w-full mt-20 text-gray-600'>
                            <Compass className='text-6xl mb-4 text-gray-400' />
                            <h3 className='text-xl font-semibold'>No previous trips found</h3>
                            <p className='text-sm mt-1'>Start your journey by creating your first trip!</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default MyTrips;