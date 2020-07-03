import View from '../view.js';

class List extends View {
  constructor(options = { size: 2 }) {
    super();
    this.index = parseInt(procyon.constructor.param('page') || 0, 0);
    this.length = options.length;
    this.size = options.size;
    this.loader = options.loader;
    this.html = options.html;
    this.showLink = options.showLink;
    this.deleteLink = options.deleteLink;
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
    const show = document.createElement('div');
    show.classList.add('btn-group');
    show.classList.add('btn-group-sm');
    show.setAttribute('role', 'group');
    const showEl = this.showLinkEl(item);
    const delEl = this.deleteLinkEl(item);
    show.appendChild(showEl);
    show.appendChild(delEl);
    el.appendChild(show);
    this.content.appendChild(el);
  }

  deleteLinkEl(item) {
    const deleteLink = this.deleteLink(item);
    return this.constructor.link(deleteLink, 'Delete');
  }

  showLinkEl(item) {
    const showLink = this.showLink(item);
    return this.constructor.link(showLink, 'View');
  }

  static link(showLink, text) {
    const link = document.createElement('a');
    link.innerHTML = text;
    link.classList.add('btn');
    link.classList.add('btn-secondary');
    link.href = showLink;
    return link;
  }

  async renderPagination() {
    if (!this.pagination) {
      this.pagination = document.createElement('nav');
      this.pagination.classList.add('pagination-wrapper');
      const ul = document.createElement('ul');
      ul.classList.add('pagination');
      this.pagination.appendChild(ul);
      this.el.appendChild(this.pagination);
    }
    this.pagination.querySelectorAll('a').forEach((link) => link.remove());
    const ul = this.pagination.querySelector('ul');
    let times = 0;
    const len = await this.length();
    for (let i = 0; i < len; i += this.size) {
      const link = document.createElement('a');
      link.classList.add('page-link');
      link.setAttribute('data-index', times);
      link.innerText = `${times + 1}`;
      link.setAttribute('href', '#');
      link.onclick = this.onPaginationClick.bind(this);
      const li = document.createElement('li');
      li.classList.add('page-item');
      if (times === this.index) {
        li.classList.add('current', 'active');
      }
      li.setAttribute('data-index', times);
      li.appendChild(link);
      ul.appendChild(li);
      times += 1;
    }
  }

  onPaginationClick(event) {
    this.pagination.querySelectorAll('li.current').forEach((el) => el.classList.remove('current', 'active'));
    event.target.classList.add('current', 'active');
    event.target.parentElement.classList.add('current', 'active');
    this.index = parseInt(event.target.dataset.index, 0);
    this.renderItems().then(() => {});
    event.preventDefault();
  }
}

export default List;
