import { useState } from 'react';
import RegistrationWizard from './pages/Onboarding/RegistrationWizard';
import Login from './pages/Auth/Login';

function App() {
  const [view, setView] = useState('onboarding');

  return (
    <div>
      {/* Dev View Switcher */}
      <div className="fixed bottom-5 right-5 z-50 bg-white rounded-full shadow-lg border border-[#e5e7eb] p-1 flex gap-1">
        <button onClick={() => setView('login')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${view === 'login' ? 'bg-brand-primary text-white' : 'text-[#667085] hover:bg-[#f3f4f6]'
            }`}>Login</button>
        <button onClick={() => setView('onboarding')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${view === 'onboarding' ? 'bg-brand-primary text-white' : 'text-[#667085] hover:bg-[#f3f4f6]'
            }`}>Onboarding</button>
      </div>

      {view === 'onboarding' ? <RegistrationWizard /> : <Login />}
    </div>
  );
}

export default App;
