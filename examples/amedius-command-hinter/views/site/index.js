import { View } from '/procyon.js';

class CodeRetriever {
  constructor() {
    this.url = `${procyon.config.apiUrl}/code/search`;
  }

  async results(query, parent_code = null) {
    const url = new URL(this.url);
    url.searchParams.set('q', query);
    const response = await axios.get(this.url, { params: { q: query, parent_code } });
    return response.data;
  }
}

export default class extends View {
  constructor() {
    super();
    this.codes = [];
  }

  get templatePath() {
    return 'site/index';
  }

  bindings() {
    this.bind('#searchInput', 'onchange', this.onContentChange.bind(this));
  }

  async onContentChange(event) {
    const retriever = new CodeRetriever();
    const results = await retriever.results(event.target.value, this.codes.length > 0 ? this.codes[this.codes.length - 1] : null);
    const resultsEl = this.el.querySelector('#results');
    resultsEl.innerHTML = '';

    if (results.length === 0) {
      return;
    }
    for (const result of results) {
      const el = document.createElement('div');
      el.innerHTML = `
          <p><button type="button" class="btn btn-primary btn-sm" data-code="${result.code}">+</button>
          <b>${result.code}</b> - ${result.description}</p>
          </span>
      `;

      el.querySelector('button').onclick = this.onAddClick.bind(this);

      resultsEl.appendChild(el);
    }
  }

  onAddClick(ev) {
    const { code } = ev.target.dataset
    this.addCode(code)
  }
  addCode(code) {
    this.codes.push(code);
    this.el.querySelector('.current-command').innerHTML = `${this.codes.join(' ')}`;
  }
}
