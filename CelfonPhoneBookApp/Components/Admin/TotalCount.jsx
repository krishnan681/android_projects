import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import ArrowForwardIcon from "react-native-vector-icons/MaterialIcons";
import { Agenda } from "react-native-calendars";

export default function TotalCount() {
  const [teamData, setTeamData] = useState([]);
  const [agendaEvents, setAgendaEvents] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch team data from the backend
  const fetchTeamData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://signpostphonebook.in/try_totalcount_for_new_database.php"
      );
      const data = await response.json();
      setTeamData(data);
    } catch (error) {
      console.error("Error fetching team data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch agenda data for a specific member
  const fetchAgendaData = async (memberId) => {
    try {
      const response = await fetch(
        `https://signpostphonebook.in/fetch_events_for_new_database.php?id=${memberId}`
      );
      if (!response.ok) throw new Error("Failed to fetch calendar data.");
      const data = await response.json();

      // Convert data into Agenda's format
      const agendaData = {};
      data.forEach((entry) => {
        if (!agendaData[entry.date]) {
          agendaData[entry.date] = [];
        }
        agendaData[entry.date].push({
          name: `Count: ${entry.count}`,
          description: `Details for ${entry.date}`,
        });
      });
      setAgendaEvents(agendaData);
    } catch (error) {
      console.error("Error fetching agenda data:", error);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const openCalendarModal = (member) => {
    setSelectedMember(member);
    fetchAgendaData(member.id);
    setIsModalOpen(true);
  };

  const closeCalendarModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
    setAgendaEvents({});
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Team</Text>

      {/* Table Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, { flex: 1 }]}>ID</Text>
        <Text style={[styles.headerCell, { flex: 3 }]}>Name</Text>
        <Text style={[styles.headerCell, { flex: 2 }]}>Total Count</Text>
        <Text style={[styles.headerCell, { flex: 2 }]}>Actions</Text>
      </View>

      <FlatList
        data={teamData}
        keyExtractor={(item, index) => (item?.id ? item.id.toString() : index.toString())}

        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={[styles.cell, { flex: 1 }]}>{item.userid}</Text>
            <Text style={[styles.cell, { flex: 3 }]}>{item.name || "No Name"}</Text>
            <Text style={[styles.cell, { flex: 2 }]}>{item.total_count || "N/A"}</Text>
            <TouchableOpacity onPress={() => openCalendarModal(item)}>
              <ArrowForwardIcon name="arrow-forward" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Agenda Modal */}
      <Modal visible={isModalOpen} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedMember?.name}'s Entries</Text>
            <Agenda
              items={agendaEvents}
              renderItem={(item, firstItemInDay) => (
                <View style={styles.agendaItem}>
                  <Text style={styles.agendaItemText}>{item.name}</Text>
                </View>
              )}
              renderEmptyData={() => (
                <View style={styles.emptyAgenda}>
                  <Text>No events for this day.</Text>
                </View>
              )}
              theme={{
                selectedDayBackgroundColor: "blue",
                todayTextColor: "red",
                dotColor: "blue",
                agendaTodayColor: "red",
              }}
            />
            <TouchableOpacity onPress={closeCalendarModal} style={styles.button}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FAFAFA",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
    marginBottom: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: "600",
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1, // adds shadow for Android
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cell: {
    flex: 1,
    fontSize: 15,
    color: "#444",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
    color: "#222",
  },
  agendaItem: {
    backgroundColor: "#F3F6FA",
    padding: 14,
    marginVertical: 6,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  agendaItemText: {
    fontSize: 16,
    color: "#333",
  },
  emptyAgenda: {
    alignItems: "center",
    padding: 30,
  },
  button: {
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
