var selectedServices = new Array;

$("#ATM").click(function () {
	if ($("#ATM").is(":checked")) {		
		console.log("ATM 체크했음!");
		selectedServices.push("ATM");
		console.log(selectedServices)
		searchCurrentAdress();
		//fetchDb(selectedServices);

	} else {
		console.log("ATM 체크 해제!");
		const idx = selectedServices.findIndex(function (item) { return item === "ATM" }) // findIndex = find + indexOf 
		if (idx > -1) selectedServices.splice(idx, 1)
		console.log(selectedServices)
		searchCurrentAdress();
		//fetchDb(selectedServices);
	}
});

$("#deliver").click(function () {
	if ($("#deliver").is(":checked")) {
		console.log("parcel 체크했음!");
		selectedServices.push("parcel");
		console.log(selectedServices)
		searchCurrentAdress();
	} else {
		console.log("parcel 체크 해제!");
		const idx = selectedServices.findIndex(function (item) { return item === "parcel" }) // findIndex = find + indexOf 
		if (idx > -1) selectedServices.splice(idx, 1)
		console.log(selectedServices)
		searchCurrentAdress();
		
	}
});

// document.addEventListener("DOMContentLoaded", function () {
// 	$("#bakery").click(function () {
// 		if ($("#bakery").is(":checked")) {
// 			console.log("bakery 체크했음!");
// 			fetchDb(3, true);
// 		} else {
// 			console.log("bakery 체크 해제!");
// 			fetchDb(3, false);
// 		}
// 	});
// });
// document.addEventListener("DOMContentLoaded", function () {
// 	$("#friedchicken").click(function () {
// 		if ($("#friedchicken").is(":checked")) {
// 			console.log("friedchicken 체크했음!");
// 			fetchDb(4, true);
// 		} else {
// 			console.log("friedchicken 체크 해제!");
// 			fetchDb(4, false);
// 		}
// 	});
// });
// document.addEventListener("DOMContentLoaded", function () {
// 	$("#cafe").click(function () {
// 		if ($("#cafe").is(":checked")) {
// 			console.log("cafe 체크했음!");
// 			fetchDb(5, true);
// 		} else {
// 			console.log("cafe 체크 해제!");
// 			fetchDb(5, false);
// 		}
// 	});
// });
// document.addEventListener("DOMContentLoaded", function () {
// 	$("#lotto").click(function () {
// 		if ($("#lotto").is(":checked")) {
// 			console.log("lotto 체크했음!");
// 			fetchDb(6, true);
// 		} else {
// 			console.log("lotto 체크 해제!");
// 			fetchDb(6, false);
// 		}
// 	});
// });
// document.addEventListener("DOMContentLoaded", function () {
// 	$("#toto").click(function () {
// 		if ($("#toto").is(":checked")) {
// 			console.log("toto 체크했음!");
// 			fetchDb(7, true);
// 		} else {
// 			console.log("toto 체크 해제!");
// 			fetchDb(7, false);
// 		}
// 	});
// });
// document.addEventListener("DOMContentLoaded", function () {
// 	$("#medicine").click(function () {
// 		if ($("#medicine").is(":checked")) {
// 			console.log("medicine 체크했음!");
// 			fetchDb(8, true);
// 		}
// 		else {
// 			console.log("medicine 체크 해제!");
// 			fetchDb(8, false);
// 		}
// 	});
// });

// function fetchDb(selectedServices) {

// 	var obj = {
// 		services: selectedServices
// 	}

// 	var data = JSON.stringify(obj);

// 	//console.log(data);
// 	fetch('/db', {
// 		method: 'POST', // or 'PUT'
// 		// data can be `string` or {object}!
// 		headers: {
// 			'Content-Type': 'application/json'
// 		},
// 		body: JSON.stringify(obj)

// 	}).then(function (response) {
// 		return response.json();
// 	}).catch(function (err) {
// 		console.log(err);
// 	})
// }

fetchFilteredCVS = function (locationData, selectedServices) {
	var obj = {
		location: locationData,
		services: selectedServices
	}
	fetch('/db', {
		method: 'POST', // or 'PUT'
		// data can be `string` or {object}!
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(obj)
	}).then(function (response) {
		return response.json();
	}).then((json) => {
		console.log(json)
		var data = JSON.stringify(json)
		console.log("length : " + json.length);
		for (var i = 0; i < json.length; i++) {
			var markerPosition = new kakao.maps.LatLng(json[i].latitude, json[i].longitude);

			// 마커를 생성합니다
			var marker = new kakao.maps.Marker({
				position: markerPosition
			});

			// 마커가 지도 위에 표시되도록 설정합니다
			marker.setMap(map);

			var iwContent = '<div style="padding:5px;">' + json[i].BrandName + '</div><div style="padding:5px;">' + json[i].BranchName + '</div><div style="padding:5px;">' + json[i].address + '</div>' // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
			iwPosition = new kakao.maps.LatLng(33.450701, 126.570667); //인포윈도우 표시 위치입니다

			// 인포윈도우를 생성합니다
			var infowindow = new kakao.maps.InfoWindow({
				position: iwPosition,
				content: iwContent,
				removable: true
			});

			// 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다

			// 지도 중심좌표를 접속위치로 변경합니다
			kakao.maps.event.addListener(marker, 'click', makeClickListener(map, marker, infowindow));
		}
	});
}

function makeClickListener(map, marker, infowindow) {
	return function () {
		infowindow.open(map, marker);
	};
}

var searchCurrentAdress = function () {
	var coords = map.getCenter();
	//const XHR = new XMLHttpRequest();
	geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), function (result, status) {
		if (status === kakao.maps.services.Status.OK) {
			//document.querySelector('#btn').addEventListener('click', (e) => {
			var locationData = {
				gu: result[0].region_2depth_name,
				dong: result[0].region_3depth_name
			}
			//선택된 서비스로 필터링된 편의점들을 데베에서 가져와서 지도에 출력
			fetchFilteredCVS(locationData, selectedServices);
			//});
		} else {
			console.log("error");
			return "실패";
		};
	});
}