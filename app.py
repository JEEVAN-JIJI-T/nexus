from flask import Flask, render_template, request, redirect, session
import json, os
from werkzeug.utils import secure_filename

app = Flask(__name__, template_folder='templates', static_folder='static')
app.secret_key = "adminsecret"

# =========================
# HELPERS
# =========================

def load_json(file):
    if not os.path.exists(file):
        return {}
    with open(file) as f:
        return json.load(f)

def save_json(file, data):
    with open(file, 'w') as f:
        json.dump(data, f, indent=2)

def load_enquiries():
    if not os.path.exists('enquiries.json'):
        return []
    with open('enquiries.json') as f:
        return json.load(f)

def save_enquiries(data):
    with open('enquiries.json', 'w') as f:
        json.dump(data, f, indent=2)

# =========================
# ADMIN PROTECTION
# =========================

def admin_required(func):
    def wrapper(*args, **kwargs):
        if not session.get('admin'):
            return redirect('/admin/login')
        return func(*args, **kwargs)
    wrapper.__name__ = func.__name__
    return wrapper

# =========================
# MAIN ROUTES
# =========================

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/programs')
def programs():
    config = load_json('config.json')
    return render_template('programs.html',
        enable_payments=config.get('payments_enabled', False)
    )

@app.route('/gallery')
def gallery():
    gallery_path = 'static/assets/gallery'
    if not os.path.exists(gallery_path):
        os.makedirs(gallery_path)

    images = os.listdir(gallery_path)
    return render_template('gallery.html', images=images)

# =========================
# CONTACT (UPDATED WITH COURSE)
# =========================

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')
        course = request.form.get('course')

        enquiries = load_enquiries()

        enquiries.append({
            "name": name,
            "email": email,
            "message": message,
            "course": course
        })

        save_enquiries(enquiries)

        return render_template('contact.html', success=True, course=course)

    course = request.args.get('course')
    return render_template('contact.html', course=course)

@app.route('/about')
def about():
    return render_template('about.html')

# =========================
# ADMIN ROUTES
# =========================

@app.route('/admin/login', methods=['GET','POST'])
def admin_login():
    if request.method == 'POST':
        if request.form.get('username') == 'admin' and request.form.get('password') == '1234':
            session['admin'] = True
            return redirect('/admin')
    return render_template('admin_login.html')

@app.route('/admin')
@admin_required
def admin_dashboard():
    gallery_path = 'static/assets/gallery'

    if not os.path.exists(gallery_path):
        os.makedirs(gallery_path)

    images = os.listdir(gallery_path)
    config = load_json('config.json')
    enquiries = load_enquiries()

    return render_template('admin_dashboard.html',
        images=images,
        config=config,
        enquiries=enquiries
    )

@app.route('/admin/toggle', methods=['POST'])
@admin_required
def toggle():
    config = load_json('config.json')
    config['payments_enabled'] = not config.get('payments_enabled', False)
    save_json('config.json', config)
    return redirect('/admin')

@app.route('/admin/upload', methods=['POST'])
@admin_required
def upload():
    file = request.files.get('image')

    if file:
        filename = secure_filename(file.filename)
        gallery_path = 'static/assets/gallery'

        if not os.path.exists(gallery_path):
            os.makedirs(gallery_path)

        file.save(os.path.join(gallery_path, filename))

    return redirect('/admin')

@app.route('/admin/delete/<name>')
@admin_required
def delete(name):
    path = os.path.join('static/assets/gallery', name)
    if os.path.exists(path):
        os.remove(path)
    return redirect('/admin')

# =========================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000, debug=True)