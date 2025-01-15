import { useState, useEffect } from 'react';

interface LogEntry {
  timestamp: string;
  operation: string;
  details: any;
  type: 'log' | 'request' | 'response';
}

export const DebugConsole: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Override console.log to capture database-related logs
    const originalLog = console.log;
    const originalFetch = window.fetch;

    console.log = (...args) => {
      originalLog.apply(console, args);
      
      // Only capture database-related logs
      if (typeof args[0] === 'string' && 
          (args[0].includes('[Database API]') || 
           args[0].includes('[Database Operations]'))) {
        const newLog: LogEntry = {
          timestamp: new Date().toISOString(),
          operation: args[0],
          details: args.slice(1),
          type: 'log'
        };
        setLogs(prev => [...prev, newLog]);
      }
    };

    // Override fetch to capture API requests and responses
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = input.toString();
      if (url.includes('/api/database')) {
        // Log request
        const newRequestLog: LogEntry = {
          timestamp: new Date().toISOString(),
          operation: `[API Request] ${init?.method || 'GET'} ${url}`,
          details: { body: init?.body ? JSON.parse(init.body as string) : undefined },
          type: 'request'
        };
        setLogs(prev => [...prev, newRequestLog]);

        try {
          const response = await originalFetch(input, init);
          const clone = response.clone();
          const responseData = await clone.json();

          // Log response
          const newResponseLog: LogEntry = {
            timestamp: new Date().toISOString(),
            operation: `[API Response] ${init?.method || 'GET'} ${url}`,
            details: { status: response.status, data: responseData },
            type: 'response'
          };
          setLogs(prev => [...prev, newResponseLog]);

          return response;
        } catch (error) {
          // Log error
          const newErrorLog: LogEntry = {
            timestamp: new Date().toISOString(),
            operation: `[API Error] ${init?.method || 'GET'} ${url}`,
            details: { error },
            type: 'response'
          };
          setLogs(prev => [...prev, newErrorLog]);
          throw error;
        }
      }
      return originalFetch(input, init);
    };

    // Restore original functions on cleanup
    return () => {
      console.log = originalLog;
      window.fetch = originalFetch;
    };
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg"
      >
        Show Debug Console
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden flex flex-col">
      <div className="flex justify-between items-center p-2 bg-gray-100 border-b">
        <h3 className="font-medium">Debug Console</h3>
        <div className="space-x-2">
          <button
            onClick={() => setLogs([])}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Clear
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Close
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 bg-gray-50 font-mono text-sm">
        {logs.length === 0 ? (
          <div className="text-gray-500 text-center mt-4">No logs yet</div>
        ) : (
          logs.map((log, index) => (
            <div 
              key={index} 
              className={`mb-2 pb-2 border-b border-gray-200 ${
                log.type === 'request' ? 'text-blue-600' :
                log.type === 'response' ? 'text-green-600' :
                'text-gray-600'
              }`}
            >
              <div className="text-xs text-gray-500">
                {new Date(log.timestamp).toLocaleTimeString()}
              </div>
              <div>{log.operation}</div>
              <pre className="text-xs text-gray-700 mt-1 whitespace-pre-wrap">
                {JSON.stringify(log.details, null, 2)}
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
