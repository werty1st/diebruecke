require.config({
	baseUrl: "",
	paths: {
		// first party
        "dr-site-commment": "004/dr/elements/dr-site-comment.js",
        "dr-ui-maxlines": "004/dr/ui/dr-ui-maxlines",
        
        "dr-media-player-factory": "004/dr/widgets/dr-widget-media",
        "dr-media-gemius-implementation": "004/dr/widgets/dr-widget-media",
        "dr-media-gemius-implementation-test": "004/dr/widgets/dr-widget-media",
        "dr-media-conviva-implementation": "004/dr/widgets/dr-widget-media",
        "dr-media-sola-implementation": "004/dr/widgets/dr-widget-media",
        "dr-media-springstreams-implementation": "004/dr/widgets/dr-widget-media",
        "dr-media-hash-implementation": "004/dr/widgets/dr-widget-media",
        "dr-widget-video-player-factory": "004/dr/widgets/dr-widget-media",
		"dr-widget-video-player": "004/dr/widgets/dr-widget-media",
		"dr-widget-video-playlist": "004/dr/widgets/dr-widget-media",
		"dr-widget-audio-player": "004/dr/widgets/dr-widget-media",
		"dr-widget-audio-playlist": "004/dr/widgets/dr-widget-media",
		"dr-widget-media-playlist": "004/dr/widgets/dr-widget-media",
		"dr-media-audio-player": "004/dr/widgets/dr-widget-media",
		"dr-media-html5-audio-player": "004/dr/widgets/dr-widget-media/Html5AudioPlayer",
		"dr-media-flash-audio-player": "004/dr/widgets/dr-widget-media/FlashAudioPlayer",
		"dr-widget-chaos-upload": "004/dr/widgets/dr-widget-chaos/dr-widget-chaos-upload",

		"dr-widget-scribblelive": "004/dr/widgets/dr-widget-scribblelive",
		"dr-widget-scribblelive-v2": "004/dr/widgets/dr-widget-scribblelive-v2",
		"dr-widget-1212": "004/dr/widgets/dr-widget-1212/dr-widget-1212",
		"dr-widget-carousel-gallery-list": "004/dr/widgets/dr-widget-carousel-gallery-list/dr-widget-carousel-gallery-list",

		"dr-widget-swipe-carousel": "004/dr/widgets/dr-widget-swipe-carousel",
		"dr-widget-swipe-carousel-iscroll": "004/dr/widgets/dr-widget-swipe-carousel-iscroll",

		"dr-widget-infoGraphics-scale": "004/dr/widgets/dr-widget-infographics-scale",

		// third party
		"more": "004/more",
		"knockout": "shared/knockout/2.2/knockout-2.2.1",
		"knockout-bindings": "shared/knockout/extras/ko-dr-bindings",
		"knockout-mapping": "shared/knockout/2.2/knockout.mapping-latest",
		"raphael": "shared/raphael/1.5.1/raphael-min",
		"raphael2": "shared/raphael/2.1.0/raphael-min",
		"mustache": "shared/mustache/0.7.0/mustache",
		"swfobject": "shared/swfobject/1.5/swfobject",
		"gstream": "shared/gstream/6.0/gstream",
        "swipejs": "js/libs/1swipe",
        "iscroll": "shared/iscroll/iscroll",
        "fileupload": "shared/fileupload/upload",
		"conviva": "shared/conviva/2.64.0.68610/LivePass.js?customerId=c3.DR-DK",
		"sola": "http://79423.analytics.edgesuite.net/html5/akamaihtml5-min",
		"twitter-widgets": "shared/twitter/widgets",
		"facebook-jssdk": "http://connect.facebook.net/da_DK/all.js#xfbml=1",
		"springstreams": "shared/springstreams/1.9/springstreams",
		// would prefer external module, but fails (requirejs still attempts to find it locally):
		//"twitter-widgets": "http://platform.twitter.com/widgets",

		//dr-graph
		"dr-chart-gibson-reg"						: "shared/dr/dr-graph/Gibson-Regular_400_128.font",
		"dr-chart-gibson-semi-bold"					: "shared/dr/dr-graph/Gibson-SemiBold_600_128.font",
        "dr-chart"									: "shared/dr/dr-graph/Chart",
		"dr-chart-legend"							: "shared/dr/dr-graph/ChartLegend",
		"dr-chart-calculations"						: "shared/dr/dr-graph/Calculations",
		"dr-chart-value-label"						: "shared/dr/dr-graph/ChartValueLabel",
		"dr-chart-coordinatesystem"					: "shared/dr/dr-graph/Coordinatesystem",
		"dr-chart-coordinatesystem-dotted-line"		: "shared/dr/dr-graph/CoordinatesystemDottedLine",
		"dr-chart-coordinatesystem-x-label"			: "shared/dr/dr-graph/CoordinatesystemXlabel",
		"dr-bar-chart"								: "shared/dr/dr-graph/BarChart",
		"dr-bar-chart-bar"							: "shared/dr/dr-graph/BarChartBar",
		"dr-bar-chart-events"						: "shared/dr/dr-graph/BarChartEvents",
		"dr-pie-chart"								: "shared/dr/dr-graph/PieChart",
		"dr-pie-chart-pie"							: "shared/dr/dr-graph/PieChartPiece",
		"dr-pie-chart-events"						: "shared/dr/dr-graph/PieChartEvents",
		"dr-line-chart"								: "shared/dr/dr-graph/LineChart",
		"dr-line-chart-line"						: "shared/dr/dr-graph/LineChartLine",
		"dr-line-chart-point"						: "shared/dr/dr-graph/LineChartPoint",
		"dr-line-chart-events"						: "shared/dr/dr-graph/LineChartEvents"
	},
	shim: {
		"more": {
			exports: "MooTools.More"
		},
		"raphael": {
			exports: "Raphael"
		},
		"raphael2": {
			exports: "Raphael"
		},
		"swfobject": {
			exports: "SWFObject"
		},
		"knockout": {
			exports: "ko"
		},
		"knockout-bindings": {
		    deps: ["knockout"]
		},
		"knockout-mapping": {
		    deps: ["knockout"]
		},
		"swipejs": {
            exports: "Swipe"
        }
	}
});
