import { useRef, useEffect, useState } from 'react';
import { PhaserGame } from './PhaserGame';


function App() {
    const phaserRef = useRef();

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            margin: 0,
            padding: 0,
            overflow: 'hidden',
            backgroundColor: '#028af8'
        }}>
            <PhaserGame ref={phaserRef} />
        </div>
    );
}

export default App;
