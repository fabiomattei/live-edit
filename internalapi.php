<?php

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  echo $_GET['value'];
} else {
  echo $_POST['value'];
}
