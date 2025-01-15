'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface LogEntry {
  timestamp: string;
  type: 'request' | 'response' | 'error' | 'form' | 'info';
  message: string;
  details?: any;
}

const getLogColor = (type: LogEntry['type']) => {
  switch (type) {
    case 'request':
      return 'text-blue-500';
    case 'response':
      return 'text-green-500';
    case 'error':
      return 'text-red-500';
    case 'form':
      return 'text-purple-500';
    case 'info':
      return 'text-gray-500';
    default:
      return 'text-gray-700';
  }
};

export function DebugConsole() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [filter, setFilter] = useState<LogEntry['type'] | 'all'>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Function to add log entries
  const addLog = (type: LogEntry['type'], message: string, details?: any) => {
    const newLog: LogEntry = {
      timestamp: new Date().toISOString(),
      type,
      message,
      details,
    };
    setLogs(prev => [...prev, newLog]);
  };

  // Attach to window for global access
  useEffect(() => {
    (window as any).debugConsole = {
      log: (message: string, details?: any) => addLog('info', message, details),
      request: (message: string, details?: any) => addLog('request', message, details),
      response: (message: string, details?: any) => addLog('response', message, details),
      error: (message: string, details?: any) => addLog('error', message, details),
      form: (message: string, details?: any) => addLog('form', message, details),
    };

    return () => {
      delete (window as any).debugConsole;
    };
  }, []);

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (scrollRef.current && isVisible) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isVisible]);

  const filteredLogs = logs.filter(
    log => filter === 'all' || log.type === filter
  );

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          className="bg-white shadow-lg"
        >
          Show Debug Console
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-white rounded-lg shadow-xl border z-50 flex flex-col">
      <div className="p-2 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as LogEntry['type'] | 'all')}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="request">Requests</option>
            <option value="response">Responses</option>
            <option value="error">Errors</option>
            <option value="form">Forms</option>
            <option value="info">Info</option>
          </select>
          <Button
            onClick={() => setLogs([])}
            variant="outline"
            size="sm"
          >
            Clear
          </Button>
        </div>
        <Button
          onClick={() => setIsVisible(false)}
          variant="outline"
          size="sm"
        >
          Close
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2" ref={scrollRef}>
          {filteredLogs.map((log, index) => (
            <div key={index} className="text-sm">
              <div className="flex items-start space-x-2">
                <span className="text-gray-400 font-mono text-xs">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className={`font-medium ${getLogColor(log.type)}`}>
                  {log.message}
                </span>
              </div>
              {log.details && (
                <pre className="mt-1 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
