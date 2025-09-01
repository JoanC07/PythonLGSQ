from flask import Flask, jsonify, request
import pyodbc

app = Flask(__name__)

# Conexión a la base de datos SQL Server
conn = pyodbc.connect('DRIVER={SQL Server};SERVER=DESKTOP-BJP2BFE\\MSSQLSERVER07;DATABASE=Base_de_datos;UID=sa;PWD=admin')
cursor = conn.cursor()

@app.route('/')
def index():
    return 'Bienvenido'

@app.route('/clientes', methods=['GET'])
def get_clientes():
    cursor.execute('SELECT * FROM Clientes')
    rows = cursor.fetchall()
    clientes = []
    for row in rows:
        cliente = {
            'id_cliente': row.id_cliente,
        }
        clientes.append(cliente)
    return jsonify(clientes)

if __name__ == '__main__':
    app.run(debug=True)

