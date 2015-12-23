<?php 
// No direct access
defined('_JEXEC') or die; ?>
<?php echo $hello; ?>
<script type="text/javascript">
	function loadjscssfile(filename, filetype){
		if (filetype=="js"){ //if filename is a external JavaScript file
			var fileref=document.createElement('script')
			fileref.setAttribute("type","text/javascript")
			fileref.setAttribute("src", filename)
		}
		else if (filetype=="css"){ //if filename is an external CSS file
			var fileref=document.createElement("link")
			fileref.setAttribute("rel", "stylesheet")
			fileref.setAttribute("type", "text/css")
			fileref.setAttribute("href", filename)
		}
		if (typeof fileref!="undefined")
			document.getElementsByTagName("head")[0].appendChild(fileref)
	}

	loadjscssfile("<?php echo JURI::base().'media/mod_mrtjourneywidget/js/main.js'; ?>", "js");
	//loadjscssfile("<?php echo JURI::base().'media/mod_mrtjourneywidget/css/mrt.css'; ?>", "css");
</script>
