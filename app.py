from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder='../frontend')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bpv_dashboard.db'
app.config['UPLOAD_FOLDER'] = 'uploads'
CORS(app)
db = SQLAlchemy(app)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    deadline = db.Column(db.Date)
    priority = db.Column(db.String(20))
    status = db.Column(db.String(50))

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'deadline': str(self.deadline),
            'priority': self.priority,
            'status': self.status
        }

@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])

@app.route('/api/upload', methods=['POST'])
def upload_document():
    if 'file' not in request.files:
        return jsonify({'error': 'Geen bestand ontvangen'}), 400
    
    file = request.files['file']
    description = request.form.get('description', '')
    
    if file.filename == '':
        return jsonify({'error': 'Geen bestandsnaam'}), 400
    
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        return jsonify({
            'message': 'Bestand succesvol geüpload',
            'filename': filename,
            'description': description
        })

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    with app.app_context():
        db.create_all()
    app.run(debug=True)