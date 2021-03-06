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

var patternsDict = {};

var config = {
  trigger: '_',
  values: function (text, cb) {
    var prefix = text.startsWith('_') ? '_' : '';
    var values = patterns.map(function (pattern) {
      return {
        name: pattern.name,
        key: pattern.name,
        value: prefix + pattern.name
      }
    });
    cb(values);
  },
  requireLeadingSpace: false,
  replaceTextSuffix: '_',
  noMatchTemplate: function () {
    return '<span style:"visibility: hidden;"></span>';
  },
};

function wrapMatches(string, pattern) {
  regexp = new RegExp(pattern, 'g');
  return string.replace(regexp, function(match) {
    if (arguments.length > 3) {
      for (var i = 1; i < arguments.length - 2; i++) {
        var replace = '<span class="group">' + arguments[i] + '</span>';
        match = match.replace(arguments[i], replace);
      }
      console.log(arguments);
    };
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

function fillPatternsDict() {
  patterns.forEach(function (pattern) {
    patternsDict[pattern.name] = pattern;
  });
};

function escapeRegExp(string) {
  // escape but keep ()
  return string.replace(/[.*+\-?^${}|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function pattern2reg(pattern) {
  var parts = pattern.split('_');
  parts = parts.map(function (part, i) {
    if (i % 2 == 0) {
      return escapeRegExp(part);
    }

    if (part in patternsDict) {
      return '[' + patternsDict[part].pattern + ']';
    }

    throw "Невідомий шаблон: " + part;
  });
  return parts.join('');
};

function showAllert(msg) {
  $('#alert-placeholder').append(
    '<div class="alert alert-warning alert-dismissible fade show">' +
    '  <strong>Шось пішло не так!</strong> ' + msg +
    '  <button type="button" class="close" data-dismiss="alert">' +
    '     <span>&times;</span></button></div>');

  setTimeout(function() {
    $("#alertdiv").remove();
  }, 5000);
};

function run() {
  var pattern = $('#search').val();
  var replace = $('#replace').val();
  var text = $('#sample').val();

  try {
    var reg = pattern2reg(pattern);
    $('#search-result').val(reg);

    var searchPreview = wrapMatches(text, reg);
    $('#search-preview').empty();
    $('#search-preview').append(searchPreview);

    var replaceJs = replace.replace(/\((\d)\)/g, "$$$1");
    var regexp = new RegExp(reg, 'g');
    var replacePreview = text.replace(regexp, replaceJs);
    $('#replace-preview').val(replacePreview);

    var replaceMs = replace.replace(/\((\d)\)/g, "\\$1");
    $('#replace-result').val(replaceMs);
  } catch(e) {
    showAllert(e);
  }
  
};

$(function() {

  var config2 = Object.assign({}, config);
  config2.trigger = '__';
  var tribute = new Tribute(config);
  tribute.attach(document.getElementById("search"));

  new ClipboardJS('.copy-btn');
  $('.copy-btn').click(function(e) {
    var $target = $(e.target);
    $target.tooltip('show');
    setTimeout(function(){ $target.tooltip('hide'); }, 1500);
  });
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  });

  fillPatternsDict();
  fillTemplates();
  $('#run').click(run);
  run();

  $('#templates a').click(function() {
    $('#search').val($(this).text());
    $('#replace').val($(this).attr("title"));
    $('#search').focus();

    return false;
  });
});