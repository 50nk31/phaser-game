import { useRef, useState, useCallback } from 'react';
import { PhaserGame } from './PhaserGame';
import Greeting from './game/REACTscene/Greeting';
import CustomScene from './game/REACTscene/CustomScene';
import HistoryPanel from './components/GameUI/HistoryPanel';
import SettingsPanel from './components/GameUI/SettingsPanel';

function App() {
    const phaserRef = useRef();
    const [currentScene, setCurrentScene] = useState('greeting'); 
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({ textSpeed: 25, fontSize: 18 });

    const [isAuto, setIsAuto] = useState(false);
    const [isSkip, setIsSkip] = useState(false);

    const addToHistory = useCallback((entry) => {
        setHistory(prev => {
            if (prev.length > 0 && prev[prev.length - 1].text === entry.text) {
                return prev;
            }
            return [...prev, entry];
        });
    }, []);

    const removeFromHistory = useCallback(() => {
        setHistory(prev => prev.slice(0, -1));
    }, []);

    const onAction = useCallback((type) => {
        if (type === 'auto') { setIsSkip(false); setIsAuto(prev => !prev); }
        if (type === 'skip') { setIsAuto(false); setIsSkip(prev => !prev); }
        if (type === 'history') setShowHistory(true);
        if (type === 'settings') setShowSettings(true);
        if (type === 'back') { 
            setIsAuto(false); 
            setIsSkip(false);
            if (currentScene === 'customization') setCurrentScene('greeting');
        }
    }, [currentScene]);

    const handleSceneComplete = useCallback(() => {
        setIsAuto(false);
        setIsSkip(false);
        if (currentScene === 'greeting') setCurrentScene('customization');
        else if (currentScene === 'customization') setCurrentScene('map');
    }, [currentScene]);

    return (
        <div style={containerStyle}>
            {/* Основной контейнер игры без ограничений по ширине */}
            <div style={gameWrapperStyle}>
                
                {/* Слой Phaser (фон) */}
                <PhaserGame ref={phaserRef} />
                
                {/* Слой React (Интерфейс) */}
                <div style={uiOverlayStyle}>
                    {currentScene === 'greeting' && (
                        <Greeting 
                            settings={settings}
                            isAuto={isAuto}
                            isSkip={isSkip}
                            onAction={onAction}
                            addToHistory={addToHistory}
                            removeFromHistory={removeFromHistory}
                            onComplete={handleSceneComplete}
                        />
                    )}

                    {currentScene === 'customization' && (
                        <CustomScene 
                            settings={settings} 
                            setSettings={setSettings}
                            isAuto={isAuto} 
                            isSkip={isSkip} 
                            onAction={onAction}
                            addToHistory={addToHistory}      
                            removeFromHistory={removeFromHistory} 
                            onComplete={handleSceneComplete} 
                        />
                    )}

                    {showHistory && <HistoryPanel history={history} onClose={() => setShowHistory(false)} />}
                    {showSettings && <SettingsPanel settings={settings} setSettings={setSettings} onClose={() => setShowSettings(false)} />}
                </div>
            </div>
        </div>
    );
}

// --- СТИЛИ ДЛЯ НАСТОЯЩЕГО FULLSCREEN ---

const containerStyle = { 
    width: '100vw', 
    height: '100vh', 
    backgroundColor: '#000', 
    margin: 0, 
    padding: 0, 
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
};

const gameWrapperStyle = { 
    width: '100%', 
    height: '100%', 
    position: 'relative',
    overflow: 'hidden'
    // МЫ УДАЛИЛИ maxWidth: '500px', теперь игра на весь экран
};

const uiOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none', // Чтобы клики пролетали сквозь пустые области к Phaser
    zIndex: 10
};

// Важно: внутри Greeting и CustomScene все элементы, на которые нужно кликать, 
// должны иметь style={{ pointerEvents: 'auto' }}

export default App;