
//단계 04_이미지 변경 이벤트 발생 
//이미지가 변경되는 경우, 
//변경 전 이미지 인덱스와 신규 이미지 인덱스를 change라는 사용자 정의 이벤트에 담아 발생하는 기능을 구현 

function ImageSlider(selector){ //이미지 슬라이더 기능을 담을 클래스 
	this.$imageSlider = null;
	this.$images = null;
	
	//step #02-02
	this.currentIndex = -1; //현재 선택한 이미지 인덱스 정보를 담을 프로퍼티 
	
	//이미지의 너비는 이미지 활성화/비활성화에 사용됨
	this.imageWidth = 0;
	
	// step #03-01
	this.$indexItems = null; //인덱스 메뉴 아이템을 담을 프로퍼티
	
	this.init(selector);
	this.initImages();
	
	//step #02-02
	this.initEvent();
	
	//0번째 이미지 활성화
	this.showImageAt(0);
	
}

/*
 * step #02-01
 * 요소 초기화
 */
ImageSlider.prototype.init = function(selector){
	this.$imageSlider = $(selector);
	this.$images = this.$imageSlider.find(".slider-body img");
	
	//이미지 슬라이더의 너비 찾기
	//이미지의 너비는 이미지 활성화/비활성화에 사용됨
	this.imageWidth = this.$imageSlider.find(".slider-body").width();
	
	this.$indexItems = this.$imageSlider.find(".index-nav li a");
	
	
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


/*
 * step #02-02
 * 이벤트 처리
 */
ImageSlider.prototype.initEvent = function(){
	
	var objThis = this;
	this.$imageSlider.find(".slider-btn-prev").on("click",function(){
		objThis.prevImage();
	})
	
	this.$imageSlider.find(".slider-btn-next").on("click",function(){
		objThis.nextImage();
	})
	
	// step #03-02
	this.$indexItems.on("mouseenter",function(){
		var index = objThis.$indexItems.index(this); //★현재 마우스가 들어온 인덱스 메뉴 아이템 객체의 인덱스
		
		//기존 선택과 현재 선택의 비교 방향 알아내기
		if(objThis.currentIndex > index) //현재인덱스보다 작은 인덱스를 선택 -> 이전 이미지 선택 효과 
			objThis.showImageAt(index,"prev")
		else
			objThis.showImageAt(index,"next")
			
			
	})

}

/*
 * step #02-02
 * index번째 이미지 보이기 
 */
ImageSlider.prototype.showImageAt = function(index,direction){
	//인덱스 값 구하기
	if(index < 0){ // 0번째보다 작아지면 
		index = this.$images.length - 1; //제일마지막 이미지의 인덱스 (제일 마지막 이미지로) 
	}
	
	if(index >= this.$images.length){ //마지막 인덱스보다 커지면 
		index = 0; //다시 처음 이미지 로 
	}
	
	//테스트용 
	console.log("currentIndex="+this.currentIndex +", newIndex=" + index );
	
	//인덱스 값에 해당하는 이미지 요소 구하기
	var $currentImage = this.$images.eq(this.currentIndex);
	var $newImage = this.$images.eq(index);

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
		var currentEndLeft = this.imageWidth; //현재이미지가 변할(종료될) left값 
		var nextStartLeft = -this.imageWidth; //신규 이미지의 시작 left값 
		
		//next는 현재 이미지가 왼쪽으로 사라지고 새 이미지가 오른쪽에서 나타나야함
		if(direction == "next"){
			currentEndLeft = -this.imageWidth;
			nextStartLeft = this.imageWidth;
		}
		
		
		//현재 이미지 비활성화 애니메이션
		$currentImage.stop().animate({
			left : currentEndLeft,
			opacity : 0
		},500,"easeOutQuint")
		
		
		//신규 이지미 활성화 전에 애니메이션 시작 위치 설정하기
		$newImage.css({
			left:nextStartLeft,
			opacity : 0
		})
		
		
		//신규 이미지 활성화 애니메니션 
		$newImage.stop().animate({
			left : 0, // 현재 이미지로 보여지도록  
			opacity : 1
		},500,"easeOutQuint")
	
	
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
	this.selectIndexAt(index)
	
	//현재 이미지 인덱스 값 업데이트
	var oldIndex = this.currentIndex;
	this.currentIndex = index;
	
	this.dispatchChangeEvent(oldIndex,this.currentIndex);
}



ImageSlider.prototype.prevImage = function(){
	
	this.showImageAt(this.currentIndex-1,"prev");
}



ImageSlider.prototype.nextImage = function(){
	
	this.showImageAt(this.currentIndex+1,"next");
}

/*
 * step #03-01
 * n번째 인덱스 아이템 선택
 */
ImageSlider.prototype.selectIndexAt = function(index){
	
	//현재 이미지 의  인덱스 메뉴 아이템에 select 효과 제거  
	if(this.currentIndex != -1)
		this.$indexItems.eq(this.currentIndex).removeClass("select")	
	
		//현재 인덱스 의 메뉴 아이템에 select 효과 주기
	this.$indexItems.eq(index).addClass("select")
		
}

/*
 * step #04
 * change 이벤트 발생
 */
ImageSlider.prototype.dispatchChangeEvent = function(oldIndex, newIndex){
	
	var event = jQuery.Event("change"); //"change"라는 이벤트를 만든다.파라미터는 이벤트 name
	event.oldIndex = oldIndex;
	event.newIndex = newIndex; //기존 선택 이미지 인덱스와  신규 선택 이미지 인덱스를 담아 
	this.$imageSlider.trigger(event); //이벤트를 발생시킨다.  
	
}