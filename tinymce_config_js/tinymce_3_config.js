// TinyMCE 3 configuration
// Modify the following code to customize TinyMCE

tinyMCE.init({
	// General options
	selector: "textarea",
	theme : "advanced",
	skin : "o2k7",
	skin_variant : "silver",
	
	// Only required plugins are included. However, you can add more as per your needs. 
	plugins : "lists,advimage,advlink,emotions,preview,media,searchreplace,contextmenu,spellchecker,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,inlinepopups",

	// Theme options (toolbars)
	theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,forecolor,backcolor,|,justifyleft,justifycenter,justifyright,justifyfull,|,sub,sup,|,bullist,numlist,|,outdent,indent,|,blockquote,abbr,|,link,unlink,|,image,media,|,preview",
	theme_advanced_buttons2 : "undo,redo,formatselect,fontselect,fontsizeselect,pastetext,pasteword,|,spellchecker,|,search,replace,|,hr,|,removeformat,|,charmap,emotions,|,code,|,fullscreen",
	// theme_advanced_buttons3: " add buttons here",
	
	// Additional options, customize them as per your needs.
	height: 400,
	theme_advanced_toolbar_location : "top",
	theme_advanced_toolbar_align : "left",
	theme_advanced_statusbar_location : "bottom",
	theme_advanced_resizing : true,
	
	// Example content CSS (should be your site CSS) for better typography
	content_css : "/static/css/style.css"
	// If your stylesheet is inside `static/css/` directory, just replace
	// `style.css` with your stylesheet's name. You don't need to change the path.
});
