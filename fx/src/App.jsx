import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, Wind, Droplets, Bug, Leaf, BarChart2, Bell, TrendingUp, Clock, Thermometer, User, Shield, LogOut, Mail, Lock, UserPlus, Sunrise, Sunset, CheckCircle, XCircle } from 'lucide-react';

// Mock Data (replace with API calls)
const mockWeatherData = {
    current: {
        temp: 32,
        condition: 'Sunny',
        humidity: 65,
        wind: 15,
    },
    forecast: [
        { day: 'Mon', temp: 33, condition: 'Sunny' },
        { day: 'Tue', temp: 34, condition: 'Sunny' },
        { day: 'Wed', temp: 31, condition: 'Cloudy' },
        { day: 'Thu', temp: 29, condition: 'Rainy' },
        { day: 'Fri', temp: 32, condition: 'Sunny' },
    ],
};

// New Detailed Weather Data for Prayagraj, Uttar Pradesh
const mockDetailedWeatherData = {
    location: 'Prayagraj, Uttar Pradesh',
    current: {
        temp: 31,
        feels_like: 38,
        condition: 'Partly Cloudy',
        humidity: 82,
        wind: 12, // km/h
        uv_index: 'High',
        sunrise: '5:45 AM',
        sunset: '6:50 PM',
    },
    hourly: [
        { time: '12 PM', temp: 31, condition: 'Partly Cloudy' },
        { time: '2 PM', temp: 32, condition: 'Thunderstorm Possible' },
        { time: '4 PM', temp: 30, condition: 'Rainy' },
        { time: '6 PM', temp: 29, condition: 'Cloudy' },
        { time: '8 PM', temp: 28, condition: 'Cloudy' },
    ],
    advisory: {
        title: "Farmer's Advisory for Today",
        soil_condition: "High humidity and expected rain will keep soil moisture levels high. Avoid over-irrigation. Be vigilant for signs of fungal diseases like root rot due to waterlogged conditions.",
        surrounding_condition: "The warm and humid environment is ideal for pest proliferation, especially for aphids and whiteflies. Monitor crops closely and prepare for preventative spraying if necessary. Weeds will also grow rapidly; consider timely removal."
    }
};


const mockSoilData = {
    moisture: 45, // percentage
    nitrogen: 78, // kg/ha
    phosphorus: 45, // kg/ha
    potassium: 60, // kg/ha
    ph: 6.8,
};

const mockPestDetectionResult = {
    detected: true,
    pest: 'Aphids',
    confidence: 92,
    recommendation: 'Consider introducing ladybugs or using neem oil spray. Monitor plants closely for the next 5-7 days.',
    imageUrl: 'https://placehold.co/600x400/a8e063/4a4a4a?text=Detected+Aphids+on+Leaf'
};

const initialNotifications = [
    { id: 1, title: 'Heavy Rain Warning', message: 'Thunderstorms and heavy rain expected in the next 3 hours. Secure equipment and check drainage.', type: 'weather', time: '15m ago', read: false },
    { id: 2, title: 'Soil Moisture Alert', message: 'Soil moisture in Plot A is critically low. Immediate irrigation is required.', type: 'soil', time: '2h ago', read: false },
    { id: 3, title: 'Pest Activity Detected', message: 'Aphids detected in the north field. Consider preventative measures.', type: 'pest', time: '1d ago', read: true },
    { id: 4, title: 'Irrigation Reminder', message: 'Scheduled irrigation for Plot D starts in 1 hour.', type: 'irrigation', time: '1d ago', read: true },
    { id: 5, title: 'High Winds Forecasted', message: 'Strong winds forecasted for tomorrow morning. Protect young or fragile crops.', type: 'weather', time: '2d ago', read: true },
];

const mockIrrigationData = {
    status: 'All Systems Normal',
    waterUsage: {
        today: 1200, // Liters
        week: 8400, // Liters
        month: 35000, // Liters
    },
    plots: [
        { id: 'A', name: 'North Field', moisture: 42, status: 'Low' },
        { id: 'B', name: 'West Field', moisture: 65, status: 'Optimal' },
        { id: 'C', name: 'East Field', moisture: 70, status: 'Optimal' },
        { id: 'D', name: 'South Field', moisture: 85, status: 'High' },
    ],
    schedule: [
        { plot: 'A', time: 'Tomorrow, 5:00 AM', duration: '30 mins' },
        { plot: 'D', time: 'In 2 days, 6:00 AM', duration: '20 mins' },
    ]
};


// Helper Components

const WeatherIcon = ({ condition, size = 24 }) => {
    switch (condition.toLowerCase()) {
        case 'sunny':
            return <Sun className="text-yellow-400" size={size} />;
        case 'cloudy':
            return <Cloud className="text-gray-400" size={size} />;
        case 'rainy':
            return <CloudRain className="text-blue-400" size={size} />;
        case 'partly cloudy':
             return <Cloud className="text-yellow-400" size={size} />;
        case 'thunderstorm possible':
            return <CloudRain className="text-gray-500" size={size} />;
        default:
            return <Sun className="text-yellow-400" size={size} />;
    }
};

const Card = ({ title, icon, children, className }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 ${className}`}>
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white ml-3">{title}</h3>
        </div>
        <div>{children}</div>
    </div>
);

const PrimaryButton = ({ children, onClick, className = '', disabled = false, type = 'button' }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
    >
        {children}
    </button>
);

// Main Page Components

const Header = ({ setActivePage, onLogout, userType, unreadCount }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <a href="#" onClick={() => setActivePage('dashboard')} className="flex items-center">
                            <Leaf className="h-8 w-8 text-green-600" />
                            <span className="ml-2 text-2xl font-bold text-gray-800 dark:text-white">FarmWise</span>
                        </a>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {['Dashboard', 'Pest Detection', 'Soil Analysis', 'Irrigation', 'Weather'].map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    onClick={() => setActivePage(item.toLowerCase().replace(' ', ''))}
                                    className="text-gray-600 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-gray-700 hover:text-green-700 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center">
                         <button onClick={() => setActivePage('notifications')} className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-2">
                            <Bell className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        <span className="hidden sm:inline text-sm font-medium text-gray-600 dark:text-gray-300 mr-4 capitalize">{userType} View</span>
                        <button onClick={onLogout} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" title="Logout">
                            <LogOut className="h-6 w-6 text-red-500" />
                        </button>
                        <div className="md:hidden ml-2">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!isMenuOpen ? 'block' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={isMenuOpen ? 'block' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {['Dashboard', 'Pest Detection', 'Soil Analysis', 'Irrigation', 'Weather', 'Notifications'].map((item) => (
                            <a
                                key={item}
                                href="#"
                                onClick={() => {
                                    setActivePage(item.toLowerCase().replace(' ', ''));
                                    setIsMenuOpen(false);
                                }}
                                className="text-gray-600 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};

const Dashboard = ({ setActivePage, notifications }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Weather Card */}
        <Card title="Current Weather" icon={<WeatherIcon condition={mockWeatherData.current.condition} size={28} />} className="lg:col-span-1 md:col-span-2">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-5xl font-bold text-gray-800 dark:text-white">{mockWeatherData.current.temp}°C</p>
                    <p className="text-gray-500 dark:text-gray-400">{mockWeatherData.current.condition}</p>
                </div>
                <div className="text-right">
                    <div className="flex items-center text-gray-600 dark:text-gray-300"><Droplets size={16} className="mr-2" /> Humidity: {mockWeatherData.current.humidity}%</div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300"><Wind size={16} className="mr-2" /> Wind: {mockWeatherData.current.wind} km/h</div>
                </div>
            </div>
            <div className="mt-6">
                <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">5-Day Forecast</h4>
                <div className="flex justify-between">
                    {mockWeatherData.forecast.map(day => (
                        <div key={day.day} className="text-center">
                            <p className="font-medium text-gray-600 dark:text-gray-300">{day.day}</p>
                            <WeatherIcon condition={day.condition} size={28} />
                            <p className="text-sm text-gray-800 dark:text-white">{day.temp}°C</p>
                        </div>
                    ))}
                </div>
            </div>
        </Card>

        {/* Key Actions */}
        <div className="space-y-6 md:col-span-2 lg:col-span-1">
             <Card title="Quick Actions" icon={<BarChart2 size={28} className="text-blue-500" />}>
                <div className="flex flex-col space-y-4">
                    <PrimaryButton onClick={() => setActivePage('pestdetection')}>
                        <Bug className="inline mr-2" /> Detect Pests
                    </PrimaryButton>
                     <PrimaryButton onClick={() => setActivePage('soilanalysis')} className="bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500">
                        <Leaf className="inline mr-2" /> Analyze Soil
                    </PrimaryButton>
                </div>
            </Card>
        </div>
        
        {/* Notifications */}
        <Card title="Recent Alerts" icon={<Bell size={28} className="text-red-500" />} className="md:col-span-2 lg:col-span-1">
            <div className="space-y-4">
                {notifications.slice(0, 3).map(n => (
                    <div key={n.id} className="flex items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex-shrink-0 pt-1">
                            {n.type === 'weather' && <CloudRain className="text-blue-500" />}
                            {n.type === 'soil' && <Droplets className="text-orange-500" />}
                            {n.type === 'pest' && <Bug className="text-red-500" />}
                            {n.type === 'irrigation' && <Clock className="text-purple-500" />}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{n.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{n.time}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => setActivePage('notifications')} className="mt-4 text-sm font-semibold text-green-600 hover:underline w-full text-right">View All</button>
        </Card>

        {/* NEW: Farmer's Instructions Card */}
        <Card title="Today's Key Instructions" icon={<CheckCircle size={28} className="text-green-500" />} className="md:col-span-2">
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-lg text-gray-800 dark:text-white">Soil Management</h4>
                    <p className="text-gray-600 dark:text-gray-300">{mockDetailedWeatherData.advisory.soil_condition}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-lg text-gray-800 dark:text-white">Crop & Pest Control</h4>
                    <p className="text-gray-600 dark:text-gray-300">{mockDetailedWeatherData.advisory.surrounding_condition}</p>
                </div>
            </div>
        </Card>

        {/* Soil Moisture */}
        <Card title="Soil Health Overview" icon={<Leaf size={28} className="text-yellow-600" />} className="md:col-span-1">
            <p className="text-gray-600 dark:text-gray-300 mb-4">Current soil moisture level is optimal.</p>
            <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${mockSoilData.moisture}%` }}></div>
            </div>
            <p className="text-right mt-1 text-sm font-semibold">{mockSoilData.moisture}%</p>
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <p>Next irrigation recommended in: <span className="font-bold text-green-600">48 hours</span></p>
            </div>
        </Card>

        {/* Pest Alert */}
        <Card title="Pest Activity" icon={<Bug size={28} className="text-red-500" />} className="md:col-span-1">
            <p className="text-gray-600 dark:text-gray-300">No critical pest threats detected in the last 24 hours.</p>
            <div className="mt-4 flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/50 rounded-lg">
                <p className="text-green-800 dark:text-green-200 font-medium">Fields are currently clear.</p>
                <div className="w-12 h-12 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center">
                    <Leaf className="text-green-600 dark:text-green-300" />
                </div>
            </div>
        </Card>
    </div>
);

const PestDetection = () => {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState('');

    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(URL.createObjectURL(file));
            setFileName(file.name);
            setResult(null); // Reset previous result
        }
    };

    const handleDetect = () => {
        if (!image) return;
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setResult(mockPestDetectionResult);
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card title="Upload Crop Image" icon={<Bug size={28} className="text-red-500" />}>
                <div className="flex flex-col items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        {image ? (
                            <img src={image} alt="Uploaded crop" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Cloud className="w-10 h-10 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, or JPEG (MAX. 5MB)</p>
                            </div>
                        )}
                        <input id="dropzone-file" type="file" className="hidden" onChange={handleImageUpload} accept="image/png, image/jpeg, image/jpg" />
                    </label>
                    {fileName && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{fileName}</p>}
                    <PrimaryButton onClick={handleDetect} className="mt-6 w-full" disabled={!image || isLoading}>
                        {isLoading ? 'Analyzing...' : 'Detect Pests'}
                    </PrimaryButton>
                </div>
            </Card>

            <Card title="Detection Result" icon={<BarChart2 size={28} className="text-blue-500" />}>
                {isLoading && (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
                    </div>
                )}
                {!isLoading && result && (
                    <div>
                        <img src={result.imageUrl} alt="Detection result" className="rounded-lg mb-4 w-full h-auto object-cover" />
                        <div className={`p-4 rounded-lg ${result.detected ? 'bg-red-100 dark:bg-red-900/50' : 'bg-green-100 dark:bg-green-900/50'}`}>
                            <h4 className="text-lg font-bold">{result.detected ? `Pest Detected: ${result.pest}` : 'No Pests Detected'}</h4>
                            <p>Confidence: <span className="font-semibold">{result.confidence}%</span></p>
                        </div>
                        <div className="mt-4">
                            <h5 className="font-semibold">Recommendation:</h5>
                            <p className="text-gray-600 dark:text-gray-300">{result.recommendation}</p>
                        </div>
                    </div>
                )}
                {!isLoading && !result && (
                    <div className="text-center text-gray-500 dark:text-gray-400 h-full flex items-center justify-center">
                        <p>Upload an image and click "Detect Pests" to see the analysis.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

const SoilAnalysis = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card title="Soil Moisture" icon={<Droplets size={28} className="text-blue-500" />}>
                 <div className="text-center">
                    <div className="relative inline-flex items-center justify-center overflow-hidden rounded-full">
                         <svg className="w-32 h-32">
                            <circle className="text-gray-200 dark:text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="50" cx="64" cy="64"/>
                            <circle className="text-blue-500" strokeWidth="10" strokeDasharray="314" strokeDashoffset={314 - (314 * mockSoilData.moisture) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="50" cx="64" cy="64"/>
                        </svg>
                        <span className="absolute text-2xl font-bold text-gray-800 dark:text-white">{mockSoilData.moisture}%</span>
                    </div>
                    <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">Optimal</p>
                 </div>
            </Card>
             <Card title="Nutrient Levels" icon={<Leaf size={28} className="text-green-500" />}>
                <div className="space-y-4">
                    {['Nitrogen', 'Phosphorus', 'Potassium'].map(nutrient => (
                        <div key={nutrient}>
                            <div className="flex justify-between mb-1">
                                <span className="text-base font-medium text-gray-700 dark:text-gray-300">{nutrient}</span>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{mockSoilData[nutrient.toLowerCase()]} kg/ha</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className="bg-green-600 h-2.5 rounded-full" style={{width: `${(mockSoilData[nutrient.toLowerCase()] / 100) * 100}%`}}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
             <Card title="Soil pH" icon={<BarChart2 size={28} className="text-purple-500" />}>
                <div className="text-center">
                    <p className="text-6xl font-bold text-purple-600">{mockSoilData.ph}</p>
                    <p className="mt-2 text-lg font-semibold text-gray-700 dark:text-gray-200">Slightly Acidic</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">(Ideal range: 6.5 - 7.0)</p>
                </div>
            </Card>
        </div>
    )
};

const Irrigation = () => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Low': return 'text-red-500';
            case 'Optimal': return 'text-green-500';
            case 'High': return 'text-blue-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card title="System Status" icon={<Thermometer size={28} className="text-green-500" />} className="md:col-span-2 lg:col-span-3">
                <div className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/50 rounded-lg">
                    <h4 className="text-2xl font-bold text-green-800 dark:text-green-200">{mockIrrigationData.status}</h4>
                </div>
            </Card>

            <Card title="Soil Moisture by Plot" icon={<Droplets size={28} className="text-blue-500" />} className="lg:col-span-2">
                <div className="space-y-4">
                    {mockIrrigationData.plots.map(plot => (
                        <div key={plot.id}>
                            <div className="flex justify-between mb-1">
                                <span className="text-base font-medium text-gray-700 dark:text-gray-300">Plot {plot.id} ({plot.name})</span>
                                <span className={`text-sm font-bold ${getStatusColor(plot.status)}`}>{plot.moisture}% - {plot.status}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                                <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${plot.moisture}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Water Usage" icon={<TrendingUp size={28} className="text-indigo-500" />}>
                <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                        <span className="font-semibold text-gray-600 dark:text-gray-300">Today:</span>
                        <span className="text-xl font-bold text-gray-800 dark:text-white">{mockIrrigationData.waterUsage.today.toLocaleString()} L</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                        <span className="font-semibold text-gray-600 dark:text-gray-300">This Week:</span>
                        <span className="text-xl font-bold text-gray-800 dark:text-white">{mockIrrigationData.waterUsage.week.toLocaleString()} L</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                        <span className="font-semibold text-gray-600 dark:text-gray-300">This Month:</span>
                        <span className="text-xl font-bold text-gray-800 dark:text-white">{mockIrrigationData.waterUsage.month.toLocaleString()} L</span>
                    </div>
                </div>
            </Card>
            
            <Card title="Upcoming Schedule" icon={<Clock size={28} className="text-orange-500" />} className="md:col-span-2 lg:col-span-3">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b dark:border-gray-700">
                                <th className="p-2">Plot</th>
                                <th className="p-2">Time</th>
                                <th className="p-2">Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockIrrigationData.schedule.map(item => (
                                <tr key={item.plot} className="border-b dark:border-gray-700">
                                    <td className="p-2 font-semibold">Plot {item.plot}</td>
                                    <td className="p-2">{item.time}</td>
                                    <td className="p-2">{item.duration}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

const Weather = () => {
    const data = mockDetailedWeatherData;
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{data.location}</h2>
                <p className="text-gray-500 dark:text-gray-400">As of {new Date().toLocaleTimeString()}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card title="Current Conditions" icon={<Thermometer size={28} className="text-blue-500" />}>
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-6xl font-bold">{data.current.temp}°C</p>
                            <p className="font-semibold text-lg">{data.current.condition}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Feels like {data.current.feels_like}°C</p>
                        </div>
                        <WeatherIcon condition={data.current.condition} size={64} />
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center"><Droplets size={16} className="mr-2 text-blue-400"/>Humidity: {data.current.humidity}%</div>
                        <div className="flex items-center"><Wind size={16} className="mr-2 text-gray-400"/>Wind: {data.current.wind} km/h</div>
                        <div className="flex items-center"><Sun size={16} className="mr-2 text-yellow-400"/>UV Index: {data.current.uv_index}</div>
                        <div className="flex items-center"><Sunrise size={16} className="mr-2 text-orange-400"/>Sunrise: {data.current.sunrise}</div>
                        <div className="flex items-center"><Sunset size={16} className="mr-2 text-indigo-400"/>Sunset: {data.current.sunset}</div>
                    </div>
                </Card>

                <Card title="Hourly Forecast" icon={<Clock size={28} className="text-purple-500" />}>
                     <div className="flex justify-between">
                        {data.hourly.map(hour => (
                            <div key={hour.time} className="text-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                <p className="font-medium text-gray-600 dark:text-gray-300">{hour.time}</p>
                                <WeatherIcon condition={hour.condition} size={32} />
                                <p className="text-lg font-bold">{hour.temp}°C</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
            
            <Card title={data.advisory.title} icon={<Leaf size={28} className="text-green-600" />} className="md:col-span-2">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-lg">Soil Condition</h4>
                        <p className="text-gray-600 dark:text-gray-300">{data.advisory.soil_condition}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg">Surrounding Environment</h4>
                        <p className="text-gray-600 dark:text-gray-300">{data.advisory.surrounding_condition}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

const NotificationsPage = ({ notifications, onMarkAsRead, onClearAll }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'weather': return <CloudRain className="text-blue-500" />;
            case 'soil': return <Droplets className="text-orange-500" />;
            case 'pest': return <Bug className="text-red-500" />;
            case 'irrigation': return <Clock className="text-purple-500" />;
            default: return <Bell className="text-gray-500" />;
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Notifications</h2>
                <button onClick={onClearAll} className="text-sm font-semibold text-red-500 hover:underline">Clear All</button>
            </div>
            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map(n => (
                        <div key={n.id} className={`p-4 rounded-lg flex items-start gap-4 transition-colors ${n.read ? 'bg-gray-50 dark:bg-gray-800' : 'bg-green-50 dark:bg-green-900/50'}`}>
                            <div className="flex-shrink-0 pt-1">{getIcon(n.type)}</div>
                            <div className="flex-grow">
                                <h4 className="font-semibold">{n.title}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{n.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                            </div>
                            {!n.read && (
                                <button onClick={() => onMarkAsRead(n.id)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" title="Mark as read">
                                    <CheckCircle size={20} className="text-green-600" />
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-10">You have no new notifications.</p>
                )}
            </div>
        </div>
    );
};


const AuthPage = ({ onLogin, onRegister, users }) => {
    const [isLoginView, setIsLoginView] = useState(true);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Leaf className="h-12 w-12 text-green-600 mx-auto" />
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">Welcome to FarmWise</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {isLoginView ? 'Please sign in to continue' : 'Create an account to get started'}
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                    {isLoginView ? (
                        <LoginPage onLogin={onLogin} onSwitchToRegister={() => setIsLoginView(false)} users={users} />
                    ) : (
                        <RegisterPage onRegister={onRegister} onSwitchToLogin={() => setIsLoginView(true)} users={users} />
                    )}
                </div>
            </div>
        </div>
    );
};

const LoginPage = ({ onLogin, onSwitchToRegister, users }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            onLogin(user.role);
        } else {
            setError('Invalid email or password.');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">Email</label>
                <input
                    className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">Password</label>
                <input
                    className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 dark:text-gray-200 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    id="password" type="password" placeholder="******************" value={password} onChange={(e) => setPassword(e.target.value)} required
                />
            </div>
            <div className="flex flex-col items-center justify-center">
                <PrimaryButton type="submit" className="w-full">Sign In</PrimaryButton>
                <button type="button" onClick={onSwitchToRegister} className="mt-4 text-sm text-green-600 hover:underline">
                    Don't have an account? Register
                </button>
            </div>
        </form>
    );
};

const RegisterPage = ({ onRegister, onSwitchToLogin, users }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();
        const userExists = users.some(user => user.email === email);
        if (userExists) {
            setError('This email is already registered. Please log in.');
        } else {
            setError('');
            onRegister({ name, email, password, role });
        }
    };

    return (
        <form onSubmit={handleRegister}>
            {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="name">Full Name</label>
                <input
                    className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email-register">Email</label>
                <input
                    className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    id="email-register" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password-register">Password</label>
                <input
                    className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 dark:text-gray-200 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    id="password-register" type="password" placeholder="******************" value={password} onChange={(e) => setPassword(e.target.value)} required
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">I am a...</label>
                <div className="flex rounded-lg shadow-sm">
                    <button type="button" onClick={() => setRole('user')} className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 transition-colors ${role === 'user' ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-700'}`}>
                        <User className="mr-2" size={16} /> User
                    </button>
                    <button type="button" onClick={() => setRole('admin')} className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-r-lg border border-gray-300 dark:border-gray-600 transition-colors ${role === 'admin' ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-700'}`}>
                        <Shield className="mr-2" size={16} /> Admin
                    </button>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center">
                <PrimaryButton type="submit" className="w-full">Register</PrimaryButton>
                <button type="button" onClick={onSwitchToLogin} className="mt-4 text-sm text-green-600 hover:underline">
                    Already have an account? Login
                </button>
            </div>
        </form>
    );
};


// Main App Component
export default function App() {
    const [activePage, setActivePage] = useState('dashboard');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null); // null or user object { role: 'user'/'admin' }
    const [users, setUsers] = useState([{'email': 'user@example.com', 'role': 'user', 'password': 'password123'}]); // Mock user database
    const [notifications, setNotifications] = useState(initialNotifications);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const handleLogin = (role) => {
        setLoggedInUser({ role });
    };

    const handleRegister = (newUser) => {
        setUsers([...users, newUser]);
        setLoggedInUser({ role: newUser.role });
    };

    const handleLogout = () => {
        setLoggedInUser(null);
        setActivePage('dashboard');
    };
    
    const handleMarkAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const handleClearAll = () => {
        setNotifications([]);
    };

    if (!loggedInUser) {
        return (
             <div className={`${isDarkMode ? 'dark' : ''}`}>
                <AuthPage onLogin={handleLogin} onRegister={handleRegister} users={users} />
             </div>
        )
    }

    const renderPage = () => {
        switch (activePage) {
            case 'dashboard':
                return <Dashboard setActivePage={setActivePage} notifications={notifications} />;
            case 'pestdetection':
                return <PestDetection />;
            case 'soilanalysis':
                return <SoilAnalysis />;
            case 'irrigation':
                 return <Irrigation />;
            case 'weather':
                 return <Weather />;
            case 'notifications':
                return <NotificationsPage notifications={notifications} onMarkAsRead={handleMarkAsRead} onClearAll={handleClearAll} />;
            default:
                return <Dashboard setActivePage={setActivePage} notifications={notifications} />;
        }
    };

    return (
        <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-500`}>
            <Header setActivePage={setActivePage} onLogout={handleLogout} userType={loggedInUser.role} unreadCount={unreadCount} />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderPage()}
            </main>
            <footer className="bg-white dark:bg-gray-800 mt-8 py-6">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400">
                    <p>&copy; {new Date().getFullYear()} FarmWise. Helping farmers grow smarter.</p>
                     <button onClick={() => setIsDarkMode(!isDarkMode)} className="mt-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700">
                        {isDarkMode ? <Sun /> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>}
                    </button>
                </div>
            </footer>
        </div>
    );
}
