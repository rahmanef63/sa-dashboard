export const logDebug = (operation: string, details: any) => {
  // Use window debug console if available
  if (typeof window !== 'undefined' && (window as any).debugConsole?.log) {
    (window as any).debugConsole.log(`[Database Management] ${operation}`, details);
  }
  console.log(`[Database Management] ${operation}:`, JSON.stringify(details, null, 2));
};
