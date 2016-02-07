
var localFileName;	// the filename of the local mbtiles file
var remoteFile;		// the url of the remote mbtiles file to be downloaded
var msg;			// the span to show messages

localFileName = 'ukraine.mbtiles';
remoteFile = 'https://github.com/5starsmedia/cordova-offline-maps/raw/master/www/ukraine.mbtiles';

var mapStyle = {
    "version": 8,
    "sources": {
        "ukraine": {
            "type": "vector",
            "tiles": [
                "{z}/{x}/{y}"
            ],
            "minzoom": 0,
            "maxzoom": 16
        }
    },
    "layers": [
        {
            "id": "background",
            "type": "background",
            "paint": {
                "background-color": "#000000"
            }
        }, {
            "id": "water",
            "type": "fill",
            "source": "ukraine",
            "source-layer": "water",
            "filter": ["==", "$type", "Polygon"],
            "paint": {
                "fill-color": "#3887be"
            }
        }
    ]
};

function buildMap(fileName) {
    //var db = sqlitePlugin.openDatabase({ name: '/sdcard/' + localFileName, androidDatabaseImplementation: 2 });
    var map = new mapboxgl.Map({
        container: 'map',
        center: [0, 0],
        zoom: 2,
        style: mapStyle,
        bearingSnap: 45
    });
    map.addControl(new mapboxgl.Navigation());
}


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        var fs;				// file system object
        var ft;				// TileTransfer object

        msg = document.getElementById('message');

        console.log('requesting file system...');
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            console.log('file system retrieved.');
            fs = fileSystem;

            // check to see if files already exists
            var file = fs.root.getFile(localFileName, {create: false}, function () {
                // file exists
                console.log('exists');

                msg.innerHTML = 'File already exists on device. Building map...';

                buildMap(fs.root.toURL() + '/' + localFileName);
            }, function () {
                // file does not exist
                console.log('does not exist');

                msg.innerHTML = 'Downloading file (~14mbs)...' + fs.root.fullPath + '/' + localFileName;

                console.log('downloading sqlite file...');
                ft = new FileTransfer();
                ft.onprogress = function(progressEvent) {
                    if (progressEvent.lengthComputable) {

                        msg.innerHTML = 'File ' + fs.root.toURL() + '/' + localFileName + ' - ' + fs.root.fullPath + '/' + localFileName
                        + 'PR:' + progressEvent.loaded / progressEvent.total;
                    }
                };
                ft.download(remoteFile, cordova.file.dataDirectory + localFileName, function (entry) {
                    console.log('download complete: ' + entry.fullPath);

                    msg.innerHTML = 'OK';
                    buildMap(fs.root.toURL() + '/' + localFileName);

                }, function (error) {
                    console.log('error with download', error);
                });
            },
            function(error) {
                msg.innerHTML = "download error source " + error.source + "download error target " + error.target + "upload error code" + error.code;
            });
        });
    }
};

app.initialize();