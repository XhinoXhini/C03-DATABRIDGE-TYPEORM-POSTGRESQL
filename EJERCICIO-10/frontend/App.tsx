import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Destino = {
  id: number;
  ciudad: string;
  pais: string;
  descripcion: string;
  visitado: boolean;
  prioridad: string;
};

const API_URL = 'http://localhost:3000';

export default function App() {
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [ciudad, setCiudad] = useState('');
  const [pais, setPais] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState('Alta');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  async function request(url: string, options?: RequestInit) {
    const r = await fetch(url, options);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r;
  }

  async function cargar() {
    try {
      const r = await request(API_URL + '/destinos');
      const data: Destino[] = await r.json();
      setDestinos(data);
      setError('');
    } catch {
      setError('No se pudieron cargar los destinos.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function crear() {
    if (!ciudad || !pais) {
      setError('Ciudad y País son obligatorios.');
      return;
    }

    try {
      await request(API_URL + '/destinos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ciudad,
          pais,
          descripcion: descripcion || 'Sin descripción',
          prioridad,
          visitado: false,
        }),
      });
      setCiudad('');
      setPais('');
      setDescripcion('');
      await cargar();
    } catch {
      setError('No se pudo crear el destino.');
    }
  }

  async function toggleVisitado(item: Destino) {
    try {
      await request(API_URL + '/destinos/' + item.id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitado: !item.visitado }),
      });
      await cargar();
    } catch {
      setError('No se pudo actualizar el estado.');
    }
  }

  async function eliminar(id: number) {
    try {
      await request(API_URL + '/destinos/' + id, { method: 'DELETE' });
      await cargar();
    } catch {
      setError('No se pudo eliminar.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>WANDER</Text>
        <Text style={styles.title}>Destinos</Text>
      </View>

      {error !== '' && <Text style={styles.errorText}>{error}</Text>}

      {/* Formulario de creación */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>＋ Planificar nuevo destino</Text>
        <TextInput
          style={styles.input}
          placeholder="Ciudad (Ej: Kioto)"
          value={ciudad}
          onChangeText={setCiudad}
        />
        <TextInput
          style={styles.input}
          placeholder="País (Ej: Japón)"
          value={pais}
          onChangeText={setPais}
        />
        <TextInput
          style={styles.input}
          placeholder="Descripción (opcional)"
          value={descripcion}
          onChangeText={setDescripcion}
        />

        <View style={styles.priorityRow}>
          <Text style={styles.label}>Prioridad:</Text>
          {['Alta', 'Media', 'Baja'].map((p) => (
            <Pressable
              key={p}
              style={[styles.chip, prioridad === p && styles.chipActive]}
              onPress={() => setPrioridad(p)}
            >
              <Text
                style={[styles.chipText, prioridad === p && styles.chipTextActive]}
              >
                {p}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.btnCreate} onPress={crear}>
          <Text style={styles.btnCreateText}>Guardar destino</Text>
        </Pressable>
      </View>

      {cargando ? (
        <ActivityIndicator size="large" color="#059669" style={styles.loader} />
      ) : (
        <FlatList
          data={destinos}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleCol}>
                  <Text style={styles.cityName}>🌍 {item.ciudad}</Text>
                  <Text style={styles.countryName}>{item.pais}</Text>
                </View>

                {/* Badge de prioridad */}
                <View
                  style={[
                    styles.priorityBadge,
                    item.prioridad === 'Alta'
                      ? styles.badgeAlta
                      : styles.badgeMedia,
                  ]}
                >
                  <Text style={styles.priorityText}>
                    Prioridad {item.prioridad}
                  </Text>
                </View>
              </View>

              <Text style={styles.descText}>{item.descripcion}</Text>

              <View style={styles.footerRow}>
                {/* Botón interactivo PATCH para marcar visitado */}
                <Pressable
                  style={[
                    styles.btnVisited,
                    item.visitado && styles.btnVisitedActive,
                  ]}
                  onPress={() => toggleVisitado(item)}
                >
                  <Text
                    style={[
                      styles.btnVisitedText,
                      item.visitado && styles.btnVisitedTextActive,
                    ]}
                  >
                    {item.visitado ? '✓ Visitado' : '○ Pendiente'}
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.btnDelete}
                  onPress={() => eliminar(item.id)}
                >
                  <Text style={styles.btnDeleteText}>Eliminar</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 12 },
  eyebrow: { color: '#059669', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { fontSize: 32, fontWeight: '800', color: '#064E3B', marginTop: 4 },
  errorText: { color: '#DC2626', marginHorizontal: 24, fontWeight: '600', marginBottom: 8 },
  formCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  formTitle: { fontSize: 14, fontWeight: '800', color: '#065F46', marginBottom: 10 },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  priorityRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 6 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151' },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
  },
  chipActive: { backgroundColor: '#059669' },
  chipText: { fontSize: 12, fontWeight: '600', color: '#4B5563' },
  chipTextActive: { color: '#FFFFFF' },
  btnCreate: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  btnCreateText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  loader: { marginTop: 30 },
  list: { paddingHorizontal: 20, paddingBottom: 24 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitleCol: { flex: 1 },
  cityName: { fontSize: 18, fontWeight: '800', color: '#111827' },
  countryName: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeAlta: { backgroundColor: '#FEE2E2' },
  badgeMedia: { backgroundColor: '#FEF3C7' },
  priorityText: { fontSize: 11, fontWeight: '700', color: '#991B1B' },
  descText: { fontSize: 13, color: '#4B5563', marginVertical: 10 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  btnVisited: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  btnVisitedActive: { backgroundColor: '#D1FAE5' },
  btnVisitedText: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  btnVisitedTextActive: { color: '#047857' },
  btnDelete: { paddingHorizontal: 10, paddingVertical: 6 },
  btnDeleteText: { fontSize: 12, fontWeight: '700', color: '#EF4444' },
});