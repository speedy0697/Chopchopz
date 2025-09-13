import React from 'react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M41.7,28.3c1.9-1.9,1.9-5,0-6.9L30.2,9.8c-1.9-1.9-5-1.9-6.9,0l-2,2c-1.9,1.9-1.9,5,0,6.9l4.4,4.4L18.8,30c-1-1-2.6-1-3.5,0l-3.3,3.3c-1,1-1,2.6,0,3.5l3.5,3.5c1,1,2.6,1,3.5,0l3.3-3.3c1-1,1-2.6,0-3.5L21.2,29l7.1-7.1l4.4,4.4c1.9,1.9,5,1.9,6.9,0L41.7,28.3z"/>
        <circle cx="16.5" cy="47.5" r="5.5"/>
        <circle cx="47.5" cy="16.5" r="5.5"/>
        <path d="M49,36.4l-3.3-3.3c-1-1-2.6-1-3.5,0L29,46.2l-4.4-4.4c-1.9-1.9-5-1.9-6.9,0l-2,2c-1.9,1.9-1.9,5,0,6.9l11.6,11.6c1.9,1.9,5,1.9,6.9,0l2-2c1.9-1.9,1.9-5,0-6.9L29,44.8l7.1-7.1c1,1,2.6,1,3.5,0l3.3-3.3C50,40.4,50,38.8,49,37.8L49,36.4z"/>
    </svg>
);
const AppleIcon: React.FC<{ className?: string }> = ({ className }) => ( <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M19.3,5.63c-1.2-1.46-2.9-2.35-4.78-2.35-1.8,0-3.53.8-4.75,2.14-1.2,1.33-2.25,3.13-2.25,5,0,2.15.9,4.2,2.1,5.6,1.2,1.4,2.82,2.23,4.6,2.23,1.05,0,2.1-.3,3.05-.8-.18.08-.38.13-.58.13-1.03,0-2-.4-2.73-1.08-.8-.78-1.28-1.83-1.28-2.98,0-.05,0-.1,0-.15,0-2.3,1.7-4.15,3.9-4.15h.1c.3,0,.58,0,.85.08,0-.2.03-.4.03-.6,0-1.93-.83-3.7-2.1-5Z M13.8,4c.9-.9,2.13-1.48,3.43-1.48,0,0,0,0,0,0,1.2,0,2.5.5,3.4,1.5-.9.6-1.5,1.5-1.5,2.6,0,1.03.6,1.95,1.48,2.55-.9.9-2.1,1.45-3.4,1.45-1.3,0-2.5-.58-3.4-1.53-1-1.08-1.5-2.5-1.5-3.9C12.3,6.2,12.8,5,13.8,4Z"/></svg>);
const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => ( <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M22,12c0-5.52-4.48-10-10-10S2,6.48,2,12c0,4.84,3.44,8.87,8,9.8V15H8v-3h2V9.5C10,7.57,11.57,6,13.5,6H16v3h-2c-.55,0-1,.45-1,1v2h3v3h-3v6.95c5.05-.5,9-4.76,9-9.95Z"/></svg>);


const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-black relative text-white font-sans">
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1621607512214-6c349036a137?q=80&w=1974&auto=format&fit=crop')"}}></div>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full w-full max-w-xs mx-auto">
            <div className="mb-4">
                <LogoIcon className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">ManeTracker</h1>
            <p className="text-zinc-400 mt-4 mb-8 text-lg">Welcome back</p>
            
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-center text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-zinc-500"
                    // In a real app, you would manage state for this input
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-center text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-zinc-500"
                     // In a real app, you would manage state for this input
                />
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-xl text-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 transition-opacity"
                >
                    Log In
                </button>
            </form>

            <a href="#" className="mt-6 text-sm text-zinc-400 hover:text-white">Forgot Password?</a>

            <div className="flex items-center gap-4 my-8">
                <button className="p-3 bg-zinc-800/80 border border-zinc-700 rounded-full hover:bg-zinc-700">
                    <FacebookIcon className="w-6 h-6"/>
                </button>
                 <button className="p-3 bg-zinc-800/80 border border-zinc-700 rounded-full hover:bg-zinc-700">
                    <AppleIcon className="w-6 h-6"/>
                </button>
            </div>

            <p className="text-zinc-400 text-sm">
                Don't have an account? <a href="#" className="font-semibold text-white hover:underline">Sign Up</a>
            </p>
        </div>
    </div>
  );
};

export default LoginScreen;
