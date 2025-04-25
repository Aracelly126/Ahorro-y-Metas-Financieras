// PdfGenerator.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

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
    borderRadius: 5,
    backgroundColor: '#4CAF50'
  },
  status: {
    padding: 4,
    borderRadius: 3,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  }
});

const PdfGenerator = ({ goal, darkMode }) => {
  const progressPercentage = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
  const statusColor = {
    completada: '#10B981',
    'en espera': '#3B82F6',
    vencida: '#EF4444'
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
              <Text>${goal.target_amount}</Text>
            </View>
            
            <View style={styles.goalDetail}>
              <Text style={styles.goalLabel}>Ahorrado:</Text>
              <Text>${goal.current_amount}</Text>
            </View>
            
            <View style={styles.goalDetail}>
              <Text style={styles.goalLabel}>Fecha límite:</Text>
              <Text>{goal.deadline_date}</Text>
            </View>
            
            <View style={styles.goalDetail}>
              <Text style={styles.goalLabel}>Progreso:</Text>
              <Text>{progressPercentage}%</Text>
            </View>
            
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { 
                width: `${progressPercentage}%`,
                backgroundColor: statusColor[goal.status] 
              }]} />
            </View>
            
            <View style={styles.goalDetail}>
              <Text style={styles.goalLabel}>Estado:</Text>
              <Text style={[
                styles.status, 
                { 
                  backgroundColor: `${statusColor[goal.status]}20`,
                  color: statusColor[goal.status]
                }
              ]}>
                {goal.status}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          <Text style={{ fontSize: 12, lineHeight: 1.5 }}>
            Has completado el {progressPercentage}% de tu meta "{goal.goal_name}". 
            {goal.status === 'completada' ? ' ¡Felicidades! Has alcanzado tu objetivo.' : 
             goal.status === 'vencida' ? ' Esta meta ha vencido. Considera ajustar tus planes.' : 
             ' Sigue trabajando para alcanzar tu objetivo antes de la fecha límite.'}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PdfGenerator;