import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Libro = {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  leido: boolean;
};

const API_URL = 'http://localhost:3000';

export default function App() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [cargando, setCargando] = useState(true);

  async function cargar() {
    try {
      const res = await fetch(API_URL + '/libros');
      const data: Libro[] = await res.json();
      setLibros(data);
    } catch (err) {
      console.error('Error al cargar libros:', err);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  function confirmarEliminar(libro: Libro) {
    if (Platform.OS === 'web') {
      if (window.confirm(`¿Seguro que deseas eliminar "${libro.titulo}"?`)) {
        eliminar(libro.id);
      }
    } else {
      Alert.alert('Eliminar libro', `¿Deseas eliminar "${libro.titulo}"?`, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => eliminar(libro.id) },
      ]);
    }
  }

  async function eliminar(id: number) {
    try {
      const res = await fetch(`${API_URL}/libros/${id}`, { method: 'DELETE' });
      if (res.ok) {
        // Sincronización del estado React: excluimos el libro eliminado
        setLibros((actuales) => actuales.filter((l) => l.id !== id));
      }
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  }

  async function marcarComoLeido(id: number) {
    try {
      const res = await fetch(`${API_URL}/libros/${id}/leido`, { method: 'PATCH' });
      if (res.ok) {
        const actualizado: Libro = await res.json();
        // Sincronización del estado React: actualizamos solo el libro modificado
        setLibros((actuales) =>
          actuales.map((l) => (l.id === id ? actualizado : l))
        );
      }
    } catch (err) {
      console.error('Error al marcar leído:', err);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>MY LIBRARY</Text>
        <Text style={styles.title}>Biblioteca</Text>
      </View>

      {cargando ? (
        <ActivityIndicator size="large" color="#6366F1" style={styles.loader} />
      ) : (
        <FlatList
          data={libros}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.infoCol}>
                <Text style={styles.bookTitle}>📚 {item.titulo}</Text>
                <Text style={styles.bookMeta}>
                  {item.autor} · {item.genero}
                </Text>
                <View
                  style={[
                    styles.statusTag,
                    item.leido ? styles.statusRead : styles.statusPending,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      item.leido ? styles.statusReadText : styles.statusPendingText,
                    ]}
                  >
                    {item.leido ? 'Leído ✓' : 'Pendiente'}
                  </Text>
                </View>
              </View>

              <View style={styles.actionsCol}>
                {!item.leido && (
                  <Pressable
                    style={styles.btnRead}
                    onPress={() => marcarComoLeido(item.id)}
                  >
                    <Text style={styles.btnReadText}>Marcar leído</Text>
                  </Pressable>
                )}
                <Pressable
                  style={styles.btnDelete}
                  onPress={() => confirmarEliminar(item)}
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
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 16 },
  eyebrow: { color: '#6366F1', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { fontSize: 30, fontWeight: '800', color: '#0F172A', marginTop: 4 },
  loader: { marginTop: 40 },
  list: { paddingHorizontal: 20, paddingBottom: 24 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  infoCol: { flex: 1, paddingRight: 12 },
  bookTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  bookMeta: { color: '#64748B', fontSize: 14, marginTop: 4 },
  statusTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  statusRead: { backgroundColor: '#DCFCE7' },
  statusPending: { backgroundColor: '#FEF3C7' },
  statusText: { fontSize: 12, fontWeight: '700' },
  statusReadText: { color: '#15803D' },
  statusPendingText: { color: '#B45309' },
  actionsCol: { gap: 8, alignItems: 'flex-end' },
  btnRead: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnReadText: { color: '#4F46E5', fontWeight: '700', fontSize: 12 },
  btnDelete: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnDeleteText: { color: '#DC2626', fontWeight: '700', fontSize: 12 },
});