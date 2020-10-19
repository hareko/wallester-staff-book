/**
 * datepick class
 *
 * @package     Solution
 * @author      Vallo Reima
 * @copyright   (C)2012
 */
function DatePick(did, wsf, clb)
  /*
   *  in: did -- date field id 
   *      wsf -- Sunday first flag
   *      clb -- callback
   */
  {
    var cal;        /* calendar object */
    var calbdy;     /* calendar body object */
    var calwdt;     /* calendar width */
    var events;     /* calendar events */
    var omonth;     /* month selector object */
    var oyear;      /* year selector object */
    var days;       /* day numbers */
    var that = this;

    /* constructor */
    days = [1, 2, 3, 4, 5, 6];
    if (wsf) {
      days.unshift(0);   /* Sunday 1st */
    } else {
      days.push(0);    /* Monday 1st */
    }

    that.Init = function(fid, dto)
      /*
       *  in: fid -- form id
       *      dto -- current date object
       */
      {
        cal = $(fid);
        calbdy = $$(cal, 'tbody')[0];
        events = [[$$(document, 'body')[0], 'mousedown', Command], [calbdy, 'click', Command]];
        var d = dto ? dto : new Date();
        var a = $$(cal, 'select');
        for (var i = 0; i < a.length; i++) {
          if (a[i].name == 'month') {
            omonth = a[i];
            omonth.value = d.getMonth();
            events.push([omonth, 'change', Command]);
          } else if (a[i].name == 'year') {
            oyear = a[i];
            oyear.value = CheckYear(d.getFullYear());
            events.push([oyear, 'change', Command]);
          }
        }
        a = $$(cal, 'button');
        for (i = 0; i < a.length; i++) {
          events.push([a[i], 'click', Command]);
        }
        Create(d.getDate());
        Setup(null);
      };

    var Setup = function(flg)
      /*
       * activate/deactivate
       * in:  flg -- null - open
       *             true - save
       *             false - cancel
       */
      {
        if (flg === null) {
          for (var i = 0; i < events.length; i++) {
            AttachEventListener(events[i][0], events[i][1], events[i][2]);
          }
          cal.style.display = 'block';
          calwdt = cal.offsetWidth;
          Adjust();
        } else {
          for (i = 0; i < events.length; i++) {
            DetachEventListener(events[i][0], events[i][1], events[i][2]);
          }
          cal.style.display = 'none';
          clb(flg, did);
        }
      };

    var Adjust = function()
      /*
       * adjust a calendar position
       */
      {
        var o = $(did);
        var a = FindPos(o);
        var i = o.offsetWidth;
        var j = 0;
        if (a[0] + i + calwdt > Width()) {
          i = 0;
          j = o.offsetHeight;
          if (a[1] + j + cal.offsetHeight > Height()) {
            j = -(j + cal.offsetHeight);
          }
        }
        cal.style.left = (a[0] + i) + 'px';
        cal.style.top = (a[1] + j) + 'px';
      };

    var Create = function(day)
      /*
       * form the calendar of month/year
       * in:  day -- current day
       *              not set 
       */
      {
        var month = parseInt(omonth.value);
        var year = parseInt(oyear.value);
        if (!IsSet(day)) {
          day = 0;
        }
        var tod = new Date();
        if (month == tod.getMonth() && year == tod.getFullYear()) {
          tod = tod.getDate();
        } else {
          tod = 0;
        }
        var lday = new Date(year, month + 1, 0).getDate();
        var sday = ArraySearch(new Date(year, month, 1).getDay(), days);
        var d = 1;
        var f = null;
        while (calbdy.rows.length > 0) {
          calbdy.deleteRow(0);
        }
        while (d <= lday) {
          var tr = calbdy.insertRow(-1);
          var td = tr.insertCell(-1);
          td.className = 'weekno';
          var c = new Date(year, month, d).getWeek();
          td.innerHTML = Pad(c, 2, '0', 1);
          for (var i = 0; i < days.length; i++) {
            if (d > lday) {
              f = false;
            } else if (f === null && sday === i) {
              f = true;
            }
            td = tr.insertCell(-1);
            if (f) {
              c = 'dayP';
              if (d === tod)
                c += ' dayT';
              if (d === day)
                c += ' dayS';
              td.className = c;
              td.innerHTML = Pad(d, 2, '0', 1);
              d++;
            } else {
              td.innerHTML = '&nbsp;';
            }
          }
          f = true;
        }
      };

    var CheckYear = function(val)
      /*
       * check a year existness, insert if missing
       * in:  val - year value
       */
      {
        var v = String(val);
        var c = '';
        var j = null;
        var a = oyear.options;
        for (var i = 1; i < a.length; i++) {
          if (a[i - 1].value == v) {
            c = v;
            break;
          } else if (v > a[i - 1].value && v < a[i].value) {
            j = i;
            break;
          }
        }
        if (c == '') {
          var o = document.createElement('option');
          o.text = v;
          if (j === null) {
            j = v < a[0].value ? 0 : a.length;
          }
          try {
            oyear.add(o, oyear.options[j]); /* for IE earlier than version 8 */
          } catch (e) {
            oyear.add(o, j);
          }
        }
        return v;
      };

    var Command = function(event)
      /*
       * process a command
       * in:  mouse event -- change - month/year select
       *                     click - next/prev month or day click
       *                     mousedown - possible close
       */
      {
        var t = EventType(event);
        var o = Target(event);
        if (t == 'change') {
          Create();
        } else if (t == 'click') {
          if (o.tagName.toLowerCase() == 'button') {
            var k = o.name == 'MN' ? +1 : -1;
            var m = parseInt(omonth.value) + k;
            if (m < 0 || m > 11) {
              m = m < 0 ? 11 : 0;
              oyear.value = CheckYear(parseInt(oyear.value) + k);
            }
            omonth.value = String(m);
            Create();
          } else if (o.className.indexOf('day') + 1) {
            var a = [o.innerHTML, parseInt(omonth.value) + 1, oyear.value];
            Setup(a);
          }
        } else if (FindParent(o, 'datepick', 'id') === null) {
          Setup(false);
        }
      };

  }
