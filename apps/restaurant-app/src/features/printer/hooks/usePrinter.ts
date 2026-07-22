import { useState } from 'react';

export const usePrinter = () => {
  const [printerIp, setPrinterIp] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testPrinter = async () => {
    setIsTesting(true);
    setError(null);
    try {
      // Mock API call: POST /api/v1/printers/test
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsConnected(true);
      return { success: true, message: 'Test signal sent' };
    } catch (err: any) {
      const errorMessage =
        err?.message || 'Printer not responding. Check local power/network.';
      setError(errorMessage);
      setIsConnected(false);
      return { success: false, message: errorMessage };
    } finally {
      setIsTesting(false);
    }
  };

  const saveConfiguration = async () => {
    setIsSaving(true);
    setError(null);
    try {
      // Mock API call: PATCH /api/v1/tenants/{id}/config
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true, message: 'Printer configuration saved' };
    } catch (err: any) {
      setError(err?.message || 'Failed to save configuration');
      return { success: false, message: err?.message || 'Failed to save' };
    } finally {
      setIsSaving(false);
    }
  };

  const resetState = () => {
    setPrinterIp('');
    setIsConnected(false);
    setIsTesting(false);
    setIsSaving(false);
    setError(null);
  };

  return {
    printerIp,
    setPrinterIp,
    isConnected,
    isTesting,
    isSaving,
    error,
    testPrinter,
    saveConfiguration,
    resetState,
  };
};