import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';

type Mascota = {
  id: number;
  nombre: string;
  raza: string;
  edad: number;
  ciudad: string;
  nivelEnergia: string; // Reto MODIFÍCALO
};

const API_URL = 'http://localhost:3000';

export default function App() {
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(API_URL + '/mascotas/1')
      .then((res) => {
        if (!res.ok) throw new Error('Mascota no encontrada');
        return res.json();
      })
      .then((dato: Mascota) => setMascota(dato))
      .catch(() => setError('Error al cargar la mascota'))
      .finally(() => setCargando(false));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>PET PROFILE</Text>
        <Text style={styles.headerTitle}>Ficha de mascota</Text>
      </View>

      {cargando && <ActivityIndicator size="large" color="#2563EB" />}

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      {!cargando && mascota && (
        <View style={styles.card}>
          <Text style={styles.emoji}>🐶</Text>
          <Text style={styles.title}>{mascota.nombre}</Text>
          <Text style={styles.subtitle}>{mascota.raza}</Text>
          <Text style={styles.details}>
            {mascota.edad} años · {mascota.ciudad}
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              ⚡ Nivel de energía: {mascota.nivelEnergia.toUpperCase()}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#EEF6FF',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: '#3B82F6',
    letterSpacing: 2,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  emoji: { fontSize: 64, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  subtitle: { fontSize: 16, fontWeight: '600', color: '#64748B', marginTop: 4 },
  details: { fontSize: 14, color: '#94A3B8', marginTop: 4 },
  badge: {
    marginTop: 20,
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  badgeText: {
    color: '#D97706',
    fontWeight: '700',
    fontSize: 13,
  },
  error: { color: '#EF4444', fontWeight: '600' },
});