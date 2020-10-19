<?php

/*
 * browse services
 * cmd -- D - file download
 *        B - table rows
 *        O - XML output
 * ord -- rows' order
 * 
 * @package Application
 * @author Vallo Reima
 * @copyright (C)2013
 */
$cmd = ¤::_('rq.cmd');
if ($cmd == 'D') {
  include(ACTD . 'download' . EXT);
} else if ($cmd == 'F') {
  $fld = ¤::_('rq.fld');
  echo json_encode(Find($fld, $this));
} else {
  echo json_encode(Recs($cmd, $this));
}

/**
 * form records list
 * @param array $fld -- fname, lname
 * @param object $that
 * @return array
 */
function Find($fld, Frontal $that) {
  $cnd = ['all' => [['fname', 'lk', $fld['fname'] . '%'], ['lname', 'lk', $fld['lname'] . '%']]];
  $r = ¤::_('db')->Fetch('contacts', '*', $cnd, '', ['lck' => 'W']);
  if ($r) {
    foreach ($r[0] as $key => $val){
      if (is_null($val)){
        $r[0][$key] = '';
      }
    }
    $rsp = ['code' => 'ok', 'string' => ¤::_('txt.sltd'), 'factor' => $r[0]];
  } else {
    $rsp = ['code' => 'err', 'string' => ¤::_('txt.norecs'), 'factor' => ''];
  }
  return $rsp;
}

/**
 * form records list
 * @param string $cmd -- B|O
 * @param object $that
 * @return array
 */
function Recs($cmd, Frontal $that) {
  $ord = [];
  foreach (¤::_('rq.ord') as $srt => $seq) {
    $ord[$srt] = ($seq == ¤::$_->ts['asc']);
  }
  $frm = ¤::_('rq.frm');
  $pgc = ¤::$_->ts['pgc'];
  $rsp = ['code' => 'ok', 'string' => '', 'factor' => ''];
  if (!¤::_('db')->Query([$that->tbn => '*'], '', '', ['ord' => $ord, 'lmt' => "$frm,$pgc", 'lck' => 'R'])) {
    $rsp['string'] = ¤::_('txt.norecs');
    $rsp['code'] = 'err';
  } else if ($cmd == 'B') {
    $rsp['string'] = Rows($that->fld, $frm + 1);
    $rsp['factor'] = ¤::_('db')->Count($that->tbn);
  } else if ($cmd == 'O') {
    Output($rsp);
  }
  return $rsp;
}

/**
 * form table body rows
 * @param array fld -- field names
 * @param int frm -- number from
 * @return string rows html
 */
function Rows($fld, $frm) {
  $htm = '';
  while ($row = ¤::_('db')->Record()) {
    $htm .= "<tr id='id{$row['id']}'>" . PHP_EOL;
    $htm .= "<td class='w1'>$frm</td>" . PHP_EOL;
    for ($j = 0; $j < count($fld); $j++) {
      $k = $j + 2;
      $htm .= "<td class='w$k'>{$row[$fld[$j]]}</td>" . PHP_EOL;
    }
    $htm .= '</tr>' . PHP_EOL;
    $frm++;
  }
  return $htm;
}

/**
 * form the XML output
 * @param array $rsp -- response
 */
function Output(&$rsp) {
  $doc = new DOMDocument(¤::_('cfg.version'), ¤::_('cfg.encoding'));
//  $doc = new DomDocument('1.0');
  $doc->preserveWhiteSpace = false;
  $doc->formatOutput = true;
  $root = $doc->createElement('contacts');
  $root = $doc->appendChild($root);
  while ($row = ¤::_('db')->Record()) {
    $ctct = $doc->createElement('contact');
    $ctct = $root->appendChild($ctct);
    foreach ($row as $key => $val) {
      $chld = $doc->createElement($key);
      $chld = $ctct->appendChild($chld);
      //add data to the new element
      $txt = $doc->createTextNode($val);
      $txt = $chld->appendChild($txt);
    }
  }
  $wkf = ¤::WorkFile('xml');
  if ($wkf && $doc->save($wkf)) {
    $rsp['string'] = ¤::_('txt.xml');
    $rsp['factor'] = $wkf;
  } else {
    $rsp['code'] = 'err';
    $rsp['string'] = ¤::_('txt.nosd');
  }
}
