import View from '../view.js';

class List extends View {
  constructor(options = { size: 2 }) {
    super();
    this.index = parseInt(procyon.constructor.param('page') || 0, 0);
    this.length = options.length;
    this.size = options.size;
    this.loader = options.loader;
    this.html = options.html;
    this.showLink = options.showPath;
    if (options.cssClass) this.cssClass = options.cssClass;
  }

  async render() {
    if (!this.el) {
      this.el = document.createElement('div');
      this.el.classList.add('list-component');
      if (this.cssClass) {
        this.el.classList.add(this.cssClass);
      }
    }

    await this.renderItems();
    await this.renderPagination();
  }

  async renderItems() {
    if (!this.content) {
      this.content = document.createElement('div');
      this.content.classList.add('items');
      this.el.appendChild(this.content);
    } else {
      this.content.innerHTML = '';
    }
    const items = await this.loader(this.index * this.size, this.size);
    items.forEach((item) => this.renderItem(item));
  }

  renderItem(item) {
    const el = this.html(item);
    el.classList.add('item');
    const show = document.createElement('span');
    const showLink = this.showLink(item);
    const link = document.createElement('a');
    link.innerHTML = 'view';
    link.href = showLink;
    show.appendChild(link);
    el.appendChild(show);
    this.content.appendChild(el);
  }

  async renderPagination() {
    if (!this.pagination) {
      this.pagination = document.createElement('div');
      this.pagination.classList.add('pagination');
      this.el.appendChild(this.pagination);
    }
    this.pagination.querySelectorAll('a').forEach((link) => link.remove());

    let times = 0;
    const len = await this.length();
    for (let i = 0; i < len; i += this.size) {
      const link = document.createElement('a');
      if (times === this.index) link.classList.add('current');
      link.setAttribute('data-index', times);
      link.innerText = `${times + 1}`;
      link.setAttribute('href', '#');
      link.onclick = this.onPaginationClick.bind(this);
      this.pagination.appendChild(link);
      times += 1;
    }
  }

  onPaginationClick(event) {
    this.pagination.querySelectorAll('a.current').forEach((el) => el.classList.remove('current'));
    event.target.classList.add('current');
    this.index = parseInt(event.target.dataset.index, 0);
    this.renderItems().then(() => {});
    event.preventDefault();
  }
}

export default List;
