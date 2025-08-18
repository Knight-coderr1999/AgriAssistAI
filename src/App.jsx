
import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Sun, Cloud, CloudRain, Wind, Droplets, Bug, Leaf, BarChart2, Bell, TrendingUp, Clock, Thermometer, User, Shield, LogOut, Mail, Lock, UserPlus, Sunrise, Sunset, CheckCircle, XCircle, Moon, MessageSquare, Send, Mic, UserCheck, Sparkles, MessageCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Mock Data (replace with API calls)
const mockWeatherData = {
    current: { temp: 32, condition: 'Sunny', humidity: 65, wind: 15 },
    forecast: [
        { day: 'Mon', temp: 33, condition: 'Sunny' }, { day: 'Tue', temp: 34, condition: 'Sunny' },
        { day: 'Wed', temp: 31, condition: 'Cloudy' }, { day: 'Thu', temp: 29, condition: 'Rainy' },
        { day: 'Fri', temp: 32, condition: 'Sunny' },
    ],
};

const mockDetailedWeatherData = {
    location: 'Prayagraj, Uttar Pradesh',
    current: { temp: 29, feels_like: 36, condition: 'Partly Cloudy', humidity: 85, wind: 5, uv_index: 'High', sunrise: '5:45 AM', sunset: '6:50 PM' },
    hourly: [
        { time: '12 PM', temp: 31, condition: 'Partly Cloudy' }, { time: '2 PM', temp: 32, condition: 'Thunderstorm Possible' },
        { time: '4 PM', temp: 30, condition: 'Rainy' }, { time: '6 PM', temp: 29, condition: 'Cloudy' },
        { time: '8 PM', temp: 28, condition: 'Cloudy' },
    ],
    advisory: {
        title: "Farmer's Advisory for Today",
        soil_condition: "High humidity and expected rain will keep soil moisture levels high. Avoid over-irrigation. Be vigilant for signs of fungal diseases like root rot due to waterlogged conditions.",
        surrounding_condition: "The warm and humid environment is ideal for pest proliferation, especially for aphids and whiteflies. Monitor crops closely and prepare for preventative spraying if necessary. Weeds will also grow rapidly; consider timely removal."
    }
};

const mockSoilData = { moisture: 45, nitrogen: 78, phosphorus: 45, potassium: 60, ph: 6.8 };

const mockSoilAnalysisResult = { 
    imageUrl: 'https://placehold.co/600x400/8B4513/FFFFFF?text=Soil+Sample',
    analysis: {
        soilType: 'Sandy Loam',
        moisture: '45% (Optimal)',
        ph: 6.8,
        nitrogen: '78 kg/ha (Sufficient)',
        phosphorus: '45 kg/ha (Slightly Low)',
        potassium: '60 kg/ha (Sufficient)'
    },
    recommendation: 'Your soil is in good overall health. Consider adding a phosphorus-rich fertilizer like bone meal or rock phosphate to Plot B before the next planting season to improve nutrient balance.'
};

const mockIrrigationAnalysisResult = {
    imageUrl: 'https://placehold.co/600x400/228B22/FFFFFF?text=Field+Image',
    analysis: {
        estimatedMoisture: '38% (Low)',
        cropStatus: 'Minor wilting detected on lower leaves.',
        weatherForecast: 'No rain expected in the next 48 hours.'
    },
    recommendation: 'Immediate irrigation is recommended for this plot. Apply 2-3 cm of water using drip irrigation to minimize evaporation. Water early in the morning for best results.'
};


const mockPestDetectionResult = { detected: true, pest: 'Aphids', confidence: 92, recommendation: 'Consider introducing ladybugs or using neem oil spray. Monitor plants closely for the next 5-7 days.', imageUrl: 'https://placehold.co/600x400/a8e063/4a4a4a?text=Detected+Aphids+on+Leaf' };
const initialNotifications = [
    { id: 1, title: 'Heavy Rain Warning', message: 'Thunderstorms and heavy rain expected in the next 3 hours. Secure equipment and check drainage.', type: 'weather', time: '15m ago', read: false },
    { id: 2, title: 'Soil Moisture Alert', message: 'Soil moisture in Plot A is critically low. Immediate irrigation is required.', type: 'soil', time: '2h ago', read: false },
    { id: 3, title: 'Pest Activity Detected', message: 'Aphids detected in the north field. Consider preventative measures.', type: 'pest', time: '1d ago', read: true },
];
const mockSoilMoistureHistory = [
    { name: '7d ago', moisture: 65 }, { name: '6d ago', moisture: 62 },
    { name: '5d ago', moisture: 60 }, { name: '4d ago', moisture: 55 },
    { name: '3d ago', moisture: 52 }, { name: '2d ago', moisture: 48 },
    { name: 'Yesterday', moisture: 46 }, { name: 'Today', moisture: 45 },
];


// Helper Components
const WeatherIcon = ({ condition, size = 24 }) => {
    switch (condition.toLowerCase()) {
        case 'sunny': return <Sun className="text-yellow-400" size={size} />;
        case 'cloudy': return <Cloud className="text-gray-400" size={size} />;
        case 'rainy': return <CloudRain className="text-blue-400" size={size} />;
        case 'partly cloudy': return <Cloud className="text-yellow-400" size={size} />;
        case 'thunderstorm possible': return <CloudRain className="text-gray-500" size={size} />;
        default: return <Sun className="text-yellow-400" size={size} />;
    }
};
const Card = ({ title, icon, children, className = '' }) => (
    <div className={`bg-white/60 dark:bg-gray-800/50 rounded-2xl shadow-lg p-6 flex flex-col backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 ${className}`}>
        {title && (
            <div className="flex items-center mb-4">
                {icon}
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white ml-3">{title}</h3>
            </div>
        )}
        <div className="flex-grow">{children}</div>
    </div>
);
const PrimaryButton = ({ children, onClick, className = '', disabled = false, type = 'button' }) => (
    <button type={type} onClick={onClick} disabled={disabled} className={`bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}>
        {children}
    </button>
);

// Main Page Components
const Header = ({ setActivePage, onLogout, user, unreadCount, isDarkMode, onToggleDarkMode }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navItems = ['Dashboard', 'Pest Detection', 'Soil Analysis', 'Irrigation', 'Weather'];

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
                            {navItems.map((item) => (
                                <a key={item} href="#" onClick={() => setActivePage(item.toLowerCase().replace(' ', ''))} className="text-gray-600 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-gray-700 hover:text-green-700 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button onClick={onToggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-2">
                            {isDarkMode ? <Sun className="h-6 w-6 text-yellow-400" /> : <Moon className="h-6 w-6 text-gray-600" />}
                        </button>
                        <button onClick={() => setActivePage('notifications')} className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-2">
                            <Bell className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                            {unreadCount > 0 && <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">{unreadCount}</span>}
                        </button>
                        <div className="hidden sm:flex items-center">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mr-2">Hi, {user.name.split(' ')[0]}</span>
                            <button onClick={onLogout} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" title="Logout">
                                <LogOut className="h-6 w-6 text-red-500" />
                            </button>
                        </div>
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
                        {navItems.map((item) => (
                            <a key={item} href="#" onClick={() => { setActivePage(item.toLowerCase().replace(' ', '')); setIsMenuOpen(false); }} className="text-gray-600 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};

const Dashboard = ({ setActivePage, notifications, user }) => {
    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl p-8 shadow-xl">
                <h2 className="text-3xl font-bold">Welcome back, {user.name.split(' ')[0]}!</h2>
                <p className="mt-2 text-green-100">Here's your farm's overview for today. Let's make it a productive day.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card title="Today's Key Instructions" icon={<CheckCircle size={24} className="text-green-500" />}>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="bg-yellow-100 dark:bg-yellow-900/50 p-2 rounded-full"><Leaf size={20} className="text-yellow-600"/></div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 dark:text-white">Soil Management</h4>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">{mockDetailedWeatherData.advisory.soil_condition}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-full"><Bug size={20} className="text-red-600"/></div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 dark:text-white">Crop & Pest Control</h4>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">{mockDetailedWeatherData.advisory.surrounding_condition}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card title="Soil Moisture Trend (Last 7 Days)" icon={<TrendingUp size={24} className="text-blue-500" />}>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={mockSoilMoistureHistory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128, 128, 128, 0.2)" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} unit="%"/>
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #ddd', borderRadius: '0.5rem' }} />
                                    <Line type="monotone" dataKey="moisture" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
                <div className="space-y-8">
                    <Card title="Current Weather" icon={<WeatherIcon condition={mockWeatherData.current.condition} size={24} />}>
                        <div className="text-center">
                            <WeatherIcon condition={mockWeatherData.current.condition} size={64} />
                            <p className="text-5xl font-bold mt-2">{mockWeatherData.current.temp}°C</p>
                            <p className="text-gray-500 dark:text-gray-400">{mockWeatherData.current.condition}</p>
                            <div className="flex justify-around mt-4 text-sm">
                                <span className="flex items-center"><Droplets size={16} className="mr-1"/>{mockWeatherData.current.humidity}%</span>
                                <span className="flex items-center"><Wind size={16} className="mr-1"/>{mockWeatherData.current.wind} km/h</span>
                            </div>
                        </div>
                    </Card>
                    <Card title="Recent Alerts" icon={<Bell size={24} className="text-red-500" />}>
                        <div className="space-y-3">
                            {notifications.filter(n => !n.read).slice(0, 3).map(n => (
                                <div key={n.id} className="flex items-center gap-3">
                                    <div className="flex-shrink-0 p-2 bg-red-100 dark:bg-red-900/50 rounded-full">
                                        {n.type === 'weather' && <CloudRain size={16} className="text-red-500" />}
                                        {n.type === 'soil' && <Droplets size={16} className="text-red-500" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">{n.title}</p>
                                        <p className="text-xs text-gray-500">{n.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <PrimaryButton onClick={() => setActivePage('notifications')} className="w-full mt-4 text-sm py-2">View All Alerts</PrimaryButton>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const FloatingChatbot = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ sender: 'ai', text: `Hi ${user.name.split(' ')[0]}, how can I help?` }]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const newMessages = [...messages, { sender: 'user', text: input }];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [...prev, { sender: 'ai', text: "Analyzing your query..." }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-transform transform hover:scale-110 z-50"
            >
                {isOpen ? <XCircle size={32} /> : <MessageCircle size={32} />}
            </button>
            {isOpen && (
                <div className="fixed bottom-24 right-8 w-96 h-[60vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col z-50">
                    <div className="p-4 border-b dark:border-gray-700">
                        <h3 className="font-bold text-lg">AI Assistant</h3>
                    </div>
                    <div className="flex-grow p-4 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-end gap-2 my-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender !== 'user' && <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-green-500"><Leaf className="text-white h-5 w-5" /></div>}
                                <div className={`px-3 py-2 rounded-xl max-w-xs ${msg.sender === 'user' ? 'bg-green-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 rounded-bl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex items-end gap-2 my-2 justify-start">
                                <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-green-500"><Leaf className="text-white h-5 w-5" /></div>
                                <div className="px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-700">
                                    <div className="flex items-center gap-1">
                                        <span className="h-2 w-2 bg-green-500 rounded-full animate-bounce"></span>
                                        <span className="h-2 w-2 bg-green-500 rounded-full animate-bounce delay-75"></span>
                                        <span className="h-2 w-2 bg-green-500 rounded-full animate-bounce delay-150"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                         <div ref={chatEndRef} />
                    </div>
                    <div className="p-4 border-t dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Ask me anything..."
                            />
                            <button onClick={handleSend} className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700">
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};


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
            setResult(null); 
        }
    };

    const handleDetect = () => {
        if (!image) return;
        setIsLoading(true);
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
                {isLoading && ( <div className="flex items-center justify-center h-full"> <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div> </div> )}
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
                {!isLoading && !result && ( <div className="text-center text-gray-500 dark:text-gray-400 h-full flex items-center justify-center"> <p>Upload an image and click "Detect Pests" to see the analysis.</p> </div> )}
            </Card>
        </div>
    );
};

const SoilAnalysis = () => {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState('');

    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(URL.createObjectURL(file));
            setFileName(file.name);
            setResult(null); 
        }
    };

    const handleAnalyze = () => {
        if (!image) return;
        setIsLoading(true);
        setTimeout(() => {
            setResult(mockSoilAnalysisResult);
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card title="Upload Soil Image" icon={<Leaf size={28} className="text-yellow-600" />}>
                <div className="flex flex-col items-center justify-center w-full">
                    <label htmlFor="soil-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600">
                        {image ? (
                            <img src={image} alt="Uploaded soil" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Cloud className="w-10 h-10 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            </div>
                        )}
                        <input id="soil-file" type="file" className="hidden" onChange={handleImageUpload} accept="image/png, image/jpeg, image/jpg" />
                    </label>
                    {fileName && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{fileName}</p>}
                    <PrimaryButton onClick={handleAnalyze} className="mt-6 w-full" disabled={!image || isLoading}>
                        {isLoading ? 'Analyzing...' : 'Analyze Soil Image'}
                    </PrimaryButton>
                </div>
            </Card>
            <Card title="Soil Analysis Result" icon={<BarChart2 size={28} className="text-blue-500" />}>
                {isLoading && ( <div className="flex items-center justify-center h-full"> <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div> </div> )}
                {!isLoading && result && (
                    <div>
                        <img src={result.imageUrl} alt="Soil analysis result" className="rounded-lg mb-4 w-full h-auto object-cover" />
                        <div className="space-y-2 text-sm">
                            {Object.entries(result.analysis).map(([key, value]) => (
                                <div key={key} className="flex justify-between border-b pb-1 dark:border-gray-700">
                                    <span className="font-semibold capitalize text-gray-600 dark:text-gray-300">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                    <span className="text-gray-800 dark:text-white">{value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <h5 className="font-semibold">Recommendation:</h5>
                            <p className="text-gray-600 dark:text-gray-300">{result.recommendation}</p>
                        </div>
                    </div>
                )}
                {!isLoading && !result && ( <div className="text-center text-gray-500 dark:text-gray-400 h-full flex items-center justify-center"> <p>Upload a soil image to get a detailed analysis.</p> </div> )}
            </Card>
        </div>
    );
};

const Irrigation = () => {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState('');

    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(URL.createObjectURL(file));
            setFileName(file.name);
            setResult(null); 
        }
    };

    const handleAnalyze = () => {
        if (!image) return;
        setIsLoading(true);
        setTimeout(() => {
            setResult(mockIrrigationAnalysisResult);
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card title="Upload Field Image" icon={<Droplets size={28} className="text-blue-500" />}>
                <div className="flex flex-col items-center justify-center w-full">
                    <label htmlFor="irrigation-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600">
                        {image ? (
                            <img src={image} alt="Uploaded field" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Cloud className="w-10 h-10 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            </div>
                        )}
                        <input id="irrigation-file" type="file" className="hidden" onChange={handleImageUpload} accept="image/png, image/jpeg, image/jpg" />
                    </label>
                    {fileName && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{fileName}</p>}
                    <PrimaryButton onClick={handleAnalyze} className="mt-6 w-full" disabled={!image || isLoading}>
                        {isLoading ? 'Analyzing...' : 'Analyze Irrigation Needs'}
                    </PrimaryButton>
                </div>
            </Card>
            <Card title="Irrigation Analysis" icon={<BarChart2 size={28} className="text-blue-500" />}>
                {isLoading && ( <div className="flex items-center justify-center h-full"> <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div> </div> )}
                {!isLoading && result && (
                    <div>
                        <img src={result.imageUrl} alt="Irrigation analysis result" className="rounded-lg mb-4 w-full h-auto object-cover" />
                        <div className="space-y-2 text-sm">
                            {Object.entries(result.analysis).map(([key, value]) => (
                                <div key={key} className="flex justify-between border-b pb-1 dark:border-gray-700">
                                    <span className="font-semibold capitalize text-gray-600 dark:text-gray-300">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                    <span className="text-gray-800 dark:text-white">{value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/50 rounded-lg">
                            <h5 className="font-semibold">Recommendation:</h5>
                            <p className="text-gray-600 dark:text-gray-300">{result.recommendation}</p>
                        </div>
                    </div>
                )}
                {!isLoading && !result && ( <div className="text-center text-gray-500 dark:text-gray-400 h-full flex items-center justify-center"> <p>Upload a field image to get an irrigation analysis.</p> </div> )}
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
            onLogin(user);
        } else {
            setError('Invalid email or password.');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">Email</label>
                <input className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">Password</label>
                <input className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
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
        if (users.some(user => user.email === email)) {
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
                <input className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email-register">Email</label>
                <input className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4" id="email-register" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password-register">Password</label>
                <input className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4" id="password-register" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">I am a...</label>
                <div className="flex rounded-lg shadow-sm">
                    <button type="button" onClick={() => setRole('user')} className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-l-lg border transition-colors ${role === 'user' ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-700'}`}> <User className="mr-2" size={16} /> User </button>
                    <button type="button" onClick={() => setRole('admin')} className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-r-lg border transition-colors ${role === 'admin' ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-700'}`}> <Shield className="mr-2" size={16} /> Admin </button>
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
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [notifications, setNotifications] = useState(initialNotifications);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const handleLogin = (user) => { setLoggedInUser(user); };
    const handleRegister = (newUser) => { setUsers([...users, newUser]); setLoggedInUser(newUser); };
    const handleLogout = () => { setLoggedInUser(null); setActivePage('dashboard'); };
    const handleMarkAsRead = (id) => { setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n)); };
    const handleClearAll = () => { setNotifications([]); };

    if (!loggedInUser) {
        return (
            <Suspense fallback="loading...">
                <div className={`${isDarkMode ? 'dark' : ''}`}>
                    <AuthPage onLogin={handleLogin} onRegister={handleRegister} users={users} />
                </div>
            </Suspense>
        )
    }

    const renderPage = () => {
        switch (activePage) {
            case 'dashboard': return <Dashboard setActivePage={setActivePage} notifications={notifications} user={loggedInUser} />;
            case 'pestdetection': return <PestDetection />;
            case 'soilanalysis': return <SoilAnalysis />;
            case 'irrigation': return <Irrigation />;
            case 'weather': return <Weather />;
            case 'notifications': return <NotificationsPage notifications={notifications} onMarkAsRead={handleMarkAsRead} onClearAll={handleClearAll} />;
            case 'aichat': return <AIChatPage user={loggedInUser} />;
            default: return <Dashboard setActivePage={setActivePage} notifications={notifications} user={loggedInUser} />;
        }
    };

    return (
        <Suspense fallback="loading...">
            <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-500`}>
                <Header setActivePage={setActivePage} onLogout={handleLogout} user={loggedInUser} unreadCount={unreadCount} isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {renderPage()}
                </main>
                {loggedInUser && <FloatingChatbot user={loggedInUser} />}
                <footer className="bg-white dark:bg-gray-800 mt-8 py-6">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400">
                        <p>&copy; {new Date().getFullYear()} FarmWise. Helping farmers grow smarter.</p>
                    </div>
                </footer>
            </div>
        </Suspense>
    );
}
