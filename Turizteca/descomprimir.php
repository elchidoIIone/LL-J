<?php

$filename = "./archive.zip";
if (file_exists("./archive.zip")) {
    $zip = new ZipArchive;
    if ($zip->open($filename) === TRUE) {
        $zip->extractTo('./');
        $zip->close();
        echo 'ok';
    } else {
        echo 'error';
    }
}