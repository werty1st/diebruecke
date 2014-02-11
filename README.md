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


//alles lowercase
for f in `find`; do mv -v $f `echo $f | tr '[A-Z]' '[a-z]'`; done

//laden -> login status klären
//login -> login status klären
//logout -> login status klären
//todo login auf startseite ziehen