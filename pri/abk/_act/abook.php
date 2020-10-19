<?php

/*
 * main panel creator
 *
 * @package Application
 * @author Vallo Reima
 * @copyright (C)2013
 */
¤::$_->ts = array_merge(¤::$_->ts,[
    'url' => ¤::_('url'),
    'prpmt' => ¤::_('txt.prpmt'),
    'noxhr' => ¤::_('txt.noxhr'),
    'addg' => ¤::_('txt.addg'),
    'mdfg' => ¤::_('txt.mdfg'),
    'undg' => ¤::_('txt.undg'),
    'brng' => ¤::_('txt.brng'),
    'schg' => ¤::_('txt.schg'),
    'delcfm' => ¤::_('txt.delcfm'),
    'msd' => ¤::_('txt.msd'),
    'wrd' => ¤::_('txt.wrd'),
    'dats' => '-yymd', /* date format: delimiter and day,month,year sequence (yy - full year) */
    'wsuf' => false /* if true then week starts from Sunday */
]);
$genders = ['female' => ¤::_('txt.female'), 'male' => ¤::_('txt.male')];
$dys = ¤::_('txt.dys');
$days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];  /* day tokens */
for ($i = 0; $i < count($days); $i++) {
  $days[$i] = substr($dys[$days[$i]], strpos($dys[$days[$i]], '/') + 1);
}
$mth = ¤::_('txt.mth');
$months = [
    '0' => $mth['jan'], /* month names */
    '1' => $mth['feb'],
    '2' => $mth['mar'],
    '3' => $mth['apr'],
    '4' => $mth['may'],
    '5' => $mth['jun'],
    '6' => $mth['jul'],
    '7' => $mth['aug'],
    '8' => $mth['sep'],
    '9' => $mth['oct'],
    '10' => $mth['nov'],
    '11' => $mth['dec']
];
$years = array();
$k = date("Y") - 90;
$n = date("Y") - 10;
for ($i = $k; $i <= $n; $i++) { /* years +/- 10 from the current */
  $years[$i] = $i;
}
$nme = basename(__FILE__, EXT);
include TPLD . $nme . TPL;

/**
 * form calendar daynames row
 * @param array  days - day tokens  
 * @param bool   wsuf -- true - Sunday 1st
 * 
 */
function Days($days, $wsuf) {
  $a = array(1, 2, 3, 4, 5, 6);
  if ($wsuf) {
    array_unshift($a, 0);   /* Sunday 1st */
  } else {
    array_push($a, 0);    /* Monday 1st */
  }
  $htm = '<th>#</th>';
  foreach ($a as $i) {
    $htm .= '<th>' . $days[$i] . '</th>';
  }
  return $htm;
}