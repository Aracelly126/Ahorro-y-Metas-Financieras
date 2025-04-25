import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    textAlign: 'center'
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666'
  },
  section: {
    marginBottom: 30
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    borderBottom: '1 solid #eee',
    paddingBottom: 5
  },
  goalContainer: {
    marginBottom: 20,
    padding: 15,
    border: '1 solid #eee',
    borderRadius: 5
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  goalDetail: {
    fontSize: 12,
    marginBottom: 4,
    display: 'flex',
    flexDirection: 'row'
  },
  goalLabel: {
    width: 100,
    fontWeight: 'bold'
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginTop: 8,
    marginBottom: 8
  },
  progressFill: {
    height: '100%',
    borderRadius: 5
  },
  status: {
    padding: 4,
    borderRadius: 3,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  }
});

const PdfGenerator = ({ goal }) => {
  // Asegurarnos de que current_amount tenga un valor por defecto
  const currentAmount = goal.current_amount || 0;
  const progressPercentage = Math.min(100, Math.round((currentAmount / goal.target_amount) * 100));
  
  // Colores según el estado de la meta
  const statusColor = {
    cumplido: '#10B981',    // verde
    pendiente: '#3B82F6',   // azul
    cancelado: '#EF4444'    // rojo
  };

  // Texto descriptivo según el estado
  const getStatusDescription = () => {
    switch(goal.goal_state) {
      case 'cumplido':
        return '¡Felicidades! Has alcanzado tu objetivo.';
      case 'cancelado':
        return 'Esta meta ha sido cancelada. Considera ajustar tus planes.';
      default:
        return 'Sigue trabajando para alcanzar tu objetivo antes de la fecha límite.';
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Reporte de Meta Financiera</Text>
          <Text style={styles.subtitle}>Detalle de tu progreso</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de la Meta</Text>
          <View style={styles.goalContainer}>
            <Text style={styles.goalTitle}>{goal.goal_name}</Text>
            
            <View style={styles.goalDetail}>
              <Text style={styles.goalLabel}>Objetivo:</Text>
              <Text>${goal.target_amount.toLocaleString()}</Text>
            </View>
            
            <View style={styles.goalDetail}>
              <Text style={styles.goalLabel}>Ahorrado:</Text>
              <Text>${currentAmount.toLocaleString()}</Text>
            </View>
            
            <View style={styles.goalDetail}>
              <Text style={styles.goalLabel}>Fecha límite:</Text>
              <Text>{new Date(goal.deadline_date).toLocaleDateString()}</Text>
            </View>
            
            <View style={styles.goalDetail}>
              <Text style={styles.goalLabel}>Progreso:</Text>
              <Text>{progressPercentage}%</Text>
            </View>
            
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { 
                width: `${progressPercentage}%`,
                backgroundColor: statusColor[goal.goal_state] 
              }]} />
            </View>
            
            <View style={styles.goalDetail}>
              <Text style={styles.goalLabel}>Estado:</Text>
              <Text style={[styles.status, { 
                backgroundColor: `${statusColor[goal.goal_state]}20`, 
                color: statusColor[goal.goal_state] 
              }]}>
                {goal.goal_state}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          <Text style={{ fontSize: 12, lineHeight: 1.5 }}>
            Has completado el {progressPercentage}% de tu meta "{goal.goal_name}". {getStatusDescription()}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PdfGenerator;