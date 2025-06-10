import React, { useState } from 'react';
import { View, Text } from 'react-native';

const ScanQRCode = () => {
  const [scannedData, setScannedData] = useState<string | null>(null);

  const onSuccess = (e: any) => {
    setScannedData(e.data);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      
    </View>
  );
};

export default ScanQRCode;
