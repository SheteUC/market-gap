'use client';

import { Badge } from 'antd';
import { useWebsocket } from '@/context/WebsocketContext';

export function WebsocketStatus() {
  const { isConnected, lastMessage } = useWebsocket();

  return (
    <Badge 
      status={isConnected ? 'success' : 'error'} 
      text={isConnected ? 'Connected' : 'Disconnected'}
      title={lastMessage ? `Last update: ${lastMessage}` : undefined}
    />
  );
}