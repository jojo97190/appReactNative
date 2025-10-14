import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

interface DateSelectorProps {
  onDateRangeSelect?: (startDate: Date, endDate: Date) => void;
}

export default function DateSelector({ onDateRangeSelect }: DateSelectorProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
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

    if (!startDate || (startDate && endDate)) {
      // Première sélection ou reset
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate) {
      // Deuxième sélection
      if (date >= startDate) {
        setEndDate(date);
        onDateRangeSelect?.(startDate, date);
      } else {
        // Si la date est antérieure, inverser
        setStartDate(date);
        setEndDate(startDate);
        onDateRangeSelect?.(date, startDate);
      }
    }
  };

  const isDateInRange = (date: Date) => {
    if (!startDate) return false;
    if (!endDate) return date.getTime() === startDate.getTime();
    return date >= startDate && date <= endDate;
  };

  const isStartDate = (date: Date) => {
    return startDate && date.getTime() === startDate.getTime();
  };

  const isEndDate = (date: Date) => {
    return endDate && date.getTime() === endDate.getTime();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour ne comparer que les dates
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = dimanche, 6 = samedi
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

  const validateSelection = () => {
    if (startDate && endDate) {
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      Alert.alert(
        'Durée sélectionnée',
        `Du ${formatDate(startDate)} au ${formatDate(endDate)}\nDurée: ${days} jour(s)`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('Sélection incomplète', 'Veuillez sélectionner une date de début et de fin');
    }
  };

  const days = generateCalendarDays();
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sélectionner une durée</Text>
      
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
                  date && isDateInRange(date) && styles.selectedCell,
                  date && isStartDate(date) && styles.startDateCell,
                  date && isEndDate(date) && styles.endDateCell,
                  date && isPastDate(date) && styles.pastDateCell,
                  date && isWeekend(date) && styles.weekendCell,
                ]}
                onPress={() => date && handleDatePress(date)}
                disabled={!date || (date && (isPastDate(date) || isWeekend(date)))}
              >
                <Text
                  style={[
                    styles.dayText,
                    date && isDateInRange(date) && styles.selectedText,
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

      {/* Informations de sélection */}
      <View style={styles.selectionInfo}>
        <Text style={styles.infoText}>
          {startDate ? `Début: ${formatDate(startDate)}` : 'Sélectionnez une date de début'}
        </Text>
        <Text style={styles.infoText}>
          {endDate ? `Fin: ${formatDate(endDate)}` : 'Sélectionnez une date de fin'}
        </Text>
      </View>

      {/* Bouton de validation */}
      <TouchableOpacity style={styles.validateButton} onPress={validateSelection}>
        <Text style={styles.validateButtonText}>Valider la sélection</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 500,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  navButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  navButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#666',
    paddingVertical: 5,
  },
  calendar: {
    flexDirection: 'row',  // Les colonnes sont côte à côte
    justifyContent: 'space-between',
    flex: 1,
  },
  dayColumn: {
    width: '14.28%',  // 100% / 7 jours
    flexDirection: 'column',  // Empile les jours verticalement
  },
  dayCell: {
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    margin: 1,
    height: 40,  // Hauteur fixe pour chaque cellule
  },
  emptyCell: {
    backgroundColor: 'transparent',
  },
  selectedCell: {
    backgroundColor: '#E3F2FD',
  },
  startDateCell: {
    backgroundColor: '#007AFF',
  },
  endDateCell: {
    backgroundColor: '#007AFF',
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pastDateCell: {
    backgroundColor: '#f5f5f5',
    opacity: 0.5,
  },
  weekendCell: {
    backgroundColor: '#f5f5f5',
    opacity: 0.5,
  },
  weekendText: {
    color: '#ccc',
    textDecorationLine: 'line-through',
  },
  pastDateText: {
    color: '#ccc',
    textDecorationLine: 'line-through',
  },
  selectionInfo: {
    marginTop: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 2,
  },
  validateButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  validateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});