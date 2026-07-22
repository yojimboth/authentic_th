import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MenuItem } from '../types';
import { formatCurrency } from '../../../utils/formatCurrency';

interface MenuItemCardProps {
  item: MenuItem;
  onEdit?: () => void;
  onToggle?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export const MenuItemCard = ({ item, onEdit, onToggle, onDelete, showActions = true }: MenuItemCardProps) => {
  const isAvailable = item.isAvailable;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: isAvailable ? '#D1FAE5' : '#FFE4E6' },
        ]}>
          <Text style={[
            styles.statusText,
            { color: isAvailable ? '#065F46' : '#991B1B' },
          ]}>
            {isAvailable ? 'Available' : 'Unavailable'}
          </Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <Text style={styles.price}>{formatCurrency(item.price)}</Text>
        {item.preparationTime && (
          <Text style={styles.prepTime}>• {item.preparationTime} min prep</Text>
        )}
      </View>

      {showActions && (
        <View style={styles.actionsRow}>
          {onEdit && (
            <TouchableOpacity
              onPress={onEdit}
              style={[styles.actionButton, styles.editButton]}
              activeOpacity={0.8}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
          {onToggle && (
            <TouchableOpacity
              onPress={onToggle}
              style={[
                styles.actionButton,
                isAvailable ? styles.unavailableButton : styles.availableButton,
              ]}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.toggleButtonText,
                { color: isAvailable ? '#991B1B' : '#065F46' },
                isAvailable && styles.textRed,
                !isAvailable && styles.textGreen,
              ]} numberOfLines={1}>
                {isAvailable ? 'Unavailable' : 'Available'}
              </Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              onPress={onDelete}
              style={[styles.actionButton, styles.deleteButton]}
              activeOpacity={0.8}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  prepTime: {
    fontSize: 13,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
    marginLeft: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    fontFamily: 'Inter-Medium',
  },
  availableButton: {
    backgroundColor: '#D1FAE5',
  },
  unavailableButton: {
    backgroundColor: '#FFE4E6',
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  textRed: {
    color: '#991B1B',
  },
  textGreen: {
    color: '#065F46',
  },
  deleteButton: {
    backgroundColor: '#FFE4E6',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#991B1B',
    fontFamily: 'Inter-Medium',
  },
});