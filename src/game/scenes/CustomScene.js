import React, { useState } from 'react';
import NameInput from './NameInput';
import ClassSelector from './ClassSelector';
import SettingsPanel from './SettingsPanel';

const CustomScene = () => {
    // 1. Состояния (стейты)
    const [phase, setPhase] = useState('name'); // Текущий экран
    const [playerName, setPlayerName] = useState(""); // Имя игрока
    const [showSettings, setShowSettings] = useState(false); // Показ настроек
    const [settings, setSettings] = useState({ textSpeed: 30, fontSize: 18 }); // Сами настройки

    // 2. Обработчик ввода имени (когда юзер нажал "Далее")
    const handleNameSubmit = (name) => {
        console.log("Имя сохранено:", name);
        setPlayerName(name); // Записываем имя в память
        setPhase('class');   // Переключаем на выбор карточек
    };

    // 3. Обработчик выбора класса
    const handleClassSelect = (cls) => {
        console.log("Выбран класс:", cls);
    };

    return (
        <div style={mainContainer}>
            {/* КНОПКА НАСТРОЕК - zIndex 5000, чтобы была поверх карт */}
            <button 
                style={settingsBtn} 
                onClick={() => setShowSettings(true)}
            >
                ⚙️
            </button>

            {/* ЭКРАН 1: ВВОД ИМЕНИ */}
            {phase === 'name' && (
                <NameInput 
                    onNameSubmit={handleNameSubmit} 
                    defaultValue={playerName} 
                />
            )}

            {/* ЭКРАН 2: КАРТОЧКИ */}
            {phase === 'class' && (
                <ClassSelector onClassSelect={handleClassSelect} />
            )}

            {/* ОКНО НАСТРОЕК */}
            {showSettings && (
                <SettingsPanel 
                    settings={settings}
                    setSettings={setSettings}
                    onClose={() => setShowSettings(false)}
                    playerName={playerName} // ПЕРЕДАЕМ ИМЯ
                    onChangeName={() => {
                        setPhase('name'); // Возвращаем экран ввода имени
                        setShowSettings(false); // Закрываем настройки
                    }}
                />
            )}
        </div>
    );
};

// --- СТИЛИ (Твои рабочие стили) ---
const mainContainer = { 
    width: '100vw', 
    height: '100vh', 
    backgroundColor: '#000', 
    position: 'relative', 
    overflow: 'hidden' 
};

const settingsBtn = { 
    position: 'absolute', 
    top: '20px', 
    right: '20px', 
    zIndex: 5000, 
    background: 'none', 
    border: 'none', 
    fontSize: '30px', 
    cursor: 'pointer',
    color: 'white',
    textShadow: '0 0 10px rgba(0,0,0,0.5)'
};

export default CustomScene;