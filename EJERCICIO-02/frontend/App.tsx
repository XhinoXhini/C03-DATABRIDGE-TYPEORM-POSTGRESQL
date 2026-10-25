import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

type Pelicula = {
  id: number;
  titulo: string;
  genero: string;
  anio: number;
  puntuacion: number;
  favorita: boolean; // Reto MODIFÍCALO
};

const API_URL = 'http://localhost:3000';

export default function App() {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);

  useEffect(() => {
    fetch(API_URL + '/peliculas')
      .then((respuesta) => respuesta.json())
      .then((datos: Pelicula[]) => setPeliculas(datos))
      .catch((err) => console.error('Error al conectar con la API:', err));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🎬 CineBox</Text>
      <Text style={styles.subtitle}>Cartelera recuperada de PostgreSQL</Text>
      <FlatList
        data={peliculas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.movie}>🎬 {item.titulo}</Text>
              {/* Representación visual de favorita según el valor booleano */}
              <Text style={item.favorita ? styles.favActive : styles.favInactive}>
                {item.favorita ? '♥' : '♡'}
              </Text>
            </View>
            <Text style={styles.details}>
              {item.genero} · {item.anio}
            </Text>
            <Text style={styles.score}>⭐ {Number(item.puntuacion).toFixed(1)}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20 },
  title: { fontSize: 30, fontWeight: '800', marginBottom: 4, color: '#0F172A' },
  subtitle: { fontSize: 14, color: '#64748B', marginBottom: 16 },
  card: { backgroundColor: '#FFF', padding: 18, borderRadius: 16, marginBottom: 12, elevation: 2 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  movie: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  details: { color: '#64748B', marginTop: 4 },
  score: { marginTop: 6, fontWeight: '600', color: '#D97706' },
  favActive: { fontSize: 22, color: '#E11D48', fontWeight: 'bold' },
  favInactive: { fontSize: 22, color: '#94A3B8' },
});