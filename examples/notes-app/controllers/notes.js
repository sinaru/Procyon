import { Controller, List } from '/dist/procyon.js';
import Note from '../models/note.js';

export default class NotesController extends Controller {
  async index() {
    this.addStyle('notes');
    const note = new Note();
    const notesList = this.constructor.notesList();
    await this.render('notes/index', {
      model: note,
      components: {
        notesList,
      },
    });

    note.when('saved').then(() => procyon.constructor.reload());
  }

  async show(id) {
    const note = await Note.find(id);
    await this.render('notes/show', { model: note });
  }

  // eslint-disable-next-line class-methods-use-this
  async delete(id) {
    const note = await Note.find(id);
    const response = await note.delete();
    if (response) {
      procyon.visit('notes');
    } else {
      throw new Error('Failed to delete record');
    }
  }

  static notesList() {
    return new List(
      {
        size: 3,
        cssClass: 'notes-list',
        async length() {
          return Note.count();
        },
        html(item) {
          const el = document.createElement('div');
          el.innerHTML = `<p>${item.get('content')}</p>`;
          return el;
        },
        showLink(item) {
          return procyon.pathUrl('notes/show', { id: item.get('id') });
        },
        deleteLink(item) {
          return procyon.pathUrl('notes/delete', { id: item.get('id') });
        },
        loader: async (offset, limit) => {
          const notes = await Note.all();
          return notes.slice(offset, offset + limit);
        },
      },
    );
  }
}
