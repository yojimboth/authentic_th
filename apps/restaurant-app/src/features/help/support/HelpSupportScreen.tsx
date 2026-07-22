import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types';

type HelpSupportScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'HelpSupport'>;
};

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: 'order',
    question: 'How do I update my order status?',
    answer:
      'Navigate to the Orders screen, select the order you want to update, and tap the appropriate status button (Accept, Mark Ready, Mark Complete).',
  },
  {
    id: 'printer',
    question: 'How do I configure the printer?',
    answer:
      'Go to Settings > Printer Configuration. Enter your local relay IP address and click "Send Test Print" to verify the connection.',
  },
  {
    id: 'notifications',
    question: 'How do I manage notifications?',
    answer:
      'Go to Settings > Notification Preferences. Toggle the switches to enable or disable specific notification types.',
  },
  {
    id: 'menu',
    question: 'How do I update my menu?',
    answer:
      'Navigate to the Menu screen. You can edit prices, toggle availability, and add new items. Changes are saved automatically.',
  },
];

export const HelpSupportScreen = ({
  navigation,
}: HelpSupportScreenProps) => {
  const handleContactEmail = () => {
    Linking.openURL('mailto:support@siamauthentic.com');
  };

  const handleContactPhone = () => {
    Linking.openURL('tel:+61000000000');
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
        {/* Contact Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Support</Text>
          <TouchableOpacity
            onPress={handleContactEmail}
            style={styles.contactRow}
          >
            <View style={styles.contactIcon}>
              <Text style={styles.contactIconText}>✉</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>support@siamauthentic.com</Text>
            </View>
            <Text style={styles.contactArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleContactPhone}
            style={styles.contactRow}
          >
            <View style={styles.contactIcon}>
              <Text style={styles.contactIconText}>📞</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>+61 000 000 000</Text>
            </View>
            <Text style={styles.contactArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Frequently Asked Questions</Text>
          {faqItems.map((item) => (
            <View key={item.id} style={styles.faqItem}>
              <Text style={styles.faqQuestion}>{item.question}</Text>
              <Text style={styles.faqAnswer}>{item.answer}</Text>
            </View>
          ))}
        </View>

        {/* About Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About</Text>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>App Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Build Number</Text>
            <Text style={styles.aboutValue}>100</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Tenant</Text>
            <Text style={styles.aboutValue}>Siam Authentic</Text>
          </View>
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
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactIconText: {
    fontSize: 18,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  contactArrow: {
    fontSize: 16,
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
  faqItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-Medium',
    marginBottom: 6,
  },
  faqAnswer: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  aboutLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  aboutValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Inter-Medium',
  },
  bottomSpacer: {
    height: 16,
  },
});