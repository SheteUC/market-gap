'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WebsocketContextType {
  isConnected: boolean;
  completedPhases: string[];
  lastMessage: string | null;
}

const WebsocketContext = createContext<WebsocketContextType>({
  isConnected: false,
  completedPhases: [],
  lastMessage: null,
});

export const useWebsocket = () => useContext(WebsocketContext);

interface WebsocketProviderProps {
  children: ReactNode;
}

export function WebsocketProvider({ children }: WebsocketProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Simulate WebSocket connection
    const simulateConnection = () => {
      setIsConnected(true);
      
      // Simulate phase completions
      const phases = ['/industry', '/research', '/gaps'];
      phases.forEach((phase, index) => {
        setTimeout(() => {
          setCompletedPhases(prev => [...prev, phase]);
          setLastMessage(`Phase ${phase.slice(1)} completed`);
        }, (index + 1) * 3000);
      });
    };

    const timer = setTimeout(simulateConnection, 1000);
    
    return () => {
      clearTimeout(timer);
      setIsConnected(false);
    };
  }, []);

  return (
    <WebsocketContext.Provider value={{
      isConnected,
      completedPhases,
      lastMessage,
    }}>
      {children}
    </WebsocketContext.Provider>
  );
}