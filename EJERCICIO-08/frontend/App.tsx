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

type Cancion = {
  id: number;
  titulo: string;
  artista: string;
};

type Playlist = {
  id: number;
  nombre: string;
  canciones: Cancion[];
};

const API_URL = 'http://localhost:3000';

export default function App() {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [cargando, setCargando] = useState(true);
  const [titulo, setTitulo] = useState('Midnight City');
  const [artista, setArtista] = useState('M83');
  const [guardando, setGuardando] = useState(false);

  async function cargar() {
    try {
      const res = await fetch(API_URL + '/playlists/1');
      const data: Playlist = await res.json();
      setPlaylist(data);
    } catch (err) {
      console.error('Error al cargar la playlist:', err);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function agregarCancion() {
    if (!titulo || !artista || !playlist) return;

    setGuardando(true);
    try {
      const res = await fetch(API_URL + '/playlists/canciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          artista,
          playlistId: playlist.id,
        }),
      });

      if (res.ok) {
        setTitulo('');
        setArtista('');
        await cargar(); // Recargar la playlist para traer la relación actualizada
      }
    } catch (err) {
      console.error('Error al añadir canción:', err);
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>MY PLAYLISTS</Text>
        <Text style={styles.title}>{playlist?.nombre}</Text>
      </View>

      <FlatList
        data={playlist?.canciones || []}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardEmoji}>🎵</Text>
            <View style={styles.cardContent}>
              <Text style={styles.songTitle}>{item.titulo}</Text>
              <Text style={styles.artist}>{item.artista}</Text>
            </View>
          </View>
        )}
      />

      {/* Formulario para el Reto MODIFÍCALO */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Añadir canción a esta playlist</Text>
        <TextInput
          style={styles.input}
          placeholder="Título de la canción"
          value={titulo}
          onChangeText={setTitulo}
        />
        <TextInput
          style={styles.input}
          placeholder="Artista"
          value={artista}
          onChangeText={setArtista}
        />
        <Pressable
          style={styles.btnAdd}
          onPress={agregarCancion}
          disabled={guardando}
        >
          {guardando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.btnAddText}>＋ Añadir canción</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF5FF' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  eyebrow: { color: '#8B5CF6', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { fontSize: 30, fontWeight: '800', color: '#1E1B4B', marginTop: 4 },
  list: { paddingHorizontal: 20, paddingBottom: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  cardEmoji: { fontSize: 26, marginRight: 14 },
  cardContent: { flex: 1 },
  songTitle: { fontSize: 16, fontWeight: '700', color: '#1E1B4B' },
  artist: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    borderTopWidth: 1,
    borderColor: '#E9D5FF',
  },
  formTitle: { fontSize: 14, fontWeight: '800', color: '#581C87', marginBottom: 12 },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 14,
  },
  btnAdd: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  btnAddText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
});