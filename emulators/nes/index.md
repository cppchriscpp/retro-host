---
name: WebNES
url: https://github.com/peteward44/WebNES
license: MIT
license_url: https://github.com/peteward44/WebNES/blob/master/LICENSE
author: peteward44
author_url: https://github.com/peteward44
width: 540
height: 540
---
<!DOCTYPE HTML>
<html lang="en">
<head>
    <base href="/retro-host/static/nes/">
    <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1"/>
	<title>WebNES</title>
    <meta charset="utf-8"/>
	<meta http-equiv="Cache-Control" content="no-store" /> <!-- stops chrome from caching -->
    
	<link rel="stylesheet" href="css/thirdparty.min.css">
	
	<link rel="stylesheet" href="css/main.min.css">
	
	<link rel="stylesheet" href="css/nes.custom.css">

</head>

<!-- onunload="" prevents firefox caching javascript files -->
<body onunload="" id="body">
<div id="fb-root"></div>
	<!-- facebook api -->
	<script>(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); js.id = id;
	  js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.0&appId=310800822454793";
	  fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));</script>
	
	<div id="content" class="normal" style="width:100%; height:100%; display:inline-block">
		<div id="canvasWrapper" class="wrapper">
		</div>
		<div id="controlBar" class="controlBar">
			<div id="debugBar" class="ui-widget-header ui-corner-all">
				<button class="controlBarButton" id="debugControlBar_playOneFrameButton"></button>
				<div class="controlBarSeperator"></div>
				<button class="controlBarButton" id="debugControlBar_gameSpeedButton"></button>
				<!--<button class="controlBarButton" id="debugControlBar_getFrameHashButton"></button>-->
				<div class="controlBarSeperator"></div>
				<span id="debugControlBar_encoding">
					<input type="radio" id="debugControlBar_encodingNTSC" name="debugControlBar_encoding" value="NTSC"><label for="debugControlBar_encodingNTSC">NTSC</label>
					<input type="radio" id="debugControlBar_encodingPAL" name="debugControlBar_encoding" value="PAL"><label for="debugControlBar_encodingPAL">PAL</label>
				</span>
				<div class="controlBarSeperator"></div>
				<button class="controlBarButton" id="debugControlBar_selectTraceButton"></button>
				<ul id="debugControlBar_traceMenu">
					<li class="controlBarMenuButton" id="controlBar_cpuTraceParent"><input type="checkbox" id="controlBar_cpuTraceButton"><label for="controlBar_cpuTraceButton">CPU</label></li>
					<li class="controlBarMenuButton" id="controlBar_cpuInstructionsTraceParent"><input type="checkbox" id="controlBar_cpuInstructionsTraceButton"><label for="controlBar_cpuInstructionsTraceButton">CPU Instructions</label></li>
					<li class="controlBarMenuButton" id="controlBar_ppuTraceParent"><input type="checkbox" id="controlBar_ppuTraceButton"><label for="controlBar_ppuTraceButton">PPU</label></li>
					<li class="controlBarMenuButton" id="controlBar_mapperTraceParent"><input type="checkbox" id="controlBar_mapperTraceButton"><label for="controlBar_mapperTraceButton">Mapper</label></li>
					<li class="controlBarMenuButton" id="controlBar_allTraceParent"><input type="checkbox" id="controlBar_allTraceButton"><label for="controlBar_allTraceButton">All</label></li>
				</ul>
				<button class="controlBarButton" id="debugControlBar_traceButton"></button>
			</div>
			<div id="normalBar" class="ui-widget-header ui-corner-all">
				<button class="controlBarButton" id="controlBar_loadRomButton"></button>
				<div class="controlBarSeperator"></div>
				<button class="controlBarButton" id="controlBar_resetButton"></button>
				<div class="controlBarSeperator"></div>
				<button class="controlBarButton" id="controlBar_playButton"></button>
				<div class="controlBarSeperator"></div>
				<button class="controlBarButton" id="controlBar_soundButton"></button>
				<button class="controlBarButton" id="controlBar_screenshotButton"></button>
				<div class="controlBarSeperator"></div>
				<button class="controlBarButton" id="controlBar_quickSaveButton"></button>
				<button class="controlBarButton" id="controlBar_quickLoadButton"></button>
				<div class="controlBarSeperator"></div>
				<input class="controlBarButton" type="checkbox" id="controlBar_debugButton"><label for="controlBar_debugButton"></label>
				<div class="controlBarSeperator"></div>
				<button class="controlBarButton" id="controlBar_keyboardRemap"></button>
				<div class="controlBarSeperator"></div>
				<button class="controlBarButton" id="controlBar_gameGenieButton"></button>
				<button class="controlBarButton" id="controlBar_errorDisplay"></button>
			</div>
		</div>
		<div id="controlBar_volumeSlider"></div>
		<div id="controlBar_alertMessage"></div>
		<div id="debugControlBar_gameSpeedSlider"></div>
		<div id="loadStateDialog">
			<div id="loadStateDialog_contents"></div>
		</div>
		<div id="debugWindow" class="debugWindow">
<!-- 			<div class="cpuInstructions">
			</div>
			<div class="logWindow">
			</div>
			<div class="paletteDisplay">
			</div>
			<div class="spriteDisplay">
			</div> -->
		</div>
		<div id="gameGenieDialog" class="gameGenieDialog">
			<div id="gameGenieDialog_contents"></div>
		</div>
		<div id="keyboardRemapperDialog" class="gameGenieDialog">
			<div id="keyboardRemapperDialog_contents">
				<map name="controllermap1">
					<area shape="rect" coords="50, 40, 74, 60" alt="UP" onclick="Gui.keyboardRemapperDialog_onsetkeyclick( 0, 'UP' );" data-maphilight='{"strokeColor":"ff2a00","strokeWidth":1,"fillColor":"ff0000","fillOpacity":0.4}'/>
					<area shape="rect" coords="50, 77, 74, 97" alt="DOWN" onclick="Gui.keyboardRemapperDialog_onsetkeyclick( 0, 'DOWN' );" data-maphilight='{"strokeColor":"ff2a00","strokeWidth":1,"fillColor":"ff0000","fillOpacity":0.4}'/>
					<area shape="rect" coords="34, 56, 54, 80" alt="LEFT" onclick="Gui.keyboardRemapperDialog_onsetkeyclick( 0, 'LEFT' );" data-maphilight='{"strokeColor":"ff2a00","strokeWidth":1,"fillColor":"ff0000","fillOpacity":0.4}'/>
					<area shape="rect" coords="72, 56, 91, 80" alt="RIGHT" onclick="Gui.keyboardRemapperDialog_onsetkeyclick( 0, 'RIGHT' );" data-maphilight='{"strokeColor":"ff2a00","strokeWidth":1,"fillColor":"ff0000","fillOpacity":0.4}'/>
					<area shape="rect" coords="110, 72, 137, 89" alt="SELECT" onclick="Gui.keyboardRemapperDialog_onsetkeyclick( 0, 'SELECT' );" data-maphilight='{"strokeColor":"ff2a00","strokeWidth":1,"fillColor":"ff0000","fillOpacity":0.4}'/>
					<area shape="rect" coords="137, 72, 165, 89" alt="START" onclick="Gui.keyboardRemapperDialog_onsetkeyclick( 0, 'START' );" data-maphilight='{"strokeColor":"ff2a00","strokeWidth":1,"fillColor":"ff0000","fillOpacity":0.4}'/>
					<area shape="rect" coords="182, 66, 210, 94" alt="B" onclick="Gui.keyboardRemapperDialog_onsetkeyclick( 0, 'B' );" data-maphilight='{"strokeColor":"ff2a00","strokeWidth":1,"fillColor":"ff0000","fillOpacity":0.4}'/>
					<area shape="rect" coords="219, 66, 248, 94" alt="A" onclick="Gui.keyboardRemapperDialog_onsetkeyclick( 0, 'A' );" data-maphilight='{"strokeColor":"ff2a00","strokeWidth":1,"fillColor":"ff0000","fillOpacity":0.4}'/>
				</map>
				<map name="controllermap2">
					<area shape="rect" coords="50, 40, 74, 60" alt="UP" onclick="Gui.keyboardRemapperDialog_onsetkeyclick( 1, 'UP' );" data-maphilight='{"strokeColor":"ff2a00","strokeWidth":1,"fillColor":"ff0000","fillOpacity":0.4}'/>
					<area shape="rect" coords="50, 77, 74, 97" alt="DOWN" onclick="Gui.keyboardRemapperDialog_onsetkeyclick( 1, 'DOWN' );" data-maphilight='{"strokeColor":"ff2a00","strokeWidth":1,"fillColor":"ff0000","fillOpacity":0.4}'/>
					<area shape="rect" coords="34, 56, 54, 80" alt="LEFT" onclick="Gui.keyboardRemapperDialog_onsetkeyclick( 1, 'LEFT' );" data-maphilight='{"strokeColor":"ff2a00","strokeWidth":1,"fillColor":"ff0000","fillOpacity":0.4}'/>
					<area shape="rect" coords="72, 56, 91, 80" alt="RIGHT" onclick="Gui.keyboardRemapperDialog_onsetkeyclick( 1, 'RIGHT' );" data-maphilight='{"strokeColor":"ff2a00","strokeWidth":1,"fillColor":"ff0000","fillOpacity":0.4}'/>
					<area shape="rect" coords="110, 72, 137, 89" alt="SELECT" onclick="Gui.keyboardRemapperDialog_onsetkeyclick( 1, 'SELECT' );" data-maphilight='{"strokeColor":"ff2a00","strokeWidth":1,"fillColor":"ff0000","fillOpacity":0.4}'/>
					<area shape="rect" coords="137, 72, 165, 89" alt="START" onclick="Gui.keyboardRemapperDialog_onsetkeyclick( 1, 'START' );" data-maphilight='{"strokeColor":"ff2a00","strokeWidth":1,"fillColor":"ff0000","fillOpacity":0.4}'/>
					<area shape="rect" coords="182, 66, 210, 94" alt="B" onclick="Gui.keyboardRemapperDialog_onsetkeyclick( 1, 'B' );" data-maphilight='{"strokeColor":"ff2a00","strokeWidth":1,"fillColor":"ff0000","fillOpacity":0.4}'/>
					<area shape="rect" coords="219, 66, 248, 94" alt="A" onclick="Gui.keyboardRemapperDialog_onsetkeyclick( 1, 'A' );" data-maphilight='{"strokeColor":"ff2a00","strokeWidth":1,"fillColor":"ff0000","fillOpacity":0.4}'/>
				</map>
				<div>
					<h1>Player 1</h2>
					<img class="keyboardMap" src="images/nescontroller.jpg" alt="" usemap="#controllermap1"/>
				</div>
				<div>
					<h1>Player 2</h2>
					<img class="keyboardMap" src="images/nescontroller.jpg" alt="" usemap="#controllermap2"/>
				</div>
			</div>
			<div id="keyboardRemapperSetKeyDialog">
				<div id="keyboardRemapperSetKeyDialog_existingKeysContents">
				</div>
				<div id="keyboardRemapperSetKeyDialog_contents">
				</div>
			</div>
		</div>
	</div>

	<script src="js/nes.components.min.js"></script>
		
	<script src="js/nes.min.js"></script>
	<script>Gui.App.loadRomFromUrl('{{ include.rom }}');</script>
</body>
</html>
