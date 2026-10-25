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

type Sneaker = {
  id: number;
  marca: string;
  modelo: string;
  precio: number;
  talla: number;
  stock: number; // Reto MODIFÍCALO
};

const API_URL = 'http://localhost:3000';

export default function App() {
  const [items, setItems] = useState<Sneaker[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  async function request(url: string, options?: RequestInit) {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res;
  }

  async function cargar() {
    try {
      const res = await request(API_URL + '/sneakers');
      const data: Sneaker[] = await res.json();
      setItems(data);
      setError('');
    } catch {
      setError('No se pudo conectar con la API.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function crearEjemplo() {
    try {
      await request(API_URL + '/sneakers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marca: 'New Balance',
          modelo: '550',
          precio: 130.0,
          talla: 44,
          stock: 2,
        }),
      });
      await cargar();
    } catch {
      setError('Error al crear sneaker.');
    }
  }

  async function alternarStock(item: Sneaker) {
    try {
      // Alterna entre tener stock (3) o agotarse (0)
      const nuevoStock = Number(item.stock) === 0 ? 3 : 0;
      await request(API_URL + '/sneakers/' + item.id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: nuevoStock }),
      });
      await cargar();
    } catch {
      setError('Error al actualizar stock.');
    }
  }

  async function rebajar(id: number, precioActual: number) {
    try {
      const nuevoPrecio = Math.max(10, Number(precioActual) - 10);
      await request(API_URL + '/sneakers/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ precio: nuevoPrecio }),
      });
      await cargar();
    } catch {
      setError('Error al actualizar precio.');
    }
  }

  async function eliminar(id: number) {
    try {
      await request(API_URL + '/sneakers/' + id, { method: 'DELETE' });
      await cargar();
    } catch {
      setError('Error al eliminar.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>SNEAKER VAULT</Text>
          <Text style={styles.title}>Inventario</Text>
        </View>
        <Pressable style={styles.btnAdd} onPress={crearEjemplo}>
          <Text style={styles.btnAddText}>＋ Añadir</Text>
        </Pressable>
      </View>

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      {cargando ? (
        <ActivityIndicator size="large" color="#0F172A" style={styles.loader} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const agotado = Number(item.stock) === 0;

            return (
              <View style={styles.card}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>👟 {item.modelo}</Text>
                  <Text style={styles.cardSubtitle}>
                    {item.marca} · Talla {item.talla} · {Number(item.precio).toFixed(2)} €
                  </Text>

                  {/* Reto MODIFÍCALO: Stock numérico o badge AGOTADO */}
                  <View
                    style={[
                      styles.stockBadge,
                      agotado ? styles.badgeAgotado : styles.badgeStock,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stockText,
                        agotado ? styles.textAgotado : styles.textStock,
                      ]}
                    >
                      {agotado ? 'AGOTADO' : `Stock ${item.stock}`}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardActions}>
                  <Pressable
                    style={styles.actionBtn}
                    onPress={() => alternarStock(item)}
                  >
                    <Text style={styles.actionBtnText}>
                      {agotado ? 'Restock' : 'Agotar'}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={styles.actionBtn}
                    onPress={() => rebajar(item.id, item.precio)}
                  >
                    <Text style={styles.actionBtnText}>-10€</Text>
                  </Pressable>
                  <Pressable
                    style={styles.actionBtnDelete}
                    onPress={() => eliminar(item.id)}
                  >
                    <Text style={styles.actionBtnDeleteText}>✕</Text>
                  </Pressable>
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  header: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eyebrow: { color: '#64748B', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { fontSize: 30, fontWeight: '800', color: '#0F172A', marginTop: 2 },
  btnAdd: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  btnAddText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  loader: { marginTop: 40 },
  error: { color: '#DC2626', paddingHorizontal: 24, marginBottom: 12, fontWeight: '600' },
  list: { paddingHorizontal: 20, paddingBottom: 24 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  cardSubtitle: { color: '#64748B', fontSize: 14, marginTop: 4 },
  stockBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  badgeStock: { backgroundColor: '#E2E8F0' },
  badgeAgotado: { backgroundColor: '#FEE2E2' },
  stockText: { fontSize: 12, fontWeight: '800' },
  textStock: { color: '#334155' },
  textAgotado: { color: '#DC2626' },
  cardActions: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  actionBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionBtnText: { color: '#334155', fontWeight: '700', fontSize: 12 },
  actionBtnDelete: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionBtnDeleteText: { color: '#DC2626', fontWeight: '800', fontSize: 12 },
});