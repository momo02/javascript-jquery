
// step #02-01
function ImageSlider(selector){

    this.$imageSlider = null;
    this.$images = null;
    
    // step #02-02
    this.currentIndex =-1;
    
    // step #02-03
    // 이미지의 너비는 이미지를 활성화/비활성화에 사용됨
    this.imageWidth = 0;
    
    this.init(selector);
    this.initImages();
    
    // step #02-02
    this.initEvent();
    // 0번째 이미지 활성화
    this.showImageAt(0);
}


/* step #02-01
* 요소 초기화
*/
ImageSlider.prototype.init=function(selector){
    this.$imageSlider = $(selector);
    this.$images = this.$imageSlider.find(".slider-body img");

    // step #02-03
    // 이미지 슬라이더의 너비 찾기
    // 이미지의 너비는 이미지를 활성화/비활성화에 사용됨
    this.imageWidth=this.$imageSlider.find(".slider-body").width();
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

/* step #02-02
* 이벤트 처리 
*/
ImageSlider.prototype.initEvent=function(){
    var objThis = this;
    this.$imageSlider.find(".slider-btn-prev").on("click", function(){
     objThis.prevImage();
    })
    
    this.$imageSlider.find(".slider-btn-next").on("click", function(){
        objThis.nextImage();
    })
}

/* step #02-02
* 이전 이미지 보이기
*/
ImageSlider.prototype.prevImage=function(){
    //this.showImageAt(this.currentIndex-1);
    
    // step #02-03
    this.showImageAt(this.currentIndex-1, "prev");
}

/* step #02-02
* 다음 이미지 보이기
*/
ImageSlider.prototype.nextImage=function(){
   //this.showImageAt(this.currentIndex+1);
    
    // step #02-03
    this.showImageAt(this.currentIndex+1, "next");
}


/* 
 * step #02-03
 *      direction 파라메터 추가 
 * 
 * step #02-02
 *      index 번째 이미지 보이기
 */
ImageSlider.prototype.showImageAt=function(index, direction){

    // 인덱스 값 구하기
    if(index<0)
        index = this.$images.length-1;
    
    if(index>=this.$images.length)
        index = 0;
    
    // 테스트 용
    console.log("currentIndex="+this.currentIndex +", newIndex="+index);    

    
    // 인덱스 값에 해당하는 이미지 요소 구하기
    var $currentImage = this.$images.eq(this.currentIndex);
    var $newImage = this.$images.eq(index);
    
    /*
    // 현재 이미지는 비활성화, 신규 이미지는 활성화
    $currentImage.css({
        opacity:0
    });
    
    $newImage.css({
        left:0,
        opacity:1
    })
    */
   
    // step #02-03
    // direction 값이 prev, next 인 경우만 애니메이션 적용해 이미지 활성화/비활성화
    if(direction=="prev" || direction=="next"){
        
        // prev, next에 따른 이동 위치 값 설정하기
        // prev가 기본 
        var currentEndLeft=this.imageWidth;
        var nextStartLeft =-this.imageWidth;
    
        if(direction=="next"){
            currentEndLeft= -this.imageWidth;
            nextStartLeft=this.imageWidth;  
        }
        
        // 현재 이미지 비활성화 애니메이션
        $currentImage.stop().animate({
            left:currentEndLeft,
            opacity:0
        },5300, "easeOutQuint");
        
        
        // 신규 이미지 활성화 전에 애니메이션 시작 위치 설정하기
        $newImage.css({
            left:nextStartLeft,
            opacity:0
        });
        
        // 신규 이미지 활성화 애니메이션
        $newImage.stop().animate({
        left:0,
        opacity:1
        },5300, "easeOutQuint");
    }else {
       // direction 값이 없거나 prev, next가 아닌 경우는 애니메이션 없이 이미지 활성화/비활성화
        $currentImage.css({
        opacity:0
        });
        
        $newImage.css({
            left:0,
            opacity:1
        })
    }
    // 현재 이미지 인덱스값 업데이트
    this.currentIndex = index;
}







