from flask import Flask, render_template, request, redirect, session, url_for
import pyodbc

app = Flask(__name__)
app.secret_key = 'tu_clave_secreta_aqui'

# Conexión a la base de datos
conn = pyodbc.connect('DRIVER={SQL Server};SERVER=DESKTOP-BJP2BFE\MSSQLSERVER07;DATABASE=login;UID=sa;PWD=admin')

# Función para el login
def login(username, password):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM usuarios WHERE username = ? AND password = ?", (username, password))
    user = cursor.fetchone()
    return user

# Función para el registro de usuario
def registro(username, password):
    cursor = conn.cursor()
    cursor.execute("INSERT INTO usuarios (username, password) VALUES (?, ?)", (username, password))
    conn.commit()

# Función para obtener todos los usuarios
def get_usuarios():
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM usuarios")
    return cursor.fetchall()

# Función para eliminar usuario
def eliminar_usuario(username):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM usuarios WHERE username = ?", (username,))
    conn.commit()

# Ruta para la página de inicio
@app.route('/')
def index():
    return render_template('index.html')

# Ruta para iniciar sesión
@app.route('/login', methods=['POST'])
def login_route():
    username = request.form['username']
    password = request.form['password']
    user = login(username, password)
    if user:
        session['username'] = username
        return redirect('/admin')
    else:
        return "Nombre de usuario o contraseña incorrectos."

# Ruta para cerrar sesión
@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect('/')

# Ruta para la página de registro
@app.route('/registro_page')
def registro_page():
    return render_template('registro.html')

# Ruta para el registro de usuario
@app.route('/registro', methods=['POST'])
def registro_route():
    username = request.form['username']
    password = request.form['password']
    registro(username, password)
    return "Usuario registrado correctamente."

# Ruta para el panel de administración
@app.route('/admin')
def admin_panel():
    if 'username' not in session:
        return redirect('/')
    usuarios = get_usuarios()
    return render_template('admin.html', usuarios=usuarios)

# Ruta para eliminar usuario
@app.route('/eliminar_usuario', methods=['POST'])
def eliminar_usuario_route():
    if 'username' not in session:
        return redirect('/')
    username = request.form['username']
    eliminar_usuario(username)
    return redirect('/admin')

# Ruta para actualizar usuario (mostrar formulario)
@app.route('/actualizar_usuario/<int:id>')
def actualizar_usuario(id):
    if 'username' not in session:
        return redirect('/')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM usuarios WHERE id = ?", (id,))
    user = cursor.fetchone()
    return render_template('actualizar_usuario.html', user=user)

# Ruta para procesar la actualización de usuario
@app.route('/actualizar_usuario/<int:id>', methods=['POST'])
def actualizar_usuario_route(id):
    if 'username' not in session:
        return redirect('/')
    username = request.form['username']
    password = request.form['password']
    cursor = conn.cursor()
    cursor.execute("UPDATE usuarios SET username = ?, password = ? WHERE id = ?", (username, password, id))
    conn.commit()
    return redirect('/admin')

if __name__ == '__main__':
    app.run(debug=True)
