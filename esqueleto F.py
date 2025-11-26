pip install flask pyodbc

from flask import Flask, jsonify
import pyodbc

app = Flask(__name__)

# 🔌 Conexión a SQL Server
conn = pyodbc.connect(
    'DRIVER={ODBC Driver 17 for SQL Server};'
    'SERVER=localhost;'
    'DATABASE=BBD;UID=sa;PWD=123456789;'
    'TrustServerCertificate=yes;'
)
cursor = conn.cursor()

@app.route('/')
def index():
    return 'Bienvenido'

@app.route('/cliente')
def get_clientes():
    cursor.execute('SELECT * FROM TABLA')
    rows = cursor.fetchall()
    return jsonify([{
        'id_cliente': r.id_cliente,
        'nombre': r.nombre,
        'direccion': r.direccion,
        'telefono': r.telefono,
        'email': r.email
    } for r in rows])

if __name__ == '__main__':
    app.run(debug=True)


pip install pymongo
from pymongo import MongoClient
from bson import ObjectId  # Para trabajar con ObjectId

# 🔌 Conexión al servidor MongoDB local
cliente = MongoClient("mongodb://localhost:27017/")

# 📁 Base de datos y colecciones
db = cliente["BBD"]
clientes = db["cliente"]
lotes = db["lote"]

# ✅ Mostrar todos los clientes
print("\n📄 Lista de clientes:")
for c in clientes.find():
    print(c)

# ✅ Insertar un nuevo para un cliente existente
cliente_id = "69267ebfb909a9ee37728638"  
nuevo_lote = {
    "id_cliente": ObjectId(cliente_id),
    "descripcion": "Lote experimental",
    "area": 850.0
}
lotes.insert_one(nuevo_lote)
print("\n✅ Lote insertado correctamente.")

