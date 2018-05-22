# SkySvgBlur
Background SVG blur on mouse move

DEMO - https://codepen.io/skyangel/pen/OZGVxL

Blur is work on vanilla Javascript without jQuery.
Browser support - IE 10+ (work in all browser).
Be careful to use blur for mobile device, because it can make low performans for mobile (you can turn off in script)

#SETTINGS
(change this params as you wish)

    imageOptions = {    
        width: 1920, //Image width        
        height: 1080, //Image height        
        imagePath: 'images/bg.jpg' //image url        
    }
    
    svgOptions = {        
        blurEffect : 7, //Blur effect for cursor        
        parent: 'body', // container for background        
        blurOnMobile: true // show blur effect on mobile        
    };
    pointOptions = {    
        radius : 80, //cursor radius        
        fadeTime : 5000, // time for fade out unblured circle        
        fadeTimeout : 500, // delay for blur effect on cursor        
    }
