var selectedServices = new Array;
var markers = new Array;
var infowindows = new Array;
function setMarkers(map) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
		infowindows[i].setMap(map);
	}
}

function checkService(service) {
	selectedServices.push(service);
	console.log(selectedServices)
	setMarkers(null);
	searchCurrentAdress();
}

function uncheckService(service) {
	const idx = selectedServices.findIndex(function (item) { return item === service }) // findIndex = find + indexOf 
	if (idx > -1) selectedServices.splice(idx, 1)
	console.log(selectedServices)
	setMarkers(null);
	if (selectedServices.length != 0) searchCurrentAdress();
	else setMarkers(null);
}

$("#ATM").click(function () {
	if ($("#ATM").is(":checked")) {
		checkService("ATM");
	} else {
		uncheckService("ATM");
	}
});

$("#deliver").click(function () {
	if ($("#deliver").is(":checked")) {
		checkService("parcel");
	} else {
		uncheckService("parcel");
	}
});

$("#bakery").click(function () {
	if ($("#bakery").is(":checked")) {
		checkService("bakery");
	} else {
		uncheckService("bakery");
	}
});

$("#friedchicken").click(function () {
	if ($("#friedchicken").is(":checked")) {
		checkService("friedfood");
	} else {
		uncheckService("friedfood");
	}
});

$("#cafe").click(function () {
	if ($("#cafe").is(":checked")) {
		checkService("cafe");
	} else {
		uncheckService("cafe");
	}
});

$("#lotto").click(function () {
	if ($("#lotto").is(":checked")) {
		checkService("lotto");
	} else {
		uncheckService("lotto");
	}
});

$("#toto").click(function () {
	if ($("#toto").is(":checked")) {
		checkService("sportstoto");
	} else {
		uncheckService("sportstoto");
	}
});

$("#medicine").click(function () {
	if ($("#medicine").is(":checked")) {
		checkService("medicine");
	}
	else {
		uncheckService("medicine");
	}
});

fetchFilteredCVS = function (locationData, selectedServices) {
	var cvsData = {
		location: locationData,
		services: selectedServices
	}
	fetch('/db', {
		method: 'POST', // or 'PUT'
		// data can be `string` or {object}!
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(cvsData)
	}).then(function (response) {
		return response.json();
	}).then((json) => {
		markers.splice(0, markers.length);
		infowindows.splice(0, infowindows.length);

		for (var i = 0; i < json.length; i++) {
			var markerPosition = new kakao.maps.LatLng(json[i].latitude, json[i].longitude);
			var CVSCompandy;
			if(json[i].BrandName.substring(0,2) == "CU"){
				CVSCompandy = new kakao.maps.MarkerImage(
					'image/CUMarker.png',
					new kakao.maps.Size(60, 80),
					{
						// offset: new kakao.maps.Point(16, 34),
						// alt: "마커 이미지 예제",
						// shape: "poly"
						// //coords: "1,20,1,9,5,2,10,0,21,0,27,3,30,9,30,20,17,33,14,33"
					}
				);
			}
			else{
				CVSCompandy = new kakao.maps.MarkerImage(
					'image/GS25Marker.png',
					new kakao.maps.Size(60, 80),
					{
						// offset: new kakao.maps.Point(16, 34),
						// alt: "마커 이미지 예제",
						// shape: "poly",
						// coords: "1,20,1,9,5,2,10,0,21,0,27,3,30,9,30,20,17,33,14,33"
					}
				);
			}
			// 마커를 생성합니다
			
			markers.push(new kakao.maps.Marker({
				position: markerPosition,
				image:CVSCompandy
			}))
			// 마커가 지도 위에 표시되도록 설정합니다
			markers[markers.length - 1].setMap(map);

			var iwContent = '<div style="padding:5px;">' + json[i].BrandName + '</div><div style="padding:5px;">' + json[i].BranchName + '</div><div style="padding:5px;">' + json[i].address + '</div>' // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
			iwPosition = new kakao.maps.LatLng(json[i].latitude, json[i].longitude); //인포윈도우 표시 위치입니다

			// 인포윈도우를 생성합니다

			infowindows.push(new kakao.maps.InfoWindow({
				position: iwPosition,
				content: iwContent,
				removable: true
			}))

			// 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다

			// 지도 중심좌표를 접속위치로 변경합니다

			kakao.maps.event.addListener(markers[i], 'click', makeClickListener(map, markers[i], infowindows[i]));

			infowindows[i].open();
		}
		console.log("길이 :" + markers.length)

		if (selectedServices.length == 0) setMarkers(null);
	});
}

function makeClickListener(map, marker, infowindow) {
	return function () {
		console.log("인포윈도우클릭!!")
		infowindow.open(map, marker);
	};
}

var searchCurrentAdress = function () {
	var coords = map.getCenter();

	geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), function (result, status) {
		if (status === kakao.maps.services.Status.OK) {

			var locationData = {
				gu: result[0].region_2depth_name,
				dong: result[0].region_3depth_name
			}
			//선택된 서비스로 필터링된 편의점들을 데베에서 가져와서 지도에 출력
			fetchFilteredCVS(locationData, selectedServices);

		} else {
			console.log("error");
			return "실패";
		};
	});
}