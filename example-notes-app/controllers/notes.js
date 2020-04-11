import defaultExport from '/lib/controller.js'
import List from '/lib/components/list.js'
import Note from '../models/note.js'

export default class NotesController extends defaultExport {
  async index () {
    this.addStyle('notes')
    const note = new Note()
    const notesList = this.notesList()
    await this.render('notes/index', {
      model: note, data: { note }, components: {
        notesList
      }
    })
  }

  async show(id) {
    const note = await Note.find(id)
    await this.render('notes/show', { model: note })
  }

  notesList() {
    return new List(
      {
        size: 3,
        cssClass: 'notes-list',
        length: async function () {
          return Note.count()
        },
        html: function (item) {
          const el = document.createElement('div')
          el.innerHTML = `<p>${item.get('content')}</p>`
          return el
        },
        showPath: function(item) {
          return procyon.pathUrl('notes/show', {id: item.get('id')})
        },
        loader: async (offset, limit) => {
          const notes = await Note.all()
          return notes.slice(offset, offset + limit)
        }
      }
    )
  }
}
