
var localFileName;	// the filename of the local mbtiles file
var remoteFile;		// the url of the remote mbtiles file to be downloaded
var msg;			// the span to show messages

localFileName = 'test.mbtiles';
remoteFile = 'http://dl.dropbox.com/u/14814828/OSMBrightSLValley.mbtiles';

function buildMap(fileName) {
    //var db = sqlitePlugin.openDatabase({ name: '/sdcard/' + localFileName, androidDatabaseImplementation: 2 });
    sqlitePlugin.openDatabase({ name: 'test.mbtiles', createFromLocation: 1 }, function(db) {

        alert('OK');
        document.body.removeChild(msg);

        var map = new L.Map('map', {
            center: new L.LatLng(40.6681, -111.9364),
            zoom: 11
        });

        var lyr = new L.TileLayer.MBTiles('', {maxZoom: 14, scheme: 'tms'}, db);

        map.addLayer(lyr);

    }, function(err) {
        alert('Open database ERROR: ' + JSON.stringify(err));
    });
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
                ft.download(remoteFile, fs.root.toURL() + '/' + localFileName, function (entry) {
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