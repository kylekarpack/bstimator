"use strict";

$(window).load(function() {

	$(".compare").bind("click", function() {
		var name = this.id;
		$(this).button('loading')
		$.ajax({
				type: "GET",
				url: "api.php",
				data: { "essay": name },
				success: function(data) {
					$("textarea")[0].value = $.parseJSON(data).essay;
					$(".compare").button('reset');
					$("#bstimate span").text(name + "'s");
					calc();
				},
			});
	});
	
	$("#add").bind("click", function() {
		var name = $("input")[0].value;
		var bstimate = calc();
		$.ajax({
				type: "POST",
				url: "api.php",
				data: { "name": name, "score": bstimate, "essay":($("input[type='checkbox']").is(":checked") ? "" : $("textarea")[0].value)	}
			});
		$("input")[0].value = "";
		$(this).text("Added!").attr("disabled","disabled");
		$("input").animate({"width":0, "opacity":0});
		$("#output > p, label").fadeOut();
		
		//add it to the list
		var vals = [];
		$("td.bstimate").each(function() { vals.push(parseFloat($(this).text()))});
		var i = 0;
		while (bstimate < vals[i]) {
			i++;
		}
		$($("td.bstimate")[i]).parent().before("<tr><td>" + name + "</td><td class='bstimate'>" + bstimate + "</td><td><button type='button' disabled='disabled' class='btn bstimate'>Yours!</button></td></tr>").hide().slideDown();
});
	
	$("#calc").bind("click", function() {
		$("textarea")[0].value !== "" ? calc() : $(".text-error");
	});
	
	//calculate again onchange
	$("textarea")[0].onkeyup = calc;
    $("textarea")[0].onblur = calc;
	
	function calc() {
		$(".text-error").fadeOut();
		
		var str = $("textarea")[0].value.trim();
		
		//exclude bibliographies
		str = str.split("Works Cited")[0];
		str = str.split("Works Consulted")[0];
		str = str.split("Bibliography")[0];
		
		//array of all words
		var arr = str.split(" ");
		
		//split on periods for sentence count
		var sentences = str.match(/\./g) !== null ? str.match(/\./g).length : 1;
		
		//count commas
		var commas = str.split(",").length - 1;
		commas = Math.round(commas / sentences * 100) / 100
		
		var words = arr.length;
		var chars = str.length - words + 1; //fencepost

		var avgWordLen = chars / words;
		avgWordLen = Math.round(avgWordLen * 100) / 100; //3 digit float

		$("#wordLen").text("");
		$("#wordLen").append(avgWordLen + " characters");
		
		var avgSentenceLen = Math.round((words / sentences) * 10) / 10; //1 digit float
		
		$("#senLen").text("");
		$("#senLen").append(avgSentenceLen + " words");
		
		$("#commas").text("");
		$("#commas").append(commas + " commas");

		var bs = ['roi', 'user-contributed', 'semantic', 'magnetic', 'global', 'dynamic', 'bandwidth', 'solutions', 'innovative', 'implement', 'networks', 'relationships', 'web', 'holistic', 'e-business', 'extensible', 'distributed', 'cross-platform', 'transparent', 'granular', 'compelling', 'systems', 'rich', 'empower', 'extensive', 'citizen-media', 'mission-critical', 'schemas', 'scalable', 'effects', 'communities', 'strategic', 'web-readiness', 'blogging', 'expedite', 'open-source', 'niches', 'evolution', 'one-to-one', 'intuitive', 'convergence--transform', 'podcasts:', 'morph', 'exploit', 'integrated', 'mashups', 'transform', 'world-class', 'value-added', 'enhance', 'feeds', 'reinvent', 'redefine', 'infomediaries', 'reintermediate', 'peer-to-peer', 'platforms', 'e-services', 'folksonomies', 'investment', 'viral', 'visualize', 'network', 'weblogs', 'revolutionize', 'extensively', 'content', 'ecologies', 'productize', 'viable', 'orchestrate', 'vertical', 'leading-edge', 'best-of-breed', 'interfaces', 'deliver', 'deliverables', 'streamline', 'web-enabled', 'mindshare', '24/365', 'post', 'business', 'optimize', 'repurpose', 'revolutionary', 'monetize', 'paradigms', 'user-centred', 'transition', 'e-enable', 'networkeffects', 'social', 'distinction', 'wikis', 'interactive', 'facilitate', 'out-of-the-box', 'partnerships', 'real-time', 'disintermediate', 'truism', 'technologies', 'seamless', 'channels', 'aggregate', 'synthesize', 'harness', 'long-tail', 'maximize', 'iterate', 'user-centric', 'engineer', 'synergize', 'plug-and-play', 'blogospheres', 'networking', 'leverage', 'b2c', 'create', 'sociopolitical', 'system', 'b2b', 'vortals', 'beta-test', 'resulted', 'a-list', 'sexy', 'markets', 'standards-compliant', 'enable', 'integrateajax-enabled', 'generate', 'mind', 'brand', 'benchmark', 'innovate', 'clue', 'wireless', 'integrate', 'rich-clientapis', 'train', 'syndicate', 'convergence', 'synergistic', 'widgets', 'sticky', 'extend', 'target', 'embedded', 'engage', 'cutting-edge:', 'value', 'podcasts', 'strategize', 'architect', 'next-generation', 'synergies', 'proactive', 'blogosphere', 'portals', 'whiteboard', 'turn-key', 'share', 'drive', 'envisioneer', 'authentic', 'tag', 'embrace', 'cluetrain', 'cultivate', 'incubate', 'incentivize', 'capture', 'podcasting', 'e-commerce', 'efficient', 'recontextualize', 'enterprise', 'utilize', 'virtual', 'frictionless', 'tagclouds', 'predominant', 'eyeballs', 'rss-capable', 'evolve', 'killer', 'ubiquitous', 'users', 'collaborative', 'deploy', 'models', 'visionary', 'metrics', 'applications', 'bricks-and-clicks', 'mesh', 'experiences', 'scale', 'services', 'robust', 'infrastructures', 'e-markets', 'grow', 'folksonomies:', 'matrix', 'delivery', 'remix', 'methodologies', 'clicks-and-mortar', 'seize', 'action-items', 'architectures', 'customized', '24/7', 'webservices', 'components', 'unleash', 'impactful'];
		var bsWordsUsed = [];
		var bsCount = 0;
		
		for (var i = 0; i < arr.length; i++) {
			if ($.inArray(arr[i].toLowerCase(), bs) !== -1) {
				bsCount++;
				if($.inArray(arr[i].toLowerCase(), bsWordsUsed) == -1) {
					bsWordsUsed.push(arr[i].toLowerCase());
				}
			}
		}
		
		var bsPer = Math.round((bsCount / words * 100) * 100) / 100;
		
		$("#bsCount").text("");
		$("#bsCount").append(bsCount + " words / " + words + " total words");
		
		$("#bsPer").text("");
		$("#bsPer").append(bsPer + " percent");
		
		
		//CALCULATE BSTIMATE
		
		//function to calculate a given bstimate factor and set width of bars
		function values(id, target, max) {
			var output = target < max ? target / max : max / max;
			$(id).css({"width": (output * 100) + "%"});
			return output;
		}
		
		var wF = values("#barWord", avgWordLen, 10);
		var sF = values("#barSen", avgSentenceLen, 35);
		var bF = values("#barPer", bsPer, 20);
		var cF = values("#comBar", commas, 2);
		
		$(".badge").text("");
		$(".badge").text(bsCount);
		$(".badge").popover();
		$(".badge").attr("data-content", bsWordsUsed.join(", "));
		
		var values = [wF, sF, cF, bF];
		var bstimate = $("textarea")[0].value !== "" ? (values.reduce(function(a, b) { return a + b })) / values.length : 0;
		$("#bsBar").css({"width": (bstimate * 100) + "%"});
		
		$("#bstimate").text("");
		$("#bstimate").append("<p><b>" + Math.round(bstimate * 1000) / 1000 + "</b> is <span>your</span> BS Factor!</p>");
		return Math.round(bstimate * 1000) / 1000;
	}
});