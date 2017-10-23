
// step #02-01
function ImageSlider(selector){

    this.$imageSlider = null;
    this.$images = null;
    
    this.init(selector);
    this.initImages();
}


/* step #02-01
* 요소 초기화
*/
ImageSlider.prototype.init=function(selector){
    this.$imageSlider = $(selector);
    this.$images = this.$imageSlider.find(".slider-list img");
}

/* step #02-01
* 이미지 요소 초기화
*/
ImageSlider.prototype.initImages=function(selector){
    this.$images.each(function(){
        $(this).css({
            opacity:0.0
        })
    }) 
}


