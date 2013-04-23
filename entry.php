<?php
define("ROOT",dirname(__DIR__));
$app = new Yaf_Application(require(__DIR__."/../config/".get_cfg_var("qihoo.server_type").".php"));
$app->bootstrap()->run();