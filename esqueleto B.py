from flask import Flask, jsonify, request
import pyodbc

app = Flask(__name__)

# Conexión a la base de datos SQL Server
conn = pyodbc.connect('DRIVER={SQL Server};SERVER=DESKTOP-BJP2BFE\\MSSQLSERVER07;DATABASE=Pruebaaa;UID=sa;PWD=admin')
cursor = conn.cursor()

@app.route('/')
def index():
    return 'Bienvenido al sistema Construccion'

@app.route('/empleados', methods=['GET'])
def get_clientes():
    cursor.execute('SELECT * FROM Empleado')
    rows = cursor.fetchall()
    clientes = []
    for row in rows:
        cliente = {
            'id_empleado': row.id_empleado,
            'nombre': row.nombre,
            'tipo': row.tipo
        }
        clientes.append(cliente)
    return jsonify(clientes)

@app.route('/obra', methods=['GET'])
def get_lotes():
    cursor.execute('SELECT * FROM Obra')
    rows = cursor.fetchall()
    lotes = []
    for row in rows:
        lote = {
            'id_obra': row.id_obra,
            'nombre ': row.nombre,
            'fecha_inicio': row.fecha_inicio,
            'fecha_fin': row.fecha_fin
        }
        lotes.append(lote)
    return jsonify(lotes)

@app.route('/sector', methods=['GET'])
def get_riegos():
    cursor.execute('SELECT * FROM Sector')
    rows = cursor.fetchall()
    riegos = []
    for row in rows:
        riego = {
            'id_sector': row.id_sector,
            'id_empleado': row.id_empleado,
            'nombre': row.nombre
        }
        riegos.append(riego)
    return jsonify(riegos)

@app.route('/asignacion', methods=['GET'])
def get_facturas():
    cursor.execute('SELECT * FROM Asignacion')
    rows = cursor.fetchall()
    facturas = []
    for row in rows:
        factura = {
            'id_asignacion': row.id_asignacion,
            'id_empleado': row.id_empleado,
            'id_sector': row.id_sector,
            'id_obra': row.id_obra,
            'fecha_inicio': row.fecha_inicio,
            'fecha_fin': row.fecha_fin
        }
        facturas.append(factura)
    return jsonify(facturas)

if __name__ == '__main__':
    app.run(debug=True)
