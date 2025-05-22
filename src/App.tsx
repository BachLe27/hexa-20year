import './App.css';
import AvatarGenerate from './components/AvatarGenerate';
import Landing from './components/Landing';
import Videos from './components/Videos';
import './style.scss';

import { useState } from 'react';
function App() {

  const [step, setStep] = useState(0);

  return (
    <>
      <div className="gradient-bg" style={{ height: step === 2 ? '100%' : '100vh', width: step === 2 ? '100%' : '100vw' }}>
        {step === 0 && (
          <Landing nextStep={() => setStep(1)} />
        )}
        {step === 1 && (
          <Videos nextStep={() => setStep(2)} />
        )}
        {step === 2 && (
          <AvatarGenerate />
        )}
        <svg className='svg' xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <div className="gradients-container">
          {
            step !== 1 && <>
              <div className="g1"></div>
              <div className="g2"></div>
              <div className="g3"></div>
              <div className="g4"></div>
              <div className="g5"></div>
            </>
          }
        </div>
      </div>
    </>
  )
}

export default App
