<?php
$http = isset( $_SERVER["HTTPS"] ) ? 'https' : 'http';

define( "BASE_URL" , $http . "://" . $_SERVER["HTTP_HOST"] . "/books/" );
define( "READ_USING_PHP" , true );
require '_lp.php';
// header("Access-Control-Allow-Origin: *");


if( !isset( $_REQUEST['action'] ) ) $action = 'upload';
else $action = trim( $_REQUEST['action'] );

if( $action == 'read' )
{
    $id = trim( $_REQUEST['id'] );
    if( $id )
    {
        $file = $id . '.h2book';
        $path = __DIR__ .'/books/'.$file;
        header("Access-Control-Allow-Origin: *");
        readfile($path);
    }
}
else
{
    if( !isset( $_FILES ) || !isset( $_FILES["book"] ) ) return send_error( "INPUT" ,  "no file uploaded" );
    if( $_FILES["book"]["error"] != 0 ) return send_error( "UPLOAD" ,  "upload error" . $_FILES["book"]["error"] );

    $id = time() . '-' . rand( 1 , 999999 );
    $file = $id . '.h2book';
    $path = __DIR__ .'/books/'.$file;

    if (!move_uploaded_file( $_FILES["book"]["tmp_name"] , $path )) 
        return send_error( "MOVE" ,  "move uploaded file error" );

    
    
    $url = READ_USING_PHP ? $http . "://" . $_SERVER["HTTP_HOST"] . $_SERVER["SCRIPT_NAME"] . "?action=read&id=" . $id : BASE_URL . $file;

    return send_result( array( "url" => $url , "id" => $id ));  
}

