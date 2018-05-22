;(function() {
    'use strict';
    document.addEventListener('DOMContentLoaded', function() { 
        var svgNS = "http://www.w3.org/2000/svg";
        var svgXlink = 'http://www.w3.org/1999/xlink';
        var imageOptions = {
            width: 1920,
            height: 1080,
            imagePath: 'images/bg.jpg'
        }
        var svgOptions = {            
            blurEffect : 7,
            viewBox: '0 0 '+imageOptions.width+' '+imageOptions.height+'',
            preserveAspectRatio: 'xMinYMin slice',  
            parent: 'body',
            blurOnMobile: true
        };
        var pointOptions = {
            radius : 80,
            fadeTime : 5000,
            fadeTimeout : 500,
        }
        /* check on mobile device */
        var isMobile = function(){
            var userAgent = window.navigator.userAgent.toLowerCase(),
            checkMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|x11/i.test(userAgent);       
            return checkMobile;
        }
        /* create elements */
        var createElem = function(elem,attrs){
            var element = document.createElementNS(svgNS, elem);            
            for(var i in attrs) { 
                if(i == 'xlink:href') {               
                    element.setAttributeNS(svgXlink, i, attrs[i]);   
                }                     
                else{
                    element.setAttribute(i, attrs[i]);
                }    
            }
            return element;
        }

        /* CREATE SVG elements*/
        var svgContainer = createElem('svg',{
            'xmlns': 'http://www.w3.org/2000/svg',
            'xmlns:xlink': 'http://www.w3.org/1999/xlink',
            'preserveAspectRatio': svgOptions.preserveAspectRatio,
            'viewBox': svgOptions.viewBox,
            'id': 'svg-blur-container'
        });
        /* set default params */        
        svgContainer.style.position = 'fixed';
        svgContainer.style.top = 0;
        svgContainer.style.left = 0;
        svgContainer.style.width = '100%';
        svgContainer.style.height = '100%';
        svgContainer.style.zIndex = '-1';
        var parentContainer = document.querySelector(svgOptions.parent);
        parentContainer.appendChild(svgContainer);

        var svgDefs = createElem('defs','');
        svgContainer.appendChild(svgDefs); 

        var svgImage = createElem('image', {
            'id': 'svg-blur-source',
            'xlink:href': imageOptions.imagePath,
            'x': 0,
            'y': 0,
            'width': '100%',
            'height': '100%'
        });
        svgDefs.appendChild(svgImage);

        /*create mask*/
        var svgMask = createElem('mask',{
            'id': 'mask-container'
        });
        svgDefs.appendChild(svgMask);

        /*create blur filter*/   
        var svgFilter = createElem('filter',{
            'id': 'svg-blur-filter'
        });
        svgDefs.appendChild(svgFilter);
        var SVGfeGaussianBlur = createElem('feGaussianBlur',{
            'stdDeviation': svgOptions.blurEffect,
            'color-interpolation-filters': 'sRGB'
        });
        svgFilter.appendChild(SVGfeGaussianBlur);   
        
        /*create use*/
        var svgUse1 = createElem('use', {
            'xlink:href': '#svg-blur-source'
        });
        svgContainer.appendChild(svgUse1);
        var svgUse2 = createElem('use', {
            'xlink:href': '#svg-blur-source',
            'class': 'svg-bg-blured',
            'filter': 'url(#svg-blur-filter)'
        });
        svgContainer.appendChild(svgUse2);
        var svgUse3 = createElem('use', {
            'xlink:href': '#svg-blur-source',
            'class': 'svg-bg-original',
            'mask': 'url(#mask-container)'
        });
        svgContainer.appendChild(svgUse3);
        /* END CREATE SVG elements*/

        /*create mask filter*/
        var createMaskPoint = function(event) {
            if(isMobile() && !svgOptions.blurOnMobile){
                return false;   
            }
            var multiplierWidth = imageOptions.width / window.innerWidth;
            var multiplierHeight = imageOptions.height / window.innerHeight;
            var multiplier = (multiplierWidth > multiplierHeight) ? multiplierHeight : multiplierWidth;

            var point = {};
            point.x = parseInt(event.clientX) * multiplier;
            point.y = parseInt(event.clientY) * multiplier;

            var maskPoint = createElem('circle',{
                "cx": point.x,
                "cy": point.y,
                "r": pointOptions.radius,
                'transform-origin': point.x+' '+point.y,
                "fill": '#fff'
            });            
            svgMask.appendChild(maskPoint);
            if (!isMaskInterval){
                reduceMaskPoints();
            }
        };        

        /*reduse points*/
        var isMaskInterval = false;
        var reduceMaskPoints = function(){
            isMaskInterval = true;
            var reduceRadiusTime = parseInt(pointOptions.fadeTime / pointOptions.radius);
            var removeMask = setInterval(function(){
                var points = svgMask.childNodes;                  
                for (var i=0; i<points.length; ++i){ 
                    var item = points[i]
                    // console.log(item);      
                    var pointRadius = item.getAttribute('r');
                    if (pointRadius > 1){
                        pointRadius--;
                        item.setAttribute('r',pointRadius);
                    }else{
                        svgMask.removeChild(item);
                    }
                }
                if (points.length == 0) {
                    isMaskInterval = false;
                    clearInterval(removeMask);
                }        
            },reduceRadiusTime);
        }         
        
        /*Events*/
        document.addEventListener('mousemove', createMaskPoint); 
    });
}());