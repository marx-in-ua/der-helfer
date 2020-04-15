var patterns = [
  {
    name: 'літера',
    help: 'Будь-яка літера чи дефіс',
    sample: 'Як-то слово',
    pattern: 'А-ЯҐЇа-яґї\\-',
  },
  {
    name: 'мала',
    help: 'мала літера',
    sample: 'Айн Ренд',
    pattern: 'а-яґї',
  },
  {
    name: 'велика',
    help: 'Велика літера',
    sample: 'Карл Маркс',
    pattern: 'А-ЯҐЇ',
  },
  {
    name: 'голосна',
    help: 'Голосна літера',
    sample: 'Аварія',
    pattern: 'АаЕєЄєИиІіЇїОоУуЮюЯя',
  },
  {
    name: 'приголосна',
    help: 'Приголосна літера чи м`який знак',
    sample: 'Сьогодні',
    pattern: 'БбВвГгҐґДдЖж3зЙйКкЛлМмНнПпРрСсТтФфXхЦцЧчШшЩщЬь',
  },
];

var config = {
  trigger: '_',
  values: patterns,
  replaceTextSuffix: '_',
  lookup: 'name',
  fillAttr: 'name',
};

function wrapMatches(string, pattern) {
  regexp = new RegExp(pattern, 'g');
  return string.replace(regexp, function(match) {
    return '<span class="match">' + match + '</span>'
  });
};

function fillTemplates() {
  $body = $('#templates tbody');
  patterns.forEach(function (pattern) {
    var sample = wrapMatches(pattern.sample, '[' + pattern.pattern +']');
    $body.append('<tr><td>_' + pattern.name +'_</td><td>' +
                  pattern.help + '</td><td>' + sample + '</td></tr>');
  });
};

$(function() {
  var tribute = new Tribute(config);
  tribute.attach(document.getElementById("search"));

  fillTemplates();
});