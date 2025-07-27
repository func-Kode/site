'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Minimize2, Maximize2, Terminal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'log' | 'warn' | 'error';
  message: string;
  args: unknown[];
}

interface DebugConsoleProps {
  isVisible: boolean;
  onToggle: () => void;
}

export function DebugConsole({ isVisible, onToggle }: DebugConsoleProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const originalConsole = useRef<{
    log: typeof console.log;
    warn: typeof console.warn;
    error: typeof console.error;
  } | null>(null);

  const scrollToBottom = useCallback(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const addLog = useCallback((type: LogEntry['type'], args: unknown[]) => {
    const logEntry: LogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      type,
      message: args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '),
      args
    };

    setLogs(prev => [...prev, logEntry]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  useEffect(() => {
    if (!originalConsole.current) {
      originalConsole.current = {
        log: console.log,
        warn: console.warn,
        error: console.error
      };
    }

    const { log, warn, error } = originalConsole.current;

    // Override console methods
    console.log = (...args: unknown[]) => {
      log(...args);
      addLog('log', args);
    };

    console.warn = (...args: unknown[]) => {
      warn(...args);
      addLog('warn', args);
    };

    console.error = (...args: unknown[]) => {
      error(...args);
      addLog('error', args);
    };

    return () => {
      // Restore original console methods
      if (originalConsole.current) {
        console.log = originalConsole.current.log;
        console.warn = originalConsole.current.warn;
        console.error = originalConsole.current.error;
      }
    };
  }, [addLog]);

  useEffect(() => {
    if (!isMinimized) {
      scrollToBottom();
    }
  }, [logs, isMinimized, scrollToBottom]);

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  const getLogTypeColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'warn':
        return 'text-yellow-400';
      default:
        return 'text-green-400';
    }
  };

  const getLogTypeIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'error':
        return '❌';
      case 'warn':
        return '⚠️';
      default:
        return '📝';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div 
        className={`bg-black/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl transition-all duration-300 ${
          isMinimized ? 'w-80 h-12' : 'w-96 h-96'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-white">Debug Console</span>
            {logs.length > 0 && (
              <span className="text-xs text-gray-400">({logs.length})</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearLogs}
              className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
            >
              {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="h-80 overflow-y-auto p-3 font-mono text-xs">
            {logs.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                No console output yet...
              </div>
            ) : (
              <div className="space-y-1">
                {logs.map((log) => (
                  <div key={log.id} className="flex gap-2 items-start">
                    <span className="text-gray-500 text-[10px] mt-0.5 shrink-0">
                      {formatTimestamp(log.timestamp)}
                    </span>
                    <span className="shrink-0 mt-0.5">
                      {getLogTypeIcon(log.type)}
                    </span>
                    <span className={`${getLogTypeColor(log.type)} break-all`}>
                      {log.message}
                    </span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
