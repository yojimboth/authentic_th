import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput as RNTextInput,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types';
import { usePrinter } from '../hooks/usePrinter';

type PrinterConfigurationScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'PrinterConfiguration'>;
};

export const PrinterConfigurationScreen = ({
  navigation,
}: PrinterConfigurationScreenProps) => {
  const {
    printerIp,
    setPrinterIp,
    isConnected,
    isTesting,
    isSaving,
    error,
    testPrinter,
    saveConfiguration,
  } = usePrinter();

  const handleTestPrint = async () => {
    const result = await testPrinter();
    if (result.success) {
      // Mock success toast - in real app, would use a toast library
      console.log(result.message);
    }
  };

  const handleSave = async () => {
    const result = await saveConfiguration();
    if (result.success) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerSpacer} />
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Printer Status</Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor: isConnected
                    ? '#10B981'
                    : '#EF4444',
                },
              ]}
            />
            <Text style={styles.statusText}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Text>
          </View>
        </View>

        {/* IP Configuration Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Relay IP Address</Text>
          <View style={styles.inputContainer}>
            <RNTextInput
              style={styles.input}
              value={printerIp}
              onChangeText={setPrinterIp}
              placeholder="192.168.1.100"
              keyboardType="number-pad"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Actions Card */}
        <View style={styles.card}>
          <TouchableOpacity
            onPress={handleTestPrint}
            disabled={isTesting || isSaving}
            style={[
              styles.actionButton,
              styles.secondaryButton,
              (isTesting || isSaving) && styles.buttonDisabled,
            ]}
          >
            {isTesting ? (
              <ActivityIndicator color="#4F46E5" />
            ) : (
              <Text style={styles.secondaryButtonText}>Send Test Print</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSave}
            disabled={isTesting || isSaving}
            style={[
              styles.actionButton,
              styles.primaryButton,
              (isTesting || isSaving) && styles.buttonDisabled,
            ]}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Save Configuration</Text>
            )}
          </TouchableOpacity>

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How It Works</Text>
          <Text style={styles.infoText}>
            Enter the IP address of your local relay service. The relay bridges
            the cloud backend to your thermal printer on the local network.
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSpacer: {
    width: 64,
  },
  scrollContent: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Inter-Medium',
  },
  inputContainer: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Inter-Regular',
    minHeight: 44,
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
    fontFamily: 'Inter-SemiBold',
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    borderWidth: 0,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginTop: 12,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#DC2626',
    fontFamily: 'Inter-Regular',
  },
  infoCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginLeft: 16,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 16,
  },
});