(function() {
	var doorPanel = document.querySelector("#doorPanel");
	var modifyButton = document.querySelector("#modify");
	var modifyDialog = document.querySelector("#modifyDialog");
	var doorOptions = document.querySelector("#doorOptions");
	var submitOptions = document.querySelector("#submitOptions");
	var cancelOptions = document.querySelector("#cancelOptions")

	// ********** startup ***********

	// check query string for options
	var options = getQueryOptions();

	if (options.length	) {
		// build doors
		buildDoors(options);
		// put options in doorOptions
		fillOptions(options);
		
	} else {
		modifyButtonHandler();
	}

	// bind events
	bindEvents();

	function bindEvents() {
		submitOptions.addEventListener("click", submitOptionsHandler);
		modifyButton.addEventListener("click", modifyButtonHandler);
		doorPanel.addEventListener("click", doorPanelHandler);
		cancelOptions.addEventListener("click", cancelOptionsHandler);
	}

	function submitOptionsHandler(evt) {
		var r = /^\s*$/;
		var options = doorOptions.value.split("\n").filter(function (i) {
			console.log(r, i, r.test(i))
			return (! r.test(i));
		});

		if (options) {
			window.location.search = "?" + options.map(function(i,n) {
				return "o" + n + "=" + encodeURI(i);
			}).join("&");
		}
	}

	function modifyButtonHandler(evt) {
		modifyDialog.classList.remove("hidden");
	}

	function doorPanelHandler(evt) {
		var node = evt.target;

		if ((! node.classList.contains("door")) ||
			node.classList.contains("open")) {
			return;
		}

		node.classList.add("open");
		var prize = node.querySelector(".prize");
		prize.innerHTML = chooseOption();
		var rects = prize.getClientRects()[0];
		prize.style.top = ((143-rects.height)/2 + 38) + "px";
	}

	function cancelOptionsHandler() {
		modifyDialog.classList.add("hidden");
	}

	function chooseOption() {
		return options.splice(
			Math.floor(Math.random() * options.length),
			1
		);
	}

	function fillOptions(options) {
		doorOptions.value = options.join("\n");
	}
	function buildDoors(options) {
		options.forEach(function(i) {
			var doorDiv = buildDoor();
			doorPanel.appendChild(doorDiv);	
		})
	}

	function buildDoor() {
		var doorDiv = document.createElement("div")
		doorDiv.classList.add("door");
		doorDiv.innerHTML = "<p class='prize'></p>";
		return doorDiv;
	}

	function getQueryOptions() {
		var query = window.location.search, 
			options = query.split("&");

		if (options) {
			options = options.filter(function(i) {
				return /^\??o\d+=/.test(i);
			}).map(function(i) {
				return decodeURI(i.replace(/^\??o\d+=/,""));
			});
		}

		return options;
	}
})()