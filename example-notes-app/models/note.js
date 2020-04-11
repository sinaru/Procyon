import DataModel from '/lib/data-model.js'

class Note extends DataModel {
  get savePath () {
    return 'http://localhost:3000/note/post'
  }

  get updatePath () {
    return 'http://localhost:3000/note/put'
  }

  get batchPath () {
    return 'http://localhost:3000/note/batch'
  }

  get getPath() {
    return 'http://localhost:3000/note/get';
  }
}

Note.all = async () => {
  const note = new Note()
  const response = await axios.get(note.batchPath, { params: { action: 'all' } })
  return response.data.map((item) => new Note(item))
}

Note.count = async () => {
  const notes = await Note.all()
  return notes.length
}

export default Note
