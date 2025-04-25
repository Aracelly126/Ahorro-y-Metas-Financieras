import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Registrar fuentes (opcional)
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc9.ttf', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF'
  },
  header: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: '1px solid #E5E7EB'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: 'normal'
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 24,
    marginBottom: 30,
    border: '1px solid #E5E7EB'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16
  },
  gridItem: {
    width: '50%',
    marginBottom: 12
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: 'medium'
  },
  value: {
    fontSize: 14,
    color: '#111827',
    fontWeight: 'normal'
  },
  progressContainer: {
    marginTop: 8,
    marginBottom: 16
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    marginTop: 8
  },
  progressFill: {
    height: '100%',
    borderRadius: 5
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    alignSelf: 'flex-start'
  },
  contributionsHeader: {
    flexDirection: 'row',
    borderBottom: '1px solid #E5E7EB',
    paddingBottom: 8,
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 12,
    color: '#374151'
  },
  contributionRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottom: '1px solid #F3F4F6',
    fontSize: 12
  },
  colDate: {
    width: '25%'
  },
  colAmount: {
    width: '25%',
    textAlign: 'right'
  },
  colRemaining: {
    width: '25%',
    textAlign: 'right'
  },
  colNotes: {
    width: '25%'
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTop: '1px solid #E5E7EB',
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center'
  }
});

const PdfGenerator = ({ goal, contributions = [] }) => {
  const totalContributions = contributions.reduce(
    (sum, contrib) => sum + Number(contrib.amount),
    0
  );

  const progressPercentage = Math.min(
    100,
    Math.round((totalContributions / goal.target_amount) * 100)
  );

  const statusColor = {
    cumplido: '#10B981',
    pendiente: '#3B82F6',
    cancelado: '#EF4444'
  };

  const statusText = {
    cumplido: 'COMPLETADA',
    pendiente: 'EN PROGRESO',
    cancelado: 'CANCELADA'
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.title}>Reporte de Meta Financiera</Text>
          <Text style={styles.subtitle}>Generado el {formatDate(new Date())}</Text>
        </View>

        {/* Tarjeta de resumen de la meta */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Resumen de la Meta</Text>
          
          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Nombre de la meta</Text>
              <Text style={styles.value}>{goal.goal_name}</Text>
            </View>
            
            <View style={styles.gridItem}>
              <Text style={styles.label}>Estado</Text>
              <Text style={[styles.statusBadge, { 
                backgroundColor: `${statusColor[goal.goal_state]}20`,
                color: statusColor[goal.goal_state]
              }]}>
                {statusText[goal.goal_state]}
              </Text>
            </View>
            
            <View style={styles.gridItem}>
              <Text style={styles.label}>Objetivo</Text>
              <Text style={styles.value}>{formatCurrency(goal.target_amount)}</Text>
            </View>
            
            <View style={styles.gridItem}>
              <Text style={styles.label}>Total acumulado</Text>
              <Text style={styles.value}>{formatCurrency(totalContributions)}</Text>
            </View>
            
            <View style={styles.gridItem}>
              <Text style={styles.label}>Fecha límite</Text>
              <Text style={styles.value}>{formatDate(goal.deadline_date)}</Text>
            </View>
            
            <View style={styles.gridItem}>
              <Text style={styles.label}>Porcentaje completado</Text>
              <Text style={styles.value}>{progressPercentage}%</Text>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <Text style={styles.label}>Progreso</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { 
                width: `${progressPercentage}%`,
                backgroundColor: statusColor[goal.goal_state]
              }]} />
            </View>
          </View>
        </View>

        {/* Listado de contribuciones */}
        <View>
          <Text style={styles.sectionTitle}>Historial de Contribuciones</Text>
          
          <View style={styles.contributionsHeader}>
            <Text style={styles.colDate}>Fecha</Text>
            <Text style={styles.colAmount}>Monto</Text>
            <Text style={styles.colRemaining}>Saldo restante</Text>
            <Text style={styles.colNotes}>Notas</Text>
          </View>
          
          {contributions.map((contrib, index) => {
            const remaining = goal.target_amount - contrib.amount;
            return (
              <View key={index} style={styles.contributionRow}>
                <Text style={styles.colDate}>{formatDate(contrib.contribution_date)}</Text>
                <Text style={styles.colAmount}>{formatCurrency(contrib.amount)}</Text>
                <Text style={styles.colRemaining}>{formatCurrency(remaining)}</Text>
                <Text style={styles.colNotes}>{contrib.notes || '--'}</Text>
              </View>
            );
          })}
          
          {contributions.length === 0 && (
            <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 8 }}>
              No se han registrado contribuciones para esta meta.
            </Text>
          )}
        </View>

        {/* Pie de página */}
        <View style={styles.footer}>
          <Text>Reporte generado automáticamente por el sistema de metas financieras</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PdfGenerator;