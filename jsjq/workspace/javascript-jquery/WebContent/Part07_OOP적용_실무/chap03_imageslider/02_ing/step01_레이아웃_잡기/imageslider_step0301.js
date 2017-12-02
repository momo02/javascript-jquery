
//단계 03_인덱스 메뉴 처리
//단계 3-1 : 인덱스 메뉴 아이템 활성화 
//화면에서 보여지고 있는 이미지가 몇 번째 이미지인지 인덱스 메뉴 아이템에 표현

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
	this.currentIndex = index;
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