import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

interface SingleDateSelectorProps {
  onDateSelect?: (date: Date) => void;
}

export default function SingleDateSelector({ onDateSelect }: SingleDateSelectorProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Générer les jours du mois actuel
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Obtenir le jour de la semaine (0-6, 0 = dimanche)
    let firstDayOfWeek = firstDay.getDay();
    // Convertir dimanche (0) en 7 pour notre calendrier commençant le lundi
    if (firstDayOfWeek === 0) firstDayOfWeek = 7;
    // Calculer le nombre de jours vides avant le premier jour (-1 car on commence par lundi)
    const emptyDaysAtStart = firstDayOfWeek - 1;

    const days = [];
    
    // Ajouter les jours vides au début
    for (let i = 0; i < emptyDaysAtStart; i++) {
      days.push(null);
    }
    
    // Ajouter tous les jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    // Calculer les jours vides à ajouter à la fin pour compléter la dernière semaine
    const totalDays = days.length;
    const remainingDays = 7 - (totalDays % 7);
    if (remainingDays < 7) {
      for (let i = 0; i < remainingDays; i++) {
        days.push(null);
      }
    }
    
    return days;
  };

  const handleDatePress = (date: Date) => {
    // Empêcher la sélection des dates passées et des weekends
    if (isPastDate(date)) {
      Alert.alert('Date invalide', 'Vous ne pouvez pas sélectionner une date dépassée.');
      return;
    }
    if (isWeekend(date)) {
      Alert.alert('Date invalide', 'Vous ne pouvez pas sélectionner les weekends.');
      return;
    }

    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const isSelectedDate = (date: Date) => {
    return selectedDate && date.getTime() === selectedDate.getTime();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR');
  };

  const days = generateCalendarDays();
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sélectionner une date</Text>
      
      {/* Navigation du mois */}
      <View style={styles.monthHeader}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* En-têtes des jours */}
      <View style={styles.dayHeaders}>
        {dayNames.map((dayName, index) => (
          <Text key={index} style={styles.dayHeader}>
            {dayName}
          </Text>
        ))}
      </View>

      {/* Grille du calendrier */}
      <View style={styles.calendar}>
        {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => (
          <View key={dayIndex} style={styles.dayColumn}>
            {days.filter((_, index) => index % 7 === dayIndex).map((date, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  !date && styles.emptyCell,
                  date && isSelectedDate(date) && styles.selectedCell,
                  date && isPastDate(date) && styles.pastDateCell,
                  date && isWeekend(date) && styles.weekendCell,
                ]}
                onPress={() => date && handleDatePress(date)}
                disabled={!date || (date && (isPastDate(date) || isWeekend(date)))}
              >
                <Text
                  style={[
                    styles.dayText,
                    date && isSelectedDate(date) && styles.selectedText,
                    date && isPastDate(date) && styles.pastDateText,
                    date && isWeekend(date) && styles.weekendText,
                  ]}
                >
                  {date ? date.getDate() : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {/* Information de sélection */}
      <View style={styles.selectionInfo}>
        <Text style={styles.infoText}>
          {selectedDate ? `Date sélectionnée: ${formatDate(selectedDate)}` : 'Sélectionnez une date'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 450,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 20,
    margin: 10,
    shadowColor: "#6366f1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#1e293b",
    letterSpacing: -0.3,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  navButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  navButtonText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#6366f1",
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    letterSpacing: -0.3,
  },
  dayHeaders: {
    flexDirection: "row",
    marginBottom: 10,
  },
  dayHeader: {
    flex: 1,
    textAlign: "center",
    fontWeight: "700",
    color: "#64748b",
    paddingVertical: 5,
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  calendar: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  dayColumn: {
    width: "14.28%",
    flexDirection: "column",
  },
  dayCell: {
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    margin: 1,
    height: 40,
  },
  emptyCell: {
    backgroundColor: "transparent",
  },
  selectedCell: {
    backgroundColor: "#6366f1",
  },
  dayText: {
    fontSize: 15,
    color: "#1e293b",
    fontWeight: "500",
  },
  selectedText: {
    color: "white",
    fontWeight: "700",
  },
  pastDateCell: {
    backgroundColor: "#f8fafc",
    opacity: 0.5,
  },
  weekendCell: {
    backgroundColor: "#f8fafc",
    opacity: 0.5,
  },
  weekendText: {
    color: "#cbd5e1",
    textDecorationLine: "line-through",
  },
  pastDateText: {
    color: "#cbd5e1",
    textDecorationLine: "line-through",
  },
  selectionInfo: {
    marginTop: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  infoText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginVertical: 3,
    fontWeight: "500",
  },
});
