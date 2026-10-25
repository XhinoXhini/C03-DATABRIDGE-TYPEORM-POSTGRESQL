import { useState } from 'react';
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

type Restaurante = {
  id: number;
  nombre: string;
  tipo: string;
  ciudad: string;
  puntuacion: number;
  precioMedio: number;
};

const API_URL = 'http://localhost:3000';

export default function App() {
  const [nombre, setNombre] = useState('La Trattoria');
  const [tipo, setTipo] = useState('Italiano');
  const [ciudad, setCiudad] = useState('Zaragoza');
  const [precioMedio, setPrecioMedio] = useState('25');
  const [guardado, setGuardado] = useState<Restaurante | null>(null);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  async function guardar() {
    if (!nombre || !tipo || !ciudad || !precioMedio) {
      setMensaje('Rellena todos los campos');
      return;
    }

    setCargando(true);
    setMensaje('');

    try {
      const respuesta = await fetch(API_URL + '/restaurantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          tipo,
          ciudad,
          puntuacion: 9.0,
          precioMedio: Number(precioMedio),
        }),
      });

      if (!respuesta.ok) throw new Error('Error en el servidor');

      const data: Restaurante = await respuesta.json();
      setGuardado(data);
      setMensaje('✓ Persistido en PostgreSQL');
    } catch {
      setMensaje('Error al conectar con la API');
    } finally {
      setCargando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>FOOD SPOTS</Text>
          <Text style={styles.title}>Nuevo restaurante</Text>
        </View>

        {/* Tarjeta del restaurante guardado / preview */}
        {guardado && (
          <View style={styles.card}>
            <Text style={styles.cardEmoji}>🍜</Text>
            <Text style={styles.cardTitle}>{guardado.nombre}</Text>
            <Text style={styles.cardSubtitle}>
              {guardado.tipo} · {guardado.ciudad}
            </Text>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>
                Precio medio {Number(guardado.precioMedio).toFixed(0)} €
              </Text>
            </View>
          </View>
        )}

        {/* Formulario */}
        <View style={styles.form}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: La Trattoria"
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={styles.label}>Tipo de cocina</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Italiano"
            value={tipo}
            onChangeText={setTipo}
          />

          <Text style={styles.label}>Ciudad</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Zaragoza"
            value={ciudad}
            onChangeText={setCiudad}
          />

          <Text style={styles.label}>Precio medio (€)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 25"
            keyboardType="numeric"
            value={precioMedio}
            onChangeText={setPrecioMedio}
          />

          <Pressable style={styles.button} onPress={guardar} disabled={cargando}>
            {cargando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>＋ Guardar restaurante</Text>
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
  container: { flex: 1, backgroundColor: '#FFF7ED' },
  scroll: { padding: 24 },
  header: { marginBottom: 20 },
  eyebrow: { color: '#EA580C', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { fontSize: 30, fontWeight: '800', color: '#1C1917', marginTop: 4 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FED7AA',
    elevation: 2,
  },
  cardEmoji: { fontSize: 32 },
  cardTitle: { fontSize: 20, fontWeight: '800', color: '#1C1917', marginTop: 6 },
  cardSubtitle: { color: '#78716C', marginTop: 2, fontSize: 15 },
  priceTag: {
    marginTop: 12,
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  priceText: { color: '#C2410C', fontWeight: '700', fontSize: 13 },
  form: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 20, elevation: 2 },
  label: { fontSize: 13, fontWeight: '700', color: '#44403C', marginBottom: 6 },
  input: {
    backgroundColor: '#F5F5F4',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    fontSize: 15,
  },
  button: {
    backgroundColor: '#EA580C',
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