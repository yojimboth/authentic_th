import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types';
import { useAuthStore } from '../../../store/authStore';
import { useProfile } from '../hooks/useProfile';

type ProfileScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'MainTabs'>;
};

const settingsItems = [
  { title: 'Notification Preferences', key: 'NotificationPreferences' },
  { title: 'Printer Configuration', key: 'PrinterConfiguration' },
  { title: 'Help & Support', key: 'HelpSupport' },
];

export const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const { user, logout } = useAuthStore();
  const { updateProfile } = useProfile();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          // Auth state change triggers RootNavigator re-render
          // When isAuthenticated becomes false, Root Stack shows Login screen
        },
      },
    ]);
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>Profile</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Account Details Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Details</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{user.fullName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
            {user.phone && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone:</Text>
                <Text style={styles.infoValue}>{user.phone}</Text>
              </View>
            )}
            {user.primaryAddress && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Address:</Text>
                <Text style={[styles.infoValue, styles.infoValueMultiline]}>
                  {user.primaryAddress}
                </Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Role:</Text>
              <Text style={[styles.infoValue, styles.capitalize]}>
                {user.role}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tenant:</Text>
              <Text style={styles.infoValue}>Siam Authentic</Text>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Settings</Text>
          {settingsItems.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.settingRow}
              activeOpacity={0.7}
              onPress={() => {
                if (item.key === 'NotificationPreferences') {
                  navigation.navigate('NotificationPreferences');
                } else if (item.key === 'PrinterConfiguration') {
                  navigation.navigate('PrinterConfiguration');
                } else if (item.key === 'HelpSupport') {
                  navigation.navigate('HelpSupport');
                }
                // Other settings can be implemented later
              }}
            >
              <Text style={styles.settingText}>{item.title}</Text>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
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
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editButtonText: {
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
    marginBottom: 12,
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
  infoContainer: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    width: 60,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Inter-Medium',
    flex: 1,
  },
  infoValueMultiline: {
    flexWrap: 'wrap',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#374151',
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  settingArrow: {
    fontSize: 16,
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
  logoutContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  bottomSpacer: {
    height: 16,
  },
});