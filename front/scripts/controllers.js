angular.module('AngularApp.controllers', [])

angular.module('AngularApp.controllers').controller('RootCtrl', function($rootScope, $scope, $stateParams, $translate, $window, UserService) {
	
	var supported_lang = ['en', 'fr'];
	
	var user_lang = 'en';
	
	if ($stateParams.codelang) {
		
		if (supported_lang.indexOf($stateParams.codelang) != -1) user_lang = $stateParams.codelang;
      	$translate.use(user_lang);
	}
	else {
		
		var lang = $window.navigator.language || $window.navigator.userLanguage;
		if (supported_lang.indexOf(lang) != -1) user_lang = lang;
		
    	$window.location.href = '/' + user_lang + '/home';
	}
	
	$scope.user = UserService.data;
	
	$scope.logout = UserService.logout;
	
	$rootScope.menu_open = false;
	
	$scope.openMenu = function() {
		$rootScope.menu_open = true;
	}
	
	$scope.closeMenu = function() {
		$rootScope.menu_open = false;
	}
});

angular.module('AngularApp.controllers').controller('HomeCtrl', function($scope) {
	
	$scope.page_title = 'home_TITLE';
});

angular.module('AngularApp.controllers').controller('LoginCtrl', function($scope, UserService) {
	
	$scope.page_title = 'login_TITLE';
	
	$scope.loginModel = { username:null, password:null };
	
	$scope.localLogin = UserService.localLogin;
	$scope.socialLogin = UserService.socialLogin;
});

angular.module('AngularApp.controllers').controller('RegisterCtrl', function($scope, UserService) {
	
	$scope.page_title = 'register_TITLE';
	
	$scope.registerModel = { username:null, password1:null, password2:null, email:null };
	
	$scope.register = UserService.register;
});

angular.module('AngularApp.controllers').controller('ProfileCtrl', function($scope, UserService, $timeout) {
	
	$scope.page_title = 'profile_TITLE';
	
	$scope.user = UserService.data;
	
	/* Name */
	
	$scope.editname = false;
	$scope.newname = UserService.data.name;
	
	$scope.nameClick = function() {
		
		$scope.editname = true;
			
		$timeout(function() {
			$('#input-name').focus();
		});
	}
	
	$scope.nameBlur = function(newvalue) {
		
		$scope.editname = false;
		
		if (newvalue && newvalue != UserService.data.name) {
			
			$scope.loadingname = true;
			UserService.updateName(newvalue).then(function() {
				$scope.loadingname = false;
			});
		}
	}
});

angular.module('AngularApp.controllers').controller('MissionsCtrl', function($scope, $state, UserService, CreateService) {
	
	$scope.page_title = 'missions_TITLE';

	CreateService.init();
	
	$scope.missions = UserService.data.missions;
	
	$scope.isSelected = function(ref) {
		
		if (CreateService.getRefArray().indexOf(ref) != -1) {
			return true;
		} else {
			return false;
		}
	}
	
	$scope.toggle = function(index, event, item) {
		
		if (event.shiftKey) {
			event.preventDefault();
			
			if (index > $scope.lastSelectedIndex) {
				
				for (var i = ($scope.lastSelectedIndex + 1); i <= index; i++) {
					
					var m = $scope.missions[i];
					if (!$scope.isSelected(m.ref)) {
						CreateService.add(m);
					}
				}
			}
			else {
				
				for (var i = index; i < $scope.lastSelectedIndex; i++) {
					
					var m = $scope.missions[i];
					if (!$scope.isSelected(m.ref)) {
						CreateService.add(m);
					}
				}
			}
		}
		else {
			
			if ($scope.isSelected(item.ref)) {
				CreateService.remove(item);
			}
			else {
				CreateService.add(item);
			}
		}
		
		$scope.lastSelectedIndex = index;
	}
	
	$scope.hasSelected = function() {
		
		if (CreateService.data.missions.length > 0) {
			return true;
		} else {
			return false;
		}
	}
	
	$scope.nextStep = function() {
		$state.go('root.create');
	}
	
	$scope.delete = function(item) {
		UserService.deleteMission(item);
	}
});

angular.module('AngularApp.controllers').controller('CreateCtrl', function($scope, $state, CreateService) {
	
	$scope.page_title = 'create_TITLE';
	
	$scope.data = null;

	if (CreateService.data.missions.length < 1) {
		$state.go('root.missions');
	}
			
	var geocoder = new google.maps.Geocoder;
	
	var latlng = {
		lat: parseFloat(CreateService.data.missions[0].lat),
		lng: parseFloat(CreateService.data.missions[0].lng),
	};

	geocoder.geocode({'location': latlng}, function(results, status) {
		
		if (status === 'OK') {
			if (results[1]) {
				
				for (var item of results[1].address_components) {
					
					if (item.types[0] == 'country') CreateService.data.country = item.long_name;
					if (item.types[0] == 'locality') CreateService.data.city = item.long_name;
				}
		
				$scope.$apply();
			}
		}
	});

	CreateService.default();

	$scope.data = CreateService.data;
	$scope.create = CreateService.create;

	$scope.rows = function() {
		
		var temp = 1;
		if ($scope.data.count > 0 && $scope.data.cols > 0) temp = Math.ceil($scope.data.count / $scope.data.cols);
		if (!temp) temp = 1;
		
		var rows = [];
		for (var i = 0; i < temp; i++) {
			rows.push(i);
		}
		
		return rows;
	}
	
	$scope.cols = function() {
		
		var temp = 1;
		if ($scope.data.cols > 0) temp = $scope.data.cols;
		if (!temp) temp = 1;
		
		var cols = [];
		for (var i = 0; i < temp; i++) {
			cols.push(i);
		}
		
		return cols;
	}
	
	$scope.getImage = function(i, j) {
		
		var order = (i * $scope.data.cols + j) + 1;
		return CreateService.getImageByOrder(order);
	}
});

angular.module('AngularApp.controllers').controller('MosaicCtrl', function($scope, $timeout, $window, MosaicService) {
	
	$scope.page_title = MosaicService.data.mosaic.title;
	
	$scope.mosaic = MosaicService.data.mosaic;
	
	$scope.delete = MosaicService.delete;
	$scope.remove = MosaicService.remove;

	$scope.rows = function() {
		
		var temp = 1;
		if ($scope.mosaic.count > 0 && $scope.mosaic.cols > 0) temp = Math.ceil($scope.mosaic.count / $scope.mosaic.cols);
		if (!temp) temp = 1;
		
		var rows = [];
		for (var i = 0; i < temp; i++) {
			rows.push(i);
		}
		
		return rows;
	}
	
	$scope.cols = function() {
		
		var temp = 1;
		if ($scope.mosaic.cols > 0) temp = $scope.mosaic.cols;
		if (!temp) temp = 1;
		
		var cols = [];
		for (var i = 0; i < temp; i++) {
			cols.push(i);
		}
		
		return cols;
	}
	
	$scope.getImage = function(i, j) {
		
		var order = (i * $scope.mosaic.cols + j) + 1;
		return MosaicService.getImageByOrder(order);
	}
	
	/* Name */
	
	$scope.editname = false;
	$scope.newname = MosaicService.data.mosaic.title;
	
	$scope.nameClick = function() {
		
		$scope.editname = true;
			
		$timeout(function() {
			$('#input-name').focus();
		});
	}
	
	$scope.nameBlur = function(newvalue) {
		
		$scope.editname = false;
		
		if (newvalue && newvalue != MosaicService.data.mosaic.title) {
			
			$scope.loadingname = true;
			MosaicService.updateName(newvalue).then(function() {
				$scope.loadingname = false;
			});
		}
	}
	
	$scope.initMap = function() {
		
		var style = [{featureType:"all",elementType:"all",stylers:[{visibility:"on"},{hue:"#131c1c"},{saturation:"-50"},{invert_lightness:!0}]},{featureType:"water",elementType:"all",stylers:[{visibility:"on"},{hue:"#005eff"},{invert_lightness:!0}]},{featureType:"poi",stylers:[{visibility:"off"}]},{featureType:"transit",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"road",elementType:"labels.icon",stylers:[{invert_lightness:!0}]}];
		
		var map = new google.maps.Map(document.getElementById('map'), {
			
			zoom: 8,
			styles : style,
			zoomControl: true,
			disableDefaultUI: true,
			center: {lat: $scope.mosaic.missions[0].lat, lng: $scope.mosaic.missions[0].lng},
		});
		
		var latlngbounds = new google.maps.LatLngBounds();
		
		var roadmapCoordinates= [];
		
		var image = {
			size: new google.maps.Size(50, 50),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(25, 25),
			labelOrigin: new google.maps.Point(25, 27),
			url: 'https://www.myingressmosaics.com/static/front/img/neutral.png',
		};
		
		for (var m of $scope.mosaic.missions) {
		
	        var marker = new google.maps.Marker({
	        	
				map: map,
				icon: image,
				label: { text:String(m.order), color:'#FFFFFF', fontFamily:'Coda', fontSize:'.75rem', fontWeight:'400', },
				position: {lat: m.lat, lng: m.lng},
	        });
	        
	        var latLng = new google.maps.LatLng(m.lat,m.lng);
	        latlngbounds.extend(latLng);
	        
	        roadmapCoordinates.push(latLng);
		}
		
		var roadmap = new google.maps.Polyline({
			path: roadmapCoordinates,
			geodesic: true,
			strokeColor: '#ebbc4a',
			strokeOpacity: 0.95,
			strokeWeight: 4,
        });

        roadmap.setMap(map);
        
		map.setCenter(latlngbounds.getCenter());
		map.fitBounds(latlngbounds); 
	}
});

angular.module('AngularApp.controllers').controller('EditCtrl', function($scope, $state, MosaicService) {

	$scope.mosaic = MosaicService.data.mosaic;
		
	$scope.cols = MosaicService.getColsArray();
	$scope.rows = MosaicService.getRowsArray();
	
	$scope.missions = [];
	
	for (var item of $scope.mosaic.missions) {
		
		var temp = {
			ref: item.ref,
			title: item.title,
			order: item.order,
			image: item.image,
		};
		
		$scope.missions.push(temp);
	}

	$scope.back = function() {
		
		$state.go('root.mosaic', {ref: $scope.mosaic.ref});
	}
	
	$scope.image = function(i, j) {
		
		var order = (i * $scope.mosaic.cols + j) + 1;
		
		var url = null;
		
		for (var item of $scope.missions) {
			if (($scope.mosaic.count - item.order + 1) == order) {
				url = item.image;
				break;
			}
		}
		
		return url;
	}
	
	$scope.save = function() {
		
		MosaicService.reorderMissions($scope.missions).then(function(response) {
			
			$state.go('root.mosaic', {ref: $scope.mosaic.ref});
		});
	}
});

angular.module('AngularApp.controllers').controller('AddCtrl', function($scope, $state, MosaicService, DataService) {

	$scope.mosaic = MosaicService.data.mosaic;
	
	DataService.getMissions($scope.mosaic).then(function(response) {
		$scope.missions = DataService.missions;
	});
	
	$scope.add = function(item) {
		
		var index = $scope.missions.indexOf(item);
		if (index > -1) {
		    $scope.missions.splice(index, 1);
		}
		
		MosaicService.add(item.ref);
	}

	$scope.back = function() {
		
		$state.go('root.mosaic', {ref: $scope.mosaic.ref}, {reload:true});
	}
});

angular.module('AngularApp.controllers').controller('MyMosaicsCtrl', function($scope, $state, UserService) {
	
	$scope.page_title = 'mymosaics_TITLE';

	$scope.mosaics = UserService.data.mosaics;
	
	$scope.go = function(item) {
		$state.go('root.mosaic', {ref: item.ref});
	}
});

angular.module('AngularApp.controllers').controller('CountriesCtrl', function($scope, $state, DataService) {
	
	$scope.page_title = 'countries_TITLE';
	
	$scope.countries = DataService.countries;
	
	$scope.go = function(item) {
		
		DataService.current_country = item.name;
		$state.go('root.cities');
	}
});

angular.module('AngularApp.controllers').controller('CitiesCtrl', function($scope, $state, DataService) {
	
	$scope.page_title = 'cities_TITLE';
	
	$scope.cities = DataService.cities;
	
	$scope.go = function(item) {
		
		DataService.current_city = item.name;
		$state.go('root.mosaics');
	}
});

angular.module('AngularApp.controllers').controller('MosaicsCtrl', function($scope, $state, DataService) {
	
	$scope.page_title = 'mosaics_TITLE';
	
	$scope.mosaics = DataService.mosaics;
	
	$scope.go = function(item) {
		
		$state.go('root.mosaic', {ref: item.ref});
	}
});