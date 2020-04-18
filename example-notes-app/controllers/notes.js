import defaultExport from '/lib/controller.js'
import List from '/lib/components/list.js'
import Note from '../models/note.js'

export default class NotesController extends defaultExport {
  async index () {
    this.addStyle('notes')
    const note = new Note()
    const notesList = this.notesList()
    const view = await this.render('notes/index', {
      model: note, components: {
        notesList
      }
    })

    note.when('saved').then(() => view.render());
  }

  async show(id) {
    const note = await Note.find(id)
    await this.render('notes/show', { model: note })
  }

  async delete(id) {
    const note = await Note.find(id)
    const response = await note.delete()
    if (response) {
      procyon.visit('notes')
    }
    else {
      throw new Error('Failed to delete record')
    }
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
        showLink: function(item) {
          return procyon.pathUrl('notes/show', {id: item.get('id')})
        },
        deleteLink: function(item) {
          return procyon.pathUrl('notes/delete', {id: item.get('id')})
        },
        loader: async (offset, limit) => {
          const notes = await Note.all()
          return notes.slice(offset, offset + limit)
        }
      }
    )
  }
}
