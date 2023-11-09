<?php

$inputToken= $_REQUEST['inputToken'];
if (!preg_match('/^resource_rdx1[0-9a-z]{54}$/', $inputToken)) die();
$outputToken= $_REQUEST['outputToken'];
if (!preg_match('/^resource_rdx1[0-9a-z]{54}$/', $outputToken)) die();
$inputAmount= $_REQUEST['inputAmount'];
if (!preg_match('/^[0-9]+(.[0-9]+)?$/', $inputAmount)) die();

$body= json_encode(array('inputToken' => $inputToken, 'outputToken' => $outputToken, 'inputAmount' => $inputAmount));

$ch= curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://radix.defiplaza.net/api/quote');
curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
//curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
$head= curl_exec($ch);
//$httpCode= curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
