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


