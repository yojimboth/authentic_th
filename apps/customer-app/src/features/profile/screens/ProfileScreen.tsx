import React from 'react';
import { View, ScrollView, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { useProfile } from '../hooks/useProfile';
import { logout } from '../../../utils/mockAuth';
import { currentConfig } from '../../../config/whiteLabelConfig';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { state, refresh } = useProfile();

  if (state.status === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={currentConfig.theme.primaryColor} />
      </View>
    );
  }

  const user = state.status === 'success' ? state.data : null;

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load profile</Text>
        <TouchableOpacity style={styles.button} onPress={() => refresh()}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: `https://i.pravatar.cc/150?u=${user.id}` }} 
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.fullName}>{user.fullName}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>

        {/* Loyalty Card */}
        <View style={styles.loyaltyCard}>
          <View style={styles.loyaltyHeader}>
            <Text style={styles.loyaltyLabel}>Current Points</Text>
            <Text style={styles.loyaltyIcon}>★</Text>
          </View>
          <Text style={styles.loyaltyPoints}>{user.loyaltyPoints}</Text>
          <Text style={styles.loyaltyLabel}>points</Text>
        </View>

        {/* Account Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Account Details</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('EditProfile')} 
              style={styles.editButton}
            >
              <Text style={[styles.editButtonText, { color: currentConfig.theme.primaryColor }]}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{user.phone || 'Not set'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Primary Address</Text>
            <Text style={styles.infoValue}>{user.primaryAddress || 'Not set'}</Text>
          </View>
        </View>

        {/* Order History Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order History</Text>
          <TouchableOpacity 
            style={styles.orderHistoryButton}
            onPress={() => navigation.navigate('Orders' as never)}
          >
            <Text style={styles.orderHistoryText}>View All Orders</Text>
            <Text style={styles.orderHistoryArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Data</Text>
          
          <TouchableOpacity 
            style={styles.privacyButton}
            onPress={() => Alert.alert(
              'Request Data Redaction',
              'Your data redaction request will be processed within 30 days.',
              [{ text: 'OK' }]
            )}
          >
            <Text style={styles.privacyButtonText}>Request Data Redaction</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.privacyButton}
            onPress={() => Alert.alert(
              'Request Data Export',
              'Your data export will be available for download within 48 hours.',
              [{ text: 'OK' }]
            )}
          >
            <Text style={styles.privacyButtonText}>Request Data Export</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.button, styles.logoutButton]}
          onPress={async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'MainTabs' }],
            });
          }} 
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#71717A',
    textAlign: 'center',
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E4E4E7',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  fullName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#18181B',
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#71717A',
    fontFamily: 'Inter-Regular',
  },
  loyaltyCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#FED7AA',
    alignItems: 'center',
  },
  loyaltyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  loyaltyLabel: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '500',
    marginRight: 8,
  },
  loyaltyIcon: {
    fontSize: 16,
    color: '#D97706',
  },
  loyaltyPoints: {
    fontSize: 48,
    fontWeight: '700',
    color: '#D97706',
    fontFamily: 'Poppins-Bold',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#18181B',
    fontFamily: 'Poppins-Bold',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F4F4F5',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoRow: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  infoLabel: {
    fontSize: 12,
    color: '#71717A',
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: '#18181B',
    fontWeight: '500',
  },
  orderHistoryButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderHistoryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#18181B',
  },
  orderHistoryArrow: {
    fontSize: 18,
    color: '#71717A',
  },
  privacyButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  privacyButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#18181B',
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutButton: {
    backgroundColor: '#DC2626',
    marginTop: 32,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
