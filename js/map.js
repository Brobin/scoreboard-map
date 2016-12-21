
function Friend(last, first, company, lat, lng) {
    var self = this;
    self.name = first + " " + last;
    self.company = company;
    self.lat = lat;
    self.lng = lng;

    self.coords = [self.lat, self.lng];

    self.onClick = function(){
        map.panTo(self.coords);
        self.point.openPopup();
    }

    self.point = L.marker(
        self.coords
    ).bindPopup(
        self.name
    ).on("click", function(){
        self.onClick()
    });
}

function ScoreBoardViewModel(friends) {
    var self = this;
    self.friends = ko.observableArray(friends);

    self.generateMap = function() {
        var attr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery &copy; <a href="http://mapbox.com">Mapbox</a>';
        var url = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';

        var street = L.tileLayer(url, {maxZoom: 18, attribution: attr, id: 'mapbox.streets'}).addTo(map);
        var pirate = L.tileLayer(url, {maxZoom: 18, attribution: attr, id: 'mapbox.pirates'});
        var satellite = L.tileLayer(url, {maxZoom: 18, attribution: attr, id: 'mapbox.satellite'});

        map.setView([40.8106, -96.6803], 4);

        var friendLayer = L.layerGroup();

        ko.utils.arrayForEach(self.friends(), function(friend){
            friend.point.addTo(friendLayer);
        });

        friendLayer.addTo(map);

        var themes = {
            "Default": street,
            "Pirate": pirate,
            "Satellite": satellite,
        };

        var maps = {
            "Friends": friendLayer,
        };

        L.control.layers(themes, maps, {collapsed: false}).addTo(map);
    }
}
