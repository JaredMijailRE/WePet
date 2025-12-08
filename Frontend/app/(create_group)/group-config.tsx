import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function GroupConfig() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Group image */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhkOV-KmYRz86MKDCbRH8RGo4_iEWx0JWfiw&s" }}
          style={styles.groupImage}
        />
      </View>

      {/* Group name + edit */}
      <View style={styles.groupNameRow}>
        <Text style={styles.groupName}>Group 1</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => {}}>
            <Ionicons name="pencil" size={18} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="paw-outline" size={20} color="#FFF" />
          <Text style={styles.actionText}>Change Pet</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity style={styles.smallAction}>
            <Ionicons name="person-add-outline" size={18} color="#FFF" />
            <Text style={styles.smallActionText}>Add</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.smallAction}>
            <Ionicons name="share-social-outline" size={18} color="#FFF" />
            <Text style={styles.smallActionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Members list */}
      <View style={styles.membersSection}>
        {[
          { name: "Alex (You)", role: "Administrator", img: "https://i.pravatar.cc/300?img=3" },
          { name: "Raul", role: "Member", img: "https://i.pravatar.cc/300?img=12" },
          { name: "Sam", role: "Member", img: "https://i.pravatar.cc/300?img=18" },
        ].map((member, index) => (
          <View key={index} style={styles.memberRow}>
            <Image source={{ uri: member.img }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>{member.role}</Text>
            </View>
            <MaterialIcons name="more-vert" size={20} color="#444" />
          </View>
        ))}
      </View>

      <TouchableOpacity>
        <Text style={styles.viewAll}>View all</Text>
      </TouchableOpacity>

      {/* Exit Group */}
      <TouchableOpacity style={styles.exitButton}>
        <Ionicons name="exit-outline" size={18} color="#FFF" />
        <Text style={styles.exitText}>Exit Group</Text>
      </TouchableOpacity>

      {/* Delete Group */}
      <TouchableOpacity style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={18} color="#FFF" />
        <Text style={styles.deleteText}>Delete Group</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    backgroundColor: "#FFFFFF",
  },

  backButton: {
    marginTop: 40,
    marginBottom: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  imageWrapper: {
    alignItems: "center",
    marginBottom: 16,
  },

  groupImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },

  groupNameRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  groupName: {
    fontSize: 24,
    fontWeight: "600",
  },

  actionsRow: {
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  actionButton: {
    backgroundColor: "#333",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },

  actionText: {
    color: "#FFF",
    fontSize: 14,
  },

  smallAction: {
    backgroundColor: "#333",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 6,
  },

  smallActionText: {
    color: "#FFF",
    fontSize: 14,
  },

  membersSection: {
    marginTop: 30,
    gap: 12,
  },

  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },

  memberName: {
    fontSize: 15,
    fontWeight: "500",
  },

  memberRole: {
    fontSize: 13,
    color: "#777",
  },

  viewAll: {
    marginTop: 6,
    alignSelf: "flex-start",
    color: "#4C3BFF",
    fontWeight: "500",
  },

  exitButton: {
    backgroundColor: "#333",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 40,
    gap: 8,
  },

  exitText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },

  editButton: {
  marginLeft: 6,
  padding: 4, 
    },


  deleteButton: {
    backgroundColor: "#D32F2F",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 14,
    marginBottom: 40,
    gap: 8,
  },

  deleteText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },
});
