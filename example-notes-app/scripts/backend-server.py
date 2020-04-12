from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

class Note:
    def __init__(self, content):
        global notes_count
        notes_count = notes_count + 1
        self.content = content
        self.id = notes_count

notes = []
notes_count = 0

example_notes = [
    'I stepped on a Corn Flake, now I\'m a Cereal Killer',
    'Thank you for noticing this list, your noticing has been noticed',
    'There\'s a purple mushroom in my backyard, screaming Taco\'s!',
    'Don\'t touch my crayons, they can smell glue',
    'Buffalo buffalo Buffalo buffalo buffalo buffalo Buffalo buffalo.',
    'Rose rose to put rose roes on her rows of roses.',
    'The man the professor the student has studies Rome.'
]

for example in example_notes:
    notes.append(Note(example))

def find(list, func):
    for item in list:
        if func(item):
            return item

    return None




@app.route('/note/get')
def get_note():
    id = int(request.args['id'])
    func = lambda item: item.id is id
    found = find(notes, func)
    return jsonify(id=found.id, content=found.content)


@app.route('/note/batch')
def get_batch():
    if request.args['action'] == 'all':
        notes_map = map(lambda item: {'id': item.id, 'content': item.content}, notes)
        notes_list = list(notes_map)
        return jsonify(notes_list)


@app.route('/note/post', methods=['POST'])
def post_note():
    note = Note(request.json['content'])
    global notes
    notes.append(note)
    return jsonify(id=note.id, content=note.content)


@app.route('/note/put', methods=['POST'])
def update_note():
    id = int(request.json['id'])
    func = lambda item: item.id is id
    global notes
    found = find(notes, func)
    found.content = request.json['content']
    return jsonify(id=found.id, content=found.content)
