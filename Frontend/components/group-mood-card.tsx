// components/GroupMoodCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { MoodName, moodConfig } from '../assets/moodAssets';


export type GroupMember = {
  id: string;
  name: string;
  mood: MoodName;
};

export type Group = {
  id: string;
  name: string;
  members: GroupMember[];
};

type Props = {
  group: Group;
  maxVisible?: number;
  onPressOverflow?: (group: Group) => void;
};

export default function GroupMoodCard({
  group,
  maxVisible,
  onPressOverflow,
}: Props) {
  const members = group.members;
  const hasLimit = typeof maxVisible === 'number';

  const showOverflow = hasLimit && members.length > maxVisible!;
  const visibleMembers = showOverflow ? members.slice(0, maxVisible! - 1) : members;
  const extraCount = showOverflow ? members.length - (maxVisible! - 1) : 0;

  return (
    <View style={styles.card}>
    {/*Header */}
      <View style={styles.headerRow}>
        <Text style={styles.groupName}>{group.name}</Text>
        <Text style={styles.countText}>{members.length} miembros</Text>
      </View>

      {/*Grid */}
      <View style={styles.grid}>
        {visibleMembers.map(member => {
          const config = moodConfig[member.mood];

          return (
            <View key={member.id} style={styles.memberItem}>
              <View style={
                [styles.moodCircle, { backgroundColor: config.color }]}>
                <Image
                  source={config.image}
                  style={styles.moodImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.memberName} numberOfLines={1}>
                {member.name}
              </Text>
            </View>
          );
        })}

        {showOverflow && extraCount > 0 && onPressOverflow && (
          <Pressable
            style={styles.memberItem}
            onPress={() => onPressOverflow(group)}
          >
            <View style={[styles.moodCircle, styles.extraCircle]}>
              <Text style={styles.extraText}>{`+${extraCount}`}</Text>
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
  },
  countText: {
    fontSize: 12,
    color: '#777',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  memberItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 12,
  },
  moodCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  moodImage: {
    width: 26,
    height: 26,
  },
  memberName: {
    fontSize: 10,
    textAlign: 'center',
  },
  extraCircle: {
    backgroundColor: '#E0E0E0',
  },
  extraText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
