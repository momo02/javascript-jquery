
//단계 02_이전/다음 이미지 출력 
//단계 2-1 : 이미지 요소 상태 초기화

function ImageSlider(selector){ //이미지 슬라이더 기능을 담을 클래스 
	this.$imageSlider = null;
	this.$images = null;
	
	this.init(selector);
	this.initImages();
	
}

/*
 * step #02-01
 * 요소 초기화
 */
ImageSlider.prototype.init = function(selector){
	this.$imageSlider = $(selector);
	this.$images = this.$imageSlider.find(".slider-body img");
}

/*
 * step #02-01
 * 이미지 요소 초기화
 */
ImageSlider.prototype.initImages = function(selector){
	this.$images.each(function(){
		$(this).css({
			opacity : 0.0 //초기 시작 시 모든 이미지를 화면에서 보이지 않게 초기화 
		})
		
	})
}