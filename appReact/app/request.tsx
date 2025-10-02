import React, { useState } from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";
import { Button } from "@react-navigation/elements";
import NavBar from "../components/NavBar";
import DateSelector from "../components/selectDate";

export default function Request() {
  const [motif, setMotif] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleDateRangeSelect = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <NavBar />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Nouvelle Demande</Text>

        <DateSelector onDateRangeSelect={handleDateRangeSelect} />

        <Text>Motif :</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez le motif"
          value={motif}
          onChangeText={setMotif}
        />

        <Button
          onPress={() => {
            
          }}
        >
          Envoyer la demande
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
  },
  selectedDates: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    borderBottomColor: "#dee2e6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 35,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});
