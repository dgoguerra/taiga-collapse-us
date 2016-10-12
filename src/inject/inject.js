chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState !== 'complete') {
      return;
    }

    clearInterval(readyStateCheckInterval);

    // this part of the script triggers when page is done loading

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

    var tblHeader = document.querySelector('.taskboard-table-inner h2');

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

  }, 10);
});