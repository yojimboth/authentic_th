import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types';

type NotificationPreferencesScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'NotificationPreferences'>;
};

interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const defaultPreferences: NotificationPreference[] = [
  {
    id: 'orderUpdates',
    title: 'Order Updates',
    description: 'Receive notifications when order status changes',
    enabled: true,
  },
  {
    id: 'newOrders',
    title: 'New Orders',
    description: 'Get notified when a new order is placed',
    enabled: true,
  },
  {
    id: 'paymentUpdates',
    title: 'Payment Updates',
    description: 'Receive notifications about payment status',
    enabled: true,
  },
  {
    id: 'promotions',
    title: 'Promotions & Offers',
    description: 'Get alerts about special deals and promotions',
    enabled: false,
  },
  {
    id: 'systemNotifications',
    title: 'System Notifications',
    description: 'Receive important system alerts and maintenance notices',
    enabled: true,
  },
];

export const NotificationPreferencesScreen = ({
  navigation,
}: NotificationPreferencesScreenProps) => {
  const [preferences, setPreferences] =
    useState<NotificationPreference[]>(defaultPreferences);

  const handleToggle = (id: string) => {
    setPreferences((prev) =>
      prev.map((pref) =>
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref,
      ),
    );
  };

  const handleSave = () => {
    // Mock save - in real app, this would call an API
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerSpacer} />
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Preferences Card */}
        <View style={styles.card}>
          {preferences.map((pref) => (
            <View key={pref.id} style={styles.preferenceRow}>
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceTitle}>{pref.title}</Text>
                <Text style={styles.preferenceDescription}>
                  {pref.description}
                </Text>
              </View>
              <Switch
                value={pref.enabled}
                onValueChange={() => handleToggle(pref.id)}
                trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
                thumbColor={pref.enabled ? '#4F46E5' : '#F3F4F6'}
              />
            </View>
          ))}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About Notifications</Text>
          <Text style={styles.infoText}>
            You can customize which notifications you receive. Some system
            notifications cannot be disabled as they are critical for app
            functionality.
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
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
    fontFamily: 'Inter-SemiBold',
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
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  preferenceInfo: {
    flex: 1,
    marginRight: 12,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
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