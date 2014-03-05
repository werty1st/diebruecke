<?php

$db_name = "diebruecke";
$db_host = "http://localhost:5984";

# Additional site configuration settings. Allows to override global settings.
if (file_exists('config.php')) {
	include_once('config.php');
}

$options = getopt("f:");

switch ($options["f"]) {
	case 'td':
		echo "execute funtion transform_data()\n";
		td();
		break;
	case 'gc':
		echo "execute funtion garbabe_collector()\n";
		gc();
		break;	
	default:
		echo "Exit\n";
		break;
}

exit;

function gc(){
	//curl -X GET http://localhost:5984/diebruecke/_design/b2/_view/allslugs	

	// create curl resource 
	$ch = curl_init(); 

	// set url 
	curl_setopt($ch, CURLOPT_URL, "localhost:5984/diebruecke/_all_docs?include_docs=true"); 

	//return the transfer as a string 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 

	// $output contains the output string 
	$output = curl_exec($ch); 
	$jsdata = json_decode($output, false);





	$docs = delete_garbage($jsdata);
	//var_dump($jsdata->rows);





	$docsout = new stdClass();
	$docsout->docs = $docs;

	$postdata = json_encode($docsout);

	// set url 
	curl_setopt($ch, CURLOPT_URL, "localhost:5984/diebruecke/_bulk_docs"); 
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
	curl_setopt($ch, CURLOPT_POSTFIELDS, $postdata);                                                                  
	curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
			'Content-Type: application/json',                                                                                
			'Content-Length: ' . strlen(json_encode($docsout)))                                                                       
		);                                                                                                                   

	$result = curl_exec($ch);

	// close curl resource to free up system resources 
	curl_close($ch);   
	echo $result;

	//curl -d '{"docs":[{"key":"baz","name":"bazzel"},{"key":"bar","name":"barry"}]}' -X POST $DB/_bulk_docs
}


function delete_garbage($jsdata){

	$docs = array();


	foreach ($jsdata->rows as $i => $obj) {
		$obj1 = $obj->doc;
		//var_dump($obj1);


		//all slugs
		if (property_exists($obj1,"slug")){
			echo $obj1->slug."\n";
			$obj1->_deleted = true;
			// $docs[$obj1->slug} = $obj1;
			array_push($docs, $obj1);
			continue;
		}

		//video or images
		if (property_exists($obj1,"type")){
			if(($obj1->type == "video") || ($obj1->type == "image") || ($obj1->type == "media")){
				echo $obj1->type == "foto OR video"."\n";
				$obj1->_deleted = true;
				// $docs[$obj1->slug} = $obj1;
				array_push($docs, $obj1);
				continue;
			}
		}

		//old slugs without porper id
		if (property_exists($obj1,"slug")){
			if ($obj1->slug != $obj1->_id){
				echo $obj1->slug."\n";
				$obj1->_deleted = true;
				// $docs[$obj1->slug} = $obj1;
				array_push($docs, $obj1);
				continue;
			}
        }

		//doc without type property but no design docs		
		if ((!property_exists($obj1,"type")) && (!strpos($obj1->{"_id"},"_design")==0)){
			echo "deleting orphaned doc\n";
			$obj1->_deleted = true;		
			array_push($docs, $obj1);
			continue;
		}

		if (!property_exists($obj1,"type")) echo "kein type";
		if (strpos($obj1->{"_id"},"_design")==0) echo "ist design";
/*		echo "doc without type\n";
		if ((!property_exists($obj1,"type"))){
			echo "deleting orphaned doc\n";
			$obj1->_deleted = true;		
			array_push($docs, $obj1);
			continue;
		}*/
		
		// //doc type property
		// if ((!property_exists($obj1,"type")) && (!strpos($obj1->_id,"_design"))){
		// 	echo "deleting orphaned doc\n";
		// 	$obj1->_deleted = true;		
		// 	array_push($docs, $obj1);
		// 	continue;
		// }

	}
	return $docs;
}




function td() {

	$data = file_get_contents("data.json");
	$jsdata = json_decode($data, false);
	$jsdata2 = json_decode($data, false);

	$personJson = array();
	$personMedia = array();

	foreach ($jsdata as $key => $person) {
		echo "Name: ".$key."\n";
		unset($person->media);
		toLower($person);
        //uploadMediaDoc($person);
		array_push($personJson, $person);
	}
	

	//$personJson = array_merge($personJson, $personMedia);
	//var_dump($personJson); exit;

	file_put_contents("data_split.json",json_encode($personJson));
	//file_put_contents("data_split_media.json",json_encode($personMedia));

	

	$cmd = "kanso transform map ".
	  '--src="function (doc) { doc[\"_id\"] = doc.slug; doc.type=\"person\"; return doc; }" '.
	  "data_split.json data_split_ids.json";

	system($cmd);
	system("kanso upload data_split_ids.json ");



	foreach ($jsdata2 as $key => $person) {
		echo "Media für Name: ".$key."\n";
		toLower($person);
        uploadMediaDoc($person);
	}

	/*$cmd = "kanso transform add-ids ".
	  '--src="function (doc) { if (doc.type==\"media\"); return doc; }" '.
	  "data_split_media.json data_split_media_ids.json";

	system($cmd);
	system("kanso upload data_split_media_ids.json ");
	
	unlink("data_split_media.json");
	unlink("data_split_media_ids.json");
	*/
	
	unlink("data_split.json");
	unlink("data_split_ids.json");

	echo"finished\n";
}

function makeLinkThumbnail($path){

	$path = strtolower($path);
	$pi = pathinfo($path);

	$prefix = "s79_";

	$path = $pi["dirname"]."/".$prefix.$pi["basename"];

	
	return $path;
}

function getFreigabeEpisode($path){

	if (strpos($path, "afs1")) return "1";
	if (strpos($path, "afs2")) return "1";
	if (strpos($path, "afs3")) return "2";
	if (strpos($path, "afs4")) return "2";
	if (strpos($path, "afs5")) return "3";
	if (strpos($path, "afs6")) return "3";
	if (strpos($path, "afs7")) return "4";
	if (strpos($path, "afs8")) return "4";
	if (strpos($path, "afs9")) return "5";
	if (strpos($path, "afs10")) return "5";


}

function getuuids(){
	global $db_name, $db_host;

    // create curl resource 
    $ch = curl_init(); 

    // set url 
    curl_setopt($ch, CURLOPT_URL, $db_host."/_uuids?count=500"); 

    //return the transfer as a string 
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 

    // $output contains the output string 
    $output = curl_exec($ch); 

    // close curl resource to free up system resources 
    curl_close($ch); 	

    return json_decode($output,true);
}

function getBase64($file){

}

function uploadMediaDoc($person){

	global $db_name, $db_host;

	//get500uuids
	$myuuids = getuuids()["uuids"];

	/*curl -X PUT http://admin:s00fa@localhost:5984/test/docid -d
	{
		_id: "55dad1faeacb63600c10ad663ae6d966"
		ownerslug: "alexander"
		freischaltepisode: 0
		image: "/diebruecke/55dad1faeacb63600c10ad663ae6d966/image.png"
		thumbnail: "/diebruecke/55dad1faeacb63600c10ad663ae6d966/thumbnail.png"
		type: "image",

	    "_attachments": {
	        "message.png": {
	            "data": "iVBORw0KGgoAAAANSUhEUgAAAE8A...QmCC",
	            "content_type": "image/png"
	        }
	    }
	}
	*/

    foreach ($person->media as $key => $value) {
		$media = array();
		$uuid = array_pop($myuuids);

		$media["_id"] = $uuid;
		$media["ownerslug"] = $person->slug;
		$media["_attachments"] = array();

        if ($person->media[$key]->type == "video"){
                //video image vorhanden,resourceId kein url
        		$media["type"] = "video";
                $image = strtolower($person->media[$key]->image);                



                $image = preg_replace('/img/', 'img2', $image, 1);
				$im = file_get_contents($image);
				$imdata = base64_encode($im);  
                $media["_attachments"]["image.jpg"] = array();
                $media["_attachments"]["image.jpg"]["content_type"] = "image/jpg";
                $media["_attachments"]["image.jpg"]["data"] = $imdata;

        		//URL kann externer link sein oder auf das attachment zeigen
        		$media["image"] = "/$db_name/$uuid/image.jpg";

        		$media["freischaltepisode"] = getFreigabeEpisode($image);
        		//URL kann externer link sein oder auf das attachment zeigen


        		$media["thumbnail"] = "/$db_name/$uuid/thumbnail.jpg";
				$im = file_get_contents(makeLinkThumbnail($image));
				$imdata = base64_encode($im);  
                $media["_attachments"]["thumbnail.jpg"] = array();
                $media["_attachments"]["thumbnail.jpg"]["content_type"] = "image/jpg";
                $media["_attachments"]["thumbnail.jpg"]["data"] = $imdata;

        		//URL kann externer link sein oder auf das attachment zeigen
        		$media["videoURI"] = ""; 


                //delete
                // unset($person->media[$key]->image);
                unset($person->media[$key]->resourceId);		

        } else if ($person->media[$key]->type == "image")
        {
                //image url vorhanden kein resourceId
        		$media["type"] = "image";
                $image	   = strtolower($person->media[$key]->url);

                $image = preg_replace('/img/', 'img2', $image, 1);
				$im = file_get_contents($image);
				$imdata = base64_encode($im);  
                $media["_attachments"]["image.jpg"] = array();
                $media["_attachments"]["image.jpg"]["content_type"] = "image/jpg";
                $media["_attachments"]["image.jpg"]["data"] = $imdata;

        		//URL kann externer link sein oder auf das attachment zeigen
        		$media["image"] = "/$db_name/$uuid/image.jpg";

        		$media["freischaltepisode"] = getFreigabeEpisode($image);
        		//URL kann externer link sein oder auf das attachment zeigen


        		$media["thumbnail"] = "/$db_name/$uuid/thumbnail.jpg";
				$im = file_get_contents(makeLinkThumbnail($image));
				$imdata = base64_encode($im);  
                $media["_attachments"]["thumbnail.jpg"] = array();
                $media["_attachments"]["thumbnail.jpg"]["content_type"] = "image/jpg";
                $media["_attachments"]["thumbnail.jpg"]["data"] = $imdata;

        		//URL kann externer link sein oder auf das attachment zeigen
        		$media["videoURI"] = ""; 

                //delete
                unset($person->media[$key]->url);
        }


		$ch = curl_init($db_host."/".$db_name."/$uuid");
        //var_dump($media); exit;
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
		$jsondata = json_encode($media);
		curl_setopt($ch, CURLOPT_POSTFIELDS,$jsondata);

		$response = curl_exec($ch);
		curl_close($ch); 
    }




}

function createMediaDoc($person,&$uploadmedia){

	//link festigen
	//host:port /_design/b2/

    foreach ($person->media as $key => $value) {
		$media = array();
		$media["ownerslug"] = $person->slug;

            if ($person->media[$key]->type == "video"){
                    //video image vorhanden,resourceId kein url
                    $image	   = strtolower($person->media[$key]->image);

            		$media["type"] = "video";
            		//URL kann externer link sein oder auf das attachment zeigen
            		$media["image"] = $image;
            		$media["freischaltepisode"] = getFreigabeEpisode($image);
            		//URL kann externer link sein oder auf das attachment zeigen
            		$media["thumbnail"] = makeLinkThumbnail($image);
            		//URL kann externer link sein oder auf das attachment zeigen
            		$media["videoURI"] = ""; 


                    //delete
                    // unset($person->media[$key]->image);
                    unset($person->media[$key]->resourceId);

            } else if ($person->media[$key]->type == "image")
            {
                    //image url vorhanden kein resourceId

                    $image	   = strtolower($person->media[$key]->url);

            		$media["type"] = "image";
            		//URL kann externer link sein oder auf das attachment zeigen
            		$media["image"] = $image;
            		$media["freischaltepisode"] = getFreigabeEpisode($image);
            		//URL kann externer link sein oder auf das attachment zeigen
            		$media["thumbnail"] = makeLinkThumbnail($image);
            		//URL kann externer link sein oder auf das attachment zeigen
            		$media["videoURI"] = ""; 

                    //delete
                    unset($person->media[$key]->url);
            }
        array_push($uploadmedia,$media);
    }
    unset($person->media);
	// var_dump($uploadmedia); exit;
}


function toLower($person){

	$person->image = strtolower($person->image);
        


}