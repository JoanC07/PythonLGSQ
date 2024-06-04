from flask import Flask, jsonify, request
import pyodbc

app = Flask(__name__)

# Conexión a la base de datos SQL Server
conn = pyodbc.connect('DRIVER={SQL Server};SERVER=DESKTOP-BJP2BFE\\MSSQLSERVER07;DATABASE=Riego1;UID=sa;PWD=admin')
cursor = conn.cursor()

@app.route('/')
def index():
    return 'Bienvenido al sistema de riego'

@app.route('/clientes', methods=['GET'])
def get_clientes():
    cursor.execute('SELECT * FROM Clientes')
    rows = cursor.fetchall()
    clientes = []
    for row in rows:
        cliente = {
            'id_cliente': row.id_cliente,
            'nombre': row.nombre,
            'direccion': row.direccion,
            'telefono': row.telefono,
            'email': row.email
        }
        clientes.append(cliente)
    return jsonify(clientes)

@app.route('/lotes', methods=['GET'])
def get_lotes():
    cursor.execute('SELECT * FROM Lotes')
    rows = cursor.fetchall()
    lotes = []
    for row in rows:
        lote = {
            'id_lote': row.id_lote,
            'id_cliente': row.id_cliente,
            'descripcion': row.descripcion,
            'area': row.area
        }
        lotes.append(lote)
    return jsonify(lotes)

@app.route('/riegos', methods=['GET'])
def get_riegos():
    cursor.execute('SELECT * FROM Riegos')
    rows = cursor.fetchall()
    riegos = []
    for row in rows:
        riego = {
            'id_riegos': row.id_riego,
            'id_lote': row.id_lote,
            'fecha': row.fecha,
            'cantidad_agua': row.cantidad_agua
        }
        riegos.append(riego)
    return jsonify(riegos)

@app.route('/facturas', methods=['GET'])
def get_facturas():
    cursor.execute('SELECT * FROM Facturas')
    rows = cursor.fetchall()
    facturas = []
    for row in rows:
        factura = {
            'id_factura': row.id_factura,
            'id_cliente': row.id_cliente,
            'id_lote': row.id_lote,
            'fecha_factura': row.fecha_factura,
            'monto': row.monto,
            'estado': row.estado
        }
        facturas.append(factura)
    return jsonify(facturas)

if __name__ == '__main__':
    app.run(debug=True)
