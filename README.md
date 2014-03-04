diebruecke
==========


shrink images
find . -iname '*.jpg' -exec mogrify -resize 734x413 -quality 85 {} +; touch timestamp
find . -iname '*.jpg' -newer timestamp -exec mogrify -resize 734x413 -format png {} +; touch timestamp



//dateiname vor ext ändern
find . -name "*.jpg" -exec sh -c 'echo "$1"; echo "$(echo "$1" | sed s/.jpg\$/_s.jpg/)"' _ {} \;
//dateiname mit prefix versehen
find . -name "*.jpg" -exec sh -c 'echo "$1"; echo $(dirname $1)/s79_$(basename $1)' _ {} \;


//thumbnails erstellen
find . -name "*.jpg" -exec sh -c 'convert -resize 79x79 -quality 85 "$1" $(dirname $1)/s79_$(basename $1)' _ {} \;
//v2
find . -name "*.jpg" -exec sh -c 'convert -resize 79x79^ -gravity Center -crop 79x79+0+0 -quality 85 "$1" $(dirname $1)/s79_$(basename $1)' _ {} \;


//alles lowercase
for f in `find`; do mv -v $f `echo $f | tr '[A-Z]' '[a-z]'`; done

//laden -> login status klären
//login -> login status klären
//logout -> login status klären
//todo login auf startseite ziehen


dateinamen alle kleingeschrieben ohne leerzeichen und sonderzeichen
Video Spec:
		breite = 734;
		höhe = 413;
		H.264 / AVC;		
Fotos:
		breite = 734;
		höhe = 413;
		jpg/png


Todo:
foto und video upload
übersichtseite mit enddatum der einzelnen episoden
sterbedatum einer person

abstimmungsendpoint
abstimmungsvisualisierung

fotos und videos auf externen server/2.datenbank