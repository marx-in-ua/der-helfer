var patterns = [
  {
    name: 'літера',
    help: 'Будь-яка літера чи дефіс.',
    samples: 'A р ґ -',
    pattern: 'А-ЯҐа-яґ\\-',
  },
  {
    name: 'мала',
    help: 'Будь-яка літера чи дефіс.',
    samples: 'A р г',
    pattern: 'А-ЯҐа-яґ',
  },
];

var values = patterns.map(p => p.name);

var tribute = new Tribute({
  trigger: '_',
  values: patterns,
  replaceTextSuffix: '_',
  lookup: 'name',
  fillAttr: 'name',
})

tribute.attach(document.getElementById("search"));