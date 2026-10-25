import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Evento = {
  id: number;
  nombre: string;
  ciudad: string;
  categoria: string;
  fecha: string;
};

const API_URL = 'http://localhost:3000';

export default function App() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [cargando, setCargando] = useState(false);
  const [ciudadFiltro, setCiudadFiltro] = useState<string>('Zaragoza');
  const [catFiltro, setCatFiltro] = useState<string>('Tecnología');

  async function cargarEventos(ciudad?: string, categoria?: string) {
    setCargando(true);
    try {
      const params = new URLSearchParams();
      if (ciudad) params.append('ciudad', ciudad);
      if (categoria) params.append('categoria', categoria);

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`${API_URL}/eventos${queryString}`);
      const data: Evento[] = await res.json();
      setEventos(data);
    } catch (err) {
      console.error('Error al cargar eventos:', err);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarEventos(ciudadFiltro, catFiltro);
  }, [ciudadFiltro, catFiltro]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>EVENT RADAR</Text>
        <Text style={styles.title}>Eventos filtrados</Text>
        <Text style={styles.subtitle}>Filtro: ciudad + categoría vía Query Params</Text>
      </View>

      {/* Selectores de filtros */}
      <View style={styles.filtersSection}>
        <Text style={styles.filterLabel}>Ciudad:</Text>
        <View style={styles.chipRow}>
          {['Todas', 'Zaragoza', 'Madrid'].map((c) => {
            const val = c === 'Todas' ? '' : c;
            const activo = ciudadFiltro === val;
            return (
              <Pressable
                key={c}
                style={[styles.chip, activo && styles.chipActive]}
                onPress={() => setCiudadFiltro(val)}
              >
                <Text style={[styles.chipText, activo && styles.chipTextActive]}>
                  {c === 'Todas' ? '🌍 Todas' : `📍 ${c}`}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.filterLabel, { marginTop: 12 }]}>Categoría:</Text>
        <View style={styles.chipRow}>
          {['Todas', 'Tecnología', 'Música'].map((cat) => {
            const val = cat === 'Todas' ? '' : cat;
            const activo = catFiltro === val;
            return (
              <Pressable
                key={cat}
                style={[styles.chip, activo && styles.chipActive]}
                onPress={() => setCatFiltro(val)}
              >
                <Text style={[styles.chipText, activo && styles.chipTextActive]}>
                  {cat === 'Todas' ? 'Todos' : cat}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Lista de resultados */}
      {cargando ? (
        <ActivityIndicator size="large" color="#0284C7" style={styles.loader} />
      ) : (
        <FlatList
          data={eventos}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay eventos con esos filtros</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardEmoji}>🎟️</Text>
              <View style={styles.cardInfo}>
                <Text style={styles.eventTitle}>{item.nombre}</Text>
                <Text style={styles.eventMeta}>
                  {item.ciudad} · {item.categoria}
                </Text>
                <Text style={styles.eventDate}>📅 {item.fecha}</Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F9FF' },
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 12 },
  eyebrow: { color: '#0284C7', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { fontSize: 30, fontWeight: '800', color: '#0C4A6E', marginTop: 4 },
  subtitle: { color: '#64748B', fontSize: 13, marginTop: 2 },
  filtersSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
  },
  filterLabel: { fontSize: 13, fontWeight: '700', color: '#334155', marginBottom: 8 },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  chipActive: { backgroundColor: '#0284C7' },
  chipText: { fontSize: 13, color: '#475569', fontWeight: '600' },
  chipTextActive: { color: '#FFFFFF', fontWeight: '700' },
  loader: { marginTop: 40 },
  list: { paddingHorizontal: 20, paddingBottom: 24 },
  emptyText: { textAlign: 'center', marginTop: 30, color: '#94A3B8', fontSize: 15 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  cardEmoji: { fontSize: 30, marginRight: 14 },
  cardInfo: { flex: 1 },
  eventTitle: { fontSize: 18, fontWeight: '800', color: '#0C4A6E' },
  eventMeta: { color: '#0284C7', fontSize: 14, marginTop: 2, fontWeight: '600' },
  eventDate: { color: '#64748B', fontSize: 12, marginTop: 4 },
});