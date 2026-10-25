import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Viaje = {
  id: number;
  destino: string;
  pais: string;
  fecha: string;
  estado: string;
};

const API_URL = 'http://localhost:3000';

export default function App() {
  const [viaje, setViaje] = useState<Viaje | null>(null);
  const [estado, setEstado] = useState('RESERVADO');
  const [fecha, setFecha] = useState('2027-04-10'); // Reto MODIFÍCALO
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // Cargar datos iniciales del viaje 1
  useEffect(() => {
    fetch(API_URL + '/viajes/1')
      .then((res) => res.json())
      .then((data: Viaje) => {
        setViaje(data);
        setEstado(data.estado);
        setFecha(data.fecha);
      })
      .catch((err) => console.error('Error al cargar viaje:', err));
  }, []);

  async function actualizar() {
    setCargando(true);
    setMensaje('');

    try {
      const respuesta = await fetch(API_URL + '/viajes/1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado,
          fecha, // Enviamos estado y fecha modificada
        }),
      });

      if (!respuesta.ok) throw new Error('Error al actualizar');

      const actualizado: Viaje = await respuesta.json();
      setViaje(actualizado);
      setMensaje('✓ Viaje actualizado');
    } catch {
      setMensaje('No se pudo actualizar el viaje');
    } finally {
      setCargando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>TRAVEL BOOK</Text>
          <Text style={styles.title}>Editar viaje</Text>
        </View>

        {/* Tarjeta del viaje con datos actuales */}
        {viaje && (
          <View style={styles.card}>
            <Text style={styles.cardEmoji}>✈️</Text>
            <Text style={styles.cardTitle}>{viaje.destino}</Text>
            <Text style={styles.cardSubtitle}>
              {viaje.pais} · <Text style={styles.statusBadge}>{viaje.estado}</Text>
            </Text>
            <View style={styles.dateTag}>
              <Text style={styles.dateText}>📅 Fecha: {viaje.fecha}</Text>
            </View>
          </View>
        )}

        {/* Formulario de edición con PATCH */}
        <View style={styles.form}>
          <Text style={styles.label}>Estado del viaje</Text>
          <TextInput
            style={styles.input}
            value={estado}
            onChangeText={setEstado}
            placeholder="Ej: RESERVADO, COMPLETADO"
          />

          <Text style={styles.label}>Fecha (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            value={fecha}
            onChangeText={setFecha}
            placeholder="Ej: 2027-04-10"
          />

          <Pressable style={styles.button} onPress={actualizar} disabled={cargando}>
            {cargando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Guardar cambios</Text>
            )}
          </Pressable>

          {mensaje !== '' && (
            <Text
              style={[
                styles.statusText,
                mensaje.includes('✓') ? styles.statusSuccess : styles.statusError,
              ]}
            >
              {mensaje}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { padding: 24 },
  header: { marginBottom: 20 },
  eyebrow: { color: '#0284C7', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { fontSize: 30, fontWeight: '800', color: '#0F172A', marginTop: 4 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  cardEmoji: { fontSize: 32 },
  cardTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginTop: 6 },
  cardSubtitle: { color: '#64748B', marginTop: 2, fontSize: 15 },
  statusBadge: { fontWeight: '700', color: '#0284C7' },
  dateTag: {
    marginTop: 12,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  dateText: { color: '#0369A1', fontWeight: '700', fontSize: 13 },
  form: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 20, elevation: 2 },
  label: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 6 },
  input: {
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    fontSize: 15,
  },
  button: {
    backgroundColor: '#0284C7',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  statusText: { textAlign: 'center', marginTop: 14, fontWeight: '700' },
  statusSuccess: { color: '#16A34A' },
  statusError: { color: '#DC2626' },
});