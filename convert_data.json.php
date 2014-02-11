<?php

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
		// var_dump($obj1);


		//all slugs
		if (property_exists($obj1,"slug"))
			{
				echo $obj1->slug."\n";
				$obj1->_deleted = true;
				// $docs[$obj1->slug} = $obj1;
				array_push($docs, $obj1);
				continue;
			}

		//old slugs without porper id
		if (property_exists($obj1,"slug"))
			if ($obj1->slug != $obj1->_id){
				echo $obj1->slug."\n";
				$obj1->_deleted = true;
				// $docs[$obj1->slug} = $obj1;
				array_push($docs, $obj1);
				continue;
			}

		//doc without type property but no design docs
		if ((!property_exists($obj1,"type")) && (!strpos($obj1->{"_id"},"_design")==0)){
			echo "deleting orphaned doc\n";
			$obj1->_deleted = true;		
			array_push($docs, $obj1);
			continue;
		}
		
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

	$outdata = array();

	foreach ($jsdata as $key => $value) {
		echo "Name: ".$key."\n";
		toLower($value);
		array_push($outdata, $value);
	}



	file_put_contents("data_split.json",json_encode($outdata));

	

	$text = "kanso transform map ".
	  '--src="function (doc) { doc[\"_id\"] = doc.slug; doc.type=\"person\"; return doc; }" '.
	  "data_split.json data_split_ids.json";

	system($text);
	system("kanso upload data_split_ids.json ");

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
	if (strpos($path, "afs2")) return "2";
	if (strpos($path, "afs3")) return "3";
	if (strpos($path, "afs4")) return "4";
	if (strpos($path, "afs5")) return "5";
	if (strpos($path, "afs6")) return "6";
	if (strpos($path, "afs7")) return "7";
	if (strpos($path, "afs8")) return "8";
	if (strpos($path, "afs9")) return "9";
	if (strpos($path, "afs10")) return "10";


}

function toLower($person){

	$person->image = strtolower($person->image);
	foreach ($person->media as $key => $value) {
		
		if ($person->media[$key]->type == "video"){
			//video image vorhanden,resourceId kein url

			$image	   = strtolower($person->media[$key]->image);
			$thumbnail = makeLinkThumbnail($image);


			$person->media[$key]->freischaltepisode = getFreigabeEpisode($image);
			$person->media[$key]->thumbnail = $thumbnail;
			$person->media[$key]->image   = $image;
			$person->media[$key]->video     = "";

			//delete
			// unset($person->media[$key]->image);
			unset($person->media[$key]->resourceId);

		} else if ($person->media[$key]->type == "image")
		{
			//image url vorhanden kein resourceId

			$image	   = strtolower($person->media[$key]->url);
			$thumbnail = makeLinkThumbnail($image);

			$person->media[$key]->freischaltepisode = getFreigabeEpisode($image);
			$person->media[$key]->thumbnail = $thumbnail;
			$person->media[$key]->image   = $image;

			//delete
			unset($person->media[$key]->url);
		}
	}

}