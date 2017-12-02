
//단계 07_캡슐화 적용 
//캡슐화를 적용해 외부에서 사용할 요소와 내부에서 사용할 요소를 나누는작업. 


function ImageSlider(selector,options){ //이미지 슬라이더 기능을 담을 클래스 
	this.$imageSlider = null;
	this._$images = null;
	
	//step #02-02
	this._currentIndex = -1; //현재 선택한 이미지 인덱스 정보를 담을 프로퍼티 
	
	//이미지의 너비는 이미지 활성화/비활성화에 사용됨
	this._imageWidth = 0;
	
	// step #03-01
	this._$indexItems = null; //인덱스 메뉴 아이템을 담을 프로퍼티
	
	// step #05
	this._timerID = 0; //타이머 아이디
	//this.autoPlayDelayTime = 1000; //이미지 전환 지연 시간
	
	// step #06
	this._options = null;
	
	this._init(selector);
	this._initImages();
	
	// step #06
	this._initOptions(options);
	
	//step #02-02
	this._initEvent();
	
	//0번째 이미지 활성화
	this.showImageAt(0);
	
	// step #05 
	this.startAutoPlay();
	
}


//step #06
// 기본 옵션값 
ImageSlider.defaultOptions = {
		startIndex : 0,//시작 시 보여줄 인덱스값
		autoPlay : true, //자동 전환 기능 사용 유무
		autoPlayDelayTime : 2000, //자동 전환 지연 시간
		animationDuration : 500, //이미지 전환시간 
		animationEasing : "easeOutQuint" //이미지 전환 시 사용할 이징 함수
}


//step #06
//기본 옵션값과 사용자 옵션값을 합치기 
ImageSlider.prototype._initOptions = function(options){
	this._options = $.extend({},ImageSlider.defaultOptions,options )
	// 최종 옵션값은 기본 옵션값과 사용자 옵션값이 합해져 만들어짐.
	// 기본 옵션 속성 중 사용자 옵션에 있는것은 사용자 옵션의 속성값으로 덮어쓰게되며 사용자 옵션에 없는 속성은 기본 옵션값을 그대로 사용. 

}

/*
 * step #02-01
 * 요소 초기화
 */
ImageSlider.prototype._init = function(selector){
	this.$imageSlider = $(selector);
	this._$images = this.$imageSlider.find(".slider-body img");
	
	//이미지 슬라이더의 너비 찾기
	//이미지의 너비는 이미지 활성화/비활성화에 사용됨
	this._imageWidth = this.$imageSlider.find(".slider-body").width();
	
	this._$indexItems = this.$imageSlider.find(".index-nav li a");
	
	
}

/*
 * step #02-01
 * 이미지 요소 초기화
 */
ImageSlider.prototype._initImages = function(selector){
	this._$images.each(function(){
		$(this).css({
			opacity : 0.0 //초기 시작 시 모든 이미지를 화면에서 보이지 않게 초기화 
		})
		
	})
}


/*
 * step #02-02
 * 이벤트 처리
 */
ImageSlider.prototype._initEvent = function(){
	
	var objThis = this;
	this.$imageSlider.find(".slider-btn-prev").on("click",function(){
		objThis.prevImage();
	})
	
	this.$imageSlider.find(".slider-btn-next").on("click",function(){
		objThis.nextImage();
	})
	
	// step #03-02
	this._$indexItems.on("mouseenter",function(){
		var index = objThis._$indexItems.index(this); //★현재 마우스가 들어온 인덱스 메뉴 아이템 객체의 인덱스
		
		//기존 선택과 현재 선택의 비교 방향 알아내기
		if(objThis._currentIndex > index) //현재인덱스보다 작은 인덱스를 선택 -> 이전 이미지 선택 효과 
			objThis.showImageAt(index,"prev")
		else
			objThis.showImageAt(index,"next")
			
	})

	// step #05
	this.$imageSlider.on("mouseenter",function(){
		objThis.stopAutoPlay();
	});
	
	
	this.$imageSlider.on("mouseleave",function(){
		objThis.startAutoPlay();
	});
	
}

/*
 * step #02-02
 * index번째 이미지 보이기 
 */
ImageSlider.prototype.showImageAt = function(index,direction){
	//인덱스 값 구하기
	if(index < 0){ // 0번째보다 작아지면 
		index = this._$images.length - 1; //제일마지막 이미지의 인덱스 (제일 마지막 이미지로) 
	}
	
	if(index >= this._$images.length){ //마지막 인덱스보다 커지면 
		index = 0; //다시 처음 이미지 로 
	}
	
	//테스트용 
	console.log("_currentIndex="+this._currentIndex +", newIndex=" + index );
	
	//인덱스 값에 해당하는 이미지 요소 구하기
	var $currentImage = this._$images.eq(this._currentIndex);
	var $newImage = this._$images.eq(index);

	//현재 이미지는 비활성화, 신규 이미지는 활성화
	/*$currentImage.css({
		opacity : 0
	})
	
	
	$newImage.css({
		left :0,
		opacity : 1
	})*/
	
	// direction 값이 prev, next인 경우만 에니메이션을 적용해 이미지를 활성화/비활성화
	if(direction == "prev" || direction == "next"){
		
		//prev,next에 따른 이동 위치 값 설정하기
		//prev가 기본
		//prev는 현재 이미지가 오른쪽으로 사라지고 새 이미지가 왼쪽에서 나타나야함 
		var currentEndLeft = this._imageWidth; //현재이미지가 변할(종료될) left값 
		var nextStartLeft = -this._imageWidth; //신규 이미지의 시작 left값 
		
		//next는 현재 이미지가 왼쪽으로 사라지고 새 이미지가 오른쪽에서 나타나야함
		if(direction == "next"){
			currentEndLeft = -this._imageWidth;
			nextStartLeft = this._imageWidth;
		}
		
		
		//현재 이미지 비활성화 애니메이션
		// step #06
		$currentImage.stop().animate({
			left : currentEndLeft,
			opacity : 0
		},this._options.animationDuration,this._options.animationEasing)
		
		
		//신규 이지미 활성화 전에 애니메이션 시작 위치 설정하기
		$newImage.css({
			left:nextStartLeft,
			opacity : 0
		})
		
		
		//신규 이미지 활성화 애니메니션 
		$newImage.stop().animate({
			left : 0, // 현재 이미지로 보여지도록  
			opacity : 1
		},this._options.animationDuration,this._options.animationEasing)
	
	
	}else{
		//direction 값이 없거나 prev,next가 아닌 경우에는 에니메이션 없이 이미지를 환성화/비활성화

		$currentImage.css({
			opacity : 0
		})
		
		
		$newImage.css({
			left:0,
			opacity : 1
		})
		
		
	}
	
	// step #03-01
	// n번째 인덱스 아이템 처리
	this._selectIndexAt(index)
	
	//현재 이미지 인덱스 값 업데이트
	var oldIndex = this._currentIndex;
	this._currentIndex = index;
	
	this._dispatchChangeEvent(oldIndex,this._currentIndex);
}



ImageSlider.prototype.prevImage = function(){
	
	this.showImageAt(this._currentIndex-1,"prev");
}



ImageSlider.prototype.nextImage = function(){
	
	this.showImageAt(this._currentIndex+1,"next");
}

/*
 * step #03-01
 * n번째 인덱스 아이템 선택
 */
ImageSlider.prototype._selectIndexAt = function(index){
	
	//현재 이미지 의  인덱스 메뉴 아이템에 select 효과 제거  
	if(this._currentIndex != -1)
		this._$indexItems.eq(this._currentIndex).removeClass("select")	
	
		//현재 인덱스 의 메뉴 아이템에 select 효과 주기
	this._$indexItems.eq(index).addClass("select")
		
}

/*
 * step #04
 * change 이벤트 발생
 */
ImageSlider.prototype._dispatchChangeEvent = function(oldIndex, newIndex){
	
	var event = jQuery.Event("change"); //"change"라는 이벤트를 만든다.파라미터는 이벤트 name
	event.oldIndex = oldIndex;
	event.newIndex = newIndex; //기존 선택 이미지 인덱스와  신규 선택 이미지 인덱스를 담아 
	this.$imageSlider.trigger(event); //이벤트를 발생시킨다.  
	
}

// step #05
// 자동 전환 기능 시작 
ImageSlider.prototype.startAutoPlay = function(){
	
	var objThis = this;
	
	//step #06
	if(this._options.autoPlay == true){
		if(this._timerID == 0){
			
			/* cf.setInterval은 window객체의 함수여서, 파라미터 function내에서 this는 window객체가 된다.
			function 내에서 this를 ImageSlider객체로 유지할수 있게 하기위해서
			$.proxy() 를 사용한다. ==> $.proxy( context, name ) 또는 $.proxy( function, context ) 이렇게 사용.
			[proxy의미 . 대리인. 대리권. 데이터를 가져올 때 해당 사이트에서 바로 자신의 PC로 가져오는 것이 아니라 임시 저장소를 거쳐서 가져오는 것] */
	
			//이미지 전환 지연 시간(this.autoPlayDelayTime)마다  nextImage()메서드를 호출
			this._timerID = setInterval($.proxy(function(){
				this.nextImage(); //여기서 this는 ImageSlider객체가됨. 
			
				//objThis.nextImage(); //$.proxy함수 안쓰고 이렇게해도 동일함!
			},this), this._options.autoPlayDelayTime)
		}
	}
}


//step #06 
//자동 전환 기능 멈춤 
ImageSlider.prototype.stopAutoPlay = function(){
	//step #06
	if(this._options.autoPlay == true){
		if(this._timerID!=0){
			clearInterval(this._timerID);
			this._timerID = 0;
		}
	}
}
