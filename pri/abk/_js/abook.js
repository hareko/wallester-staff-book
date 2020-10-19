/**
 * editor/browser class
 *
 * @package     Application
 * @author      Vallo Reima
 * @copyright   (C)2020
 * 
 * @param {string} fid - form id 
 */

function Abook(fid) {
  var frm;        /* form object */
  var evs = [];   /* events stack */
  var rst = [];   /* reset values */
  var xhr;        /* xhr params */
  var dpr;        /* date picker object */
  var url = ts.Get('url');
  var lng = ts.Get('lng');
  var set = {
    asc: ts.Get('asc'), /* sort ascending token */
    dsc: ts.Get('dsc'), /* sort descending token */
    ord: {}, /* select order */
    dats: ts.Get('dats'), /* date format */
    wsuf: ts.Get('wsuf'), /* Sunday 1st flag */
    pfrm: 0, /* pagination offset */
    pcnt: ts.Get('pgc'), /* pagination rec count */
    psze: null            /* table rec count */
  };


  /**
   * set events and view status
   */
  var Init = function () {
    frm = new Forms(fid);
    frm.Init({fname: CnvName, lname: CnvName});
    $('l_address').style.fontStyle = 'italic';
    $$('browse', 'div')[0].style.height = $(fid).scrollHeight + 'px';
    var a = $$('command', 'button');
    for (var i = 0; i < a.length; i++) {
      evs.push([a[i], 'click', Command]);
    }
    evs.push([$('pagin'), 'click', Pagin]);
    evs.push([$('id0', ), 'click', Sort]);
    evs.push([$('birth'), 'click', PickDate]);
    Events(true);
    Order();
    Switch('');
    $('command').className = 'command';
    $('pagin').className = 'pagin';
    xhr = {asn: true, fnc: Response, mtr: $('msgraw'), txt: ts.Get('prpmt')};
  };

  /**
   * process the pagination command
   * @param {object} evt button event
   */
  var Pagin = function (evt) {
    var trg = Target(evt);
    StopEvent(evt);
    var cmd = trg.name;
    if (cmd === 'TP') {
      set.pfrm = 0;
    } else if (cmd === 'BW') {
      set.pfrm = set.pfrm - set.pcnt;
    } else if (cmd === 'FW') {
      set.pfrm = set.pfrm + set.pcnt;
    } else if (cmd === 'BT') {
      set.pfrm = set.psze - set.psze % set.pcnt;
    }
    Command('B');
  };

  /**
   * process the command
   * @param {object} evt   button event
   */
  var Command = function (evt) {
    var cmd, c, a;
    if (IsArray(evt)) {
      cmd = evt[0];
    } else if (typeof evt === 'object') {
      var trg = Target(evt);
      StopEvent(evt);
      cmd = trg.name;
    } else {
      cmd = evt;
    }
    var id = frm.Get('id');
    if (ts.bsy) {
    } else if (cmd === 'A') { /* Add */
      a = frm.Gets();
      for (c in a) {
        frm.Set(c, '');
      }
      Switch('addg');
    } else if (cmd === 'M') { /* Modify */
      Switch('mdfg');
    } else if (cmd === 'U') { /* Undelete */
      Switch('undg');
    } else if (cmd === 'D') { /* Delete */
      if (confirm(ts.Get('delcfm'))) {
        Edit(cmd);
      }
    } else if (cmd === 'Q') { /* Quit */
      Finish();
    } else if (cmd === 'R') { /* Reset */
      for (c in rst) {
        frm.Set(c, rst[c]);
      }
    } else if (cmd === 'CC') {  /* Cancel */
      if (ts.sts === 'F') {
        Command('B');
      } else {
        Switch('');
      }
    } else if (cmd === 'S') { /* Save */
      if (Empty(id)) {
        c = 'A';
      } else if (Number(id) > 0) {
        c = 'M';
      } else {
        c = 'U';
      }
      Edit(c);
    } else if (cmd === 'B') { /* browse */
      c = IsArray(evt) ? evt[1] : '';
      a = {lng: lng, srv: 'brw', cmd: 'B', ord: set.ord, frm: set.pfrm};
      ts.bsy = true;
      XHRJSON(url, a, xhr);
    } else if (cmd === 'F') { /* Find */
      if (ts.sts === 'F') {
        a = {lng: lng, srv: 'brw', cmd: 'F', fld: {fname: frm.Get('fname'), lname: frm.Get('lname')}};
        ts.bsy = true;
        XHRJSON(url, a, xhr);
      } else {
        Switch('schg', 'F');
      }
    } else if (cmd === 'O') { /* Output */
      a = {lng: lng, srv: 'brw', cmd: 'O'};
      ts.bsy = true;
      XHRJSON(url, a, xhr);
    } else if (cmd === 'CL') {  /* Close */
      Close();
    }
  };

  /** 
   * process the change command
   * @param {string} cmd -- command - A,D,M,U
   */
  var Edit = function (cmd) {
    var f = '';
    var a = frm.Gets();
    var fld = {};
    for (var c in a) {
      if (IsBlank(a[c].val) && c !== 'id') {
        if ($('l_' + c).style.fontStyle === 'italic') {
          fld[c] = null;
          frm.SetError(c, '');
        } else {
          f = ts.Get('msd');
          frm.SetError(c, f);
        }
      } else {
        fld[c] = frm.Get(c);
        frm.SetError(c, '');
      }
    }
    if (f === '') {
      for (c in fld) {
        if (c === 'email' && !IsEmail(fld[c])) {
          f = ts.Get('wrd');
          frm.SetError(c, f);
        } else if (c === 'birth' && ShortDate(fld[c]) === null) {
          f = ts.Get('wrd');
          frm.SetError(c, f);
        }
      }
    }
    $('msgraw').innerHTML = f;
    if (f === '') {
      var a = {lng: lng, srv: 'edt', cmd: cmd, fld: fld};
      ts.bsy = true;
      XHRJSON(url, a, xhr);
    }
  };

  /**  
   * row doubleclick
   * @param {object} event 
   */
  var Select = function (event) {
    var trg = Target(event).parentNode;
    StopEvent((event));
    if (trg.tagName.toLowerCase() === 'tr') {
      var id = trg.id.replace('id', '');
      var a = {lng: lng, srv: 'edt', cmd: 'S', fld: {id: id}};
      ts.bsy = true;
      XHRJSON(url, a, xhr);
    }
  };

  /**  
   * async request return
   * @param {object} rlt -- XHR result
   * @param {object} par -- calling parameters
   */
  var Response = function (rlt, par) {
    ts.bsy = false;
    var c = '';
    if (!rlt || !rlt.code) {
      c = ts.Get('noxhr');
    } else if (rlt.code !== 'ok') {
      c = rlt.string;
    } else if (par.srv === 'edt' || par.cmd === 'F') {
      c = rlt.string;
      if (par.cmd === 'S' || par.cmd === 'F') {
        Close(rlt.factor);
      } else {
        frm.Set('id', rlt.factor);
        Switch('');
      }
    } else if (par.cmd === 'B') {
      set.psze = rlt.factor;
      Browse(rlt.string);
    } else if (par.cmd === 'O') {
      c = rlt.string;
      $('filename').value = rlt.factor;
      $('transit').submit();
    }
    $('msgraw').innerHTML = c;
  };

  /** 
   * browse the contacts
   * @param {string} htm -- table
   */
  var Browse = function (htm) {
    $('tabbody').innerHTML = htm;
    var evt = [$('tabbody'), 'dblclick', Select];
    evs.push(evt);
    Events(true, [evt]);
    Switch('brng', 'B');
    var dsa;
    if (set.pfrm === 0) {
      dsa = ['TP', 'BW'];
    } else if (set.pfrm + set.pcnt >= set.psze) {
      dsa = ['BT', 'FW'];
    } else {
      dsa = [];
    }
    var a = $$('pagin', 'button');
    for (var i = 0; i < a.length; i++) {
      a[i].disabled = ArraySearch(a[i].name, dsa) !== false;
    }
    $('browse').className = 'browse';
  };

  /**  
   * close browsing, update fields
   * @param {object} row -- selected row data
   */
  var Close = function (row) {
    var evt = [evs.pop()];
    Events(false, evt);
    $('browse').style.display = 'none';
    $(fid).style.display = '';
    if (row) {
      for (var c in row) {
        frm.Set(c, row[c]);
        frm.SetError(c, '');
      }
    }
    Switch('');
  };

  /**
   * switch edit/view/browse
   * @param {text} pmt -- status text
   *                        '' - exit edit
   * @param {text} cmd
   */
  var Switch = function (pmt, cmd) {
    var shw;
    if (pmt === '') {
      var id = frm.Get('id');
      if (Empty(id)) {
        shw = ['A', 'B', 'Q'];
      } else if (Number(id) < 0) {
        shw = ['A', 'U', 'B', 'Q'];
      } else {
        shw = ['A', 'M', 'D', 'B', 'Q'];
      }
      $$('l_birth', 'img')[0].style.display = 'none';
      $('pagin').style.display = 'none';
      var o = $$(fid, 'tr');
      for (var i = 0; i < o.length; i++) {
        o[i].style.display = '';
      }
      ts.sts = 'V';
    } else if (cmd === 'F') {
      shw = ['F', 'CC'];
      $('browse').style.display = 'none';
      $('pagin').style.display = 'none';
      var o = $$(fid, 'tr');
      for (var i = 0; i < o.length; i++) {
        o[i].style.display = o[i].className === 'find' ? '' : 'none';
      }
      $(fid).style.display = '';
      ts.sts = 'F';
    } else if (cmd === 'B') {
      shw = ['F', 'O', 'CL', 'Q'];
      $(fid).style.display = 'none';
      $('browse').style.display = '';
      $('pagin').style.display = '';
      ts.sts = 'B';
    } else {
      var a = frm.Gets();
      for (var c in a) {
        rst[c] = frm.Get(c);
      }
      Gender(rst['gender'] === '');
      shw = ['R', 'CC', 'S'];
      $$('l_birth', 'img')[0].style.display = '';
      ts.sts = 'E';
    }
    $('section').innerHTML = pmt === '' ? '' : ts.Get(pmt);
    $('msgraw').innerHTML = '';
    frm.Enable(pmt !== '');
    var a = $$('command', 'button');
    for (var i = 0; i < a.length; i++) {
      a[i].style.display = ArraySearch(a[i].name, shw) === false ? 'none' : '';
    }
    if (ts.sts === 'E') {
      $('fname').focus();
    }
  };

  /**
   * add/remove empty option
   * @param {bool} flg -- true - add
   */
  var Gender = function (flg) {
    var obj = $('gender');
    var i = obj.options.length - 1;
    var val = obj.options[i].value;
    if (val !== '' && flg) { //add empty option
      obj.options[i + 1] = new Option('', '');
      obj.selectedIndex = i + 1;
    } else if (val === '' && !flg) { //remove empty option
      obj.remove(i);
    }
  };

  /** 
   * terminate
   */
  var Finish = function () {
    var a = {lng: lng, act: 'end'};
    xhr.asn = false;
    ts.bsy = true;
    var r = XHRJSON(url, a, xhr);
    if (r && r.htm) {
      Events(false);
      document.body.innerHTML = r.htm;
    } else {
      $('msgraw').innerHTML = ts.Get('noxhr');
      ts.bsy = false;
    }
  };

  /**  att/detach events
   * @param {bool} flg -- true - att
   *                      false - det
   * @param {mixed} evt -- specific events
   */
  var Events = function (flg, evt) {
    var f = flg ? AttachEventListener : DetachEventListener;
    var e = evt ? evt : evs;
    for (var i in e) {
      f(e[i][0], e[i][1], e[i][2]);
    }
  };

  /**
   * normalise person name
   * @param {string} id - name id
   */
  var CnvName = function (id) {
    var c = NormName(frm.Get(id));
    frm.Set(id, c);
  };


  /**
   * change sorting token
   * @param {object} evt
   */
  var Sort = function (evt) {
    var trg = Target(evt);
    StopEvent(evt);
    if (trg.tagName.toLowerCase() === 'th') {
      var nme = trg.innerHTML;
      if (nme.indexOf(set.dsc) + 1) {
        trg.innerHTML = nme.replace(set.dsc, set.asc);
      } else if (nme.indexOf(set.asc) + 1) {
        trg.innerHTML = nme.replace(set.asc, set.dsc);
      } else {
        trg.innerHTML = nme + '<span>' + set.asc + '</span>';
      }
    }
    Order(trg.getAttribute('name'));
    Command('B');
  };

  var Order = function (name) {
    var ord = {};
    var hds = $$('tabhead', 'th');
    if (name) {
      Order0(hds, name, true, ord);
      Order0(hds, name, false, ord);
    } else {
      Order0(hds, name, null, ord);
    }
    set.ord = ord;
  };

  var Order0 = function (hds, name, flg, ord) {
    for (var i = 1; i < hds.length; i++) {
      var nme = hds[i].getAttribute('name');
      var srt = '';
      if (flg === null || (flg === true && nme === name) || (flg === false && nme !== name)) {
        if (hds[i].innerHTML.indexOf(set.asc) + 1) {
          srt = set.asc;
        } else if (hds[i].innerHTML.indexOf(set.dsc) + 1) {
          srt = set.dsc;
        }
        if (srt) {
          ord[nme] = srt;
        }
      }
    }
  };

  var PickDate = function (evt) {
    var trg = Target(evt);
    StopEvent(evt);
    dpr = new DatePick(trg.id, set.wsuf, PickedDate);
    var dte = frm.Get(trg.id);
    if (!dte) {
      dte = ShortDate(new Date($('year').options[$('year').options.length - 1].value));
    }
    dpr.Init('datepick', ShortDate(dte));
  };

  /**
   * check the date correctness
   * in:  dat -- array - date picked
   *              false - cancelled
   */
  var PickedDate = function (dat, id)
  {
    if (dat) {
      frm.Set(id, ShortDate(dat));
      frm.SetError(id);
    }
    dpr = null;
  };

  /**
   * check/form short date according to a pattern
   * @param {mixed} date -- string -- check date
   *             array - [day,month,year] strings '01' '12' '2011'
   *              else date object
   * @param {string} dats -- date format
   *              not set - default
   */
  function ShortDate(date, dats) {
    var fmts = {
      dmy: 'dd#mm#yy',
      dmyy: 'dd#mm#yyyy',
      ymd: 'yy#mm#dd',
      yymd: 'yyyy#mm#dd'
    };
    if (!IsSet(dats)) {
      dats = set.dats;
    }
    var fmt = dats.substr(1);
    var dlr = dats.substr(0, 1);
    dats = fmts[fmt].replace(/#/g, dlr);
    if (typeof date === 'string') {
      var d = [];
      d[0] = Number(date.substr(dats.indexOf('dd'), 2));
      d[1] = Number(date.substr(dats.indexOf('mm'), 2)) - 1;
      if (dats.indexOf('yyyy') + 1) {
        var c = date.substr(dats.indexOf('yyyy'), 4);
        if (c.length === 4) {
          d[2] = Number(c);
        } else {
          d[2] = 0;
        }
      } else {
        d[2] = Number('20' + date.substr(dats.indexOf('yy'), 2));
      }
      var dat = new Date(d[2], d[1], d[0]);
      if (d[2] !== dat.getFullYear() || d[1] !== dat.getMonth() || d[0] !== dat.getDate()) {
        dat = null;
      }
    } else {
      if (IsArray(date)) {
        d = date;
      } else {
        d = [date.getDate(), date.getMonth() + 1, date.getFullYear()];
      }
      d[0] = Pad(d[0], 2, '0', 1);
      d[1] = Pad(d[1], 2, '0', 1);
      d[2] = String(d[2]);
      dat = dats.replace('dd', d[0]).replace('mm', d[1]);
      if (dats.indexOf('yyyy') + 1) {
        dat = dat.replace('yyyy', d[2]);
      } else {
        dat = dat.replace('yy', d[2].substr(2));
      }
    }
    return dat;
  }

  Init();
}
