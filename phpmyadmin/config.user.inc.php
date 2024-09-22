<?php
$i++;
  $cfg['Servers'][$i]['verbose'] = 'movie-service';
  $cfg['Servers'][$i]['host'] = 'movie-service-db';
  $cfg['Servers'][$i]['port'] = '';
  $cfg['Servers'][$i]['socket'] = '';
  $cfg['Servers'][$i]['connect_type'] = 'tcp';
  $cfg['Servers'][$i]['extension'] = 'mysqlci';
  $cfg['Servers'][$i]['auth_type'] = 'config';
  $cfg['Servers'][$i]['user'] = 'root';
  $cfg['Servers'][$i]['password'] = 'password';
  $cfg['Servers'][$i]['AllowNoPassword'] = false;