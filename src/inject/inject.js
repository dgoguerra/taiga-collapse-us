chrome.extension.sendMessage({}, function(response) {
  function attempt(opts, fun, next) {
    var nextTimeout = typeof opts.initial !== 'undefined' ? opts.initial : 500;
    var increment = opts.increment || 500;

    function nextRetry() {
      // console.log('next retry in '+nextTimeout+'ms');
      setTimeout(function() {
        fun(function(err, res) {
          if (err) {
            return nextRetry();
          }
          next(res);
        });
      }, nextTimeout);

      nextTimeout += increment;
    }

    nextRetry();
  }

  function hasClass(elem, className) {
    return (' '+elem.className+' ').indexOf(' '+className+' ') > -1;
  }

  function getButtons(folded) {
    var rows = document.getElementsByClassName('task-row'),
      btnClass = folded ? 'vunfold' : 'vfold',
      found = [];

    for (var i = 0; i < rows.length; i++) {
      var btn = rows[i].getElementsByClassName(btnClass)[0];

      if (!hasClass(btn, 'hidden')) {
        found.push(btn);
      }
    }

    return found;
  }

  function fireEvent(elem, evtType) {
    if (elem.fireEvent) {
      elem.fireEvent('on' + evtType);
    } else {
      var evObj = document.createEvent('Events');
      evObj.initEvent(evtType, true, false);
      elem.dispatchEvent(evObj);
    }
  }

  var tblHeader = null;

  // wait for the document to be ready and for Angular
  // to load the taskboard table
  attempt({
    initial: 10,
    increment: 100
  }, function(next) {
    // try to find the table's header we are going to add events to.
    // may not exist yet, its created through Angular
    tblHeader = document.querySelector('.taskboard-table-inner h2');

    var stillWaiting = tblHeader === null
      || document.readyState !== 'complete';

    next(stillWaiting);
  }, function() {
    // the page is loaded, setup everything

    tblHeader.style.cursor = 'pointer';

    tblHeader.addEventListener('click', function() {
      var buttons = getButtons(false);

      if (!buttons.length) {
        buttons = getButtons(true);
      }

      buttons.forEach(function(btn) {
        fireEvent(btn, 'click');
      });
    });
  });
});