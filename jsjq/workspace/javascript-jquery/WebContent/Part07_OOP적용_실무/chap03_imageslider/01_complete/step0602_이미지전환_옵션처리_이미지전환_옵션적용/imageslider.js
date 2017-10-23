/* step #06-01
 * options 매개변수 추가 
 * 
 */

// step #02-01
function ImageSlider(selector, options){

    this.$imageSlider = null;
    this.$images = null;
    
    // step #02-02
    this.currentIndex =-1;
    
    // step #02-03
    // 이미지의 너비는 이미지를 활성화/비활성화에 사용됨
    this.imageWidth = 0;
    
    // step #03-01
    this.$indexItems = null;
    
    // step #05
    this.timerID = 0;
    // step #06-01
    //this.autoPlayDelayTime = 1000;
    
    // step #06-01
    this.options = null;
    
    this.init(selector);
    this.initImages();
    
    // step #06-01
    this.initOptions(options);
    
    // step #02-02
    this.initEvent();
    
    // step #06-01
    // 0번째 이미지 활성화
    //this.showImageAt(0);
    this.showImageAt(this.options.startIndex);
    
    // step #05
    this.startAutoPlay();
}


// step #06-01
// 기본 옵션 값
ImageSlider.defaultOptions = {
    startIndex:0,
    autoPlay:true,
    autoPlayDelayTime:2000,
    animationDuration:500,
    animationEasing:"easeOutQuint"
}

// step #06-01
// 기본 옵션 값과 사용자 옵션 값을 합치기
ImageSlider.prototype.initOptions=function(options){
    this.options = $.extend({}, ImageSlider.defaultOptions, options);
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
    
    // step #03-01
    this.$indexItems = this.$imageSlider.find(".index-nav li a");
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
    
    // step #03-02
    this.$indexItems.on("mouseenter", function(){
        var index = objThis.$indexItems.index(this);
        // 기존 선택과 현재 선택을 비교 방향 알아내기     
        if(objThis.currentIndex>index)
            objThis.showImageAt(index,"prev");
        else 
            objThis.showImageAt(index,"next");
    })
    
    //step #05
    this.$imageSlider.on("mouseenter",function(){
        objThis.stopAutoPlay();
    });
    
    this.$imageSlider.on("mouseleave",function(){
        objThis.startAutoPlay();
    });
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
    //console.log("currentIndex="+this.currentIndex +", newIndex="+index);    
    
    // 인덱스 값에 해당하는 이미지 요소 구하기
    var $currentImage = this.$images.eq(this.currentIndex);
    var $newImage = this.$images.eq(index);

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
        /*
        // 현재 이미지 비활성화 애니메이션
        $currentImage.stop().animate({
            left:currentEndLeft,
            opacity:0
        },300, "easeOutQuint");


        // 신규 이미지 활성화 전에 애니메이션 시작 위치 설정하기
        $newImage.css({
            left:nextStartLeft,
            opacity:0
        });

        // 신규 이미지 활성화 애니메이션
        $newImage.stop().animate({
            left:0,
            opacity:1
        },300, "easeOutQuint");
        */

        // 현재 이미지 비활성화 애니메이션
        $currentImage.stop().animate({
            left:currentEndLeft,
            opacity:0
        },this.options.animationDuration, this.options.animationEasing);

        // 신규 이미지 활성화 전에 애니메이션 시작 위치 설정하기
        $newImage.css({
            left:nextStartLeft,
            opacity:0
        });

        // 신규 이미지 활성화 애니메이션
        $newImage.stop().animate({
            left:0,
            opacity:1
        },this.options.animationDuration, this.options.animationEasing);

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

    // step #03-01
    // n번째 인덱스 아이템 선택
    this.selectIndexAt(index);

    // 현재 이미지 인덱스값 업데이트    
    // step #04
    //this.currentIndex = index;
    var oldIndex = this.currentIndex;
    this.currentIndex = index;
    this.dispatchChangeEvent(oldIndex, this.currentIndex);
}

/*
 * step #03-01
 *  n번째 인덱스 아이템 선택
 */ 
ImageSlider.prototype.selectIndexAt=function(index){
    
    if(this.currentIndex!=-1)       
        this.$indexItems.eq(this.currentIndex).removeClass("select"); 
            
    this.$indexItems.eq(index).addClass("select");
}

/*
 * step #04
 * change 이벤트 발생 
 * 
 */
ImageSlider.prototype.dispatchChangeEvent=function(oldIndex, newIndex){
    var event = jQuery.Event("change");
    event.oldIndex = oldIndex;
    event.newIndex = newIndex;
    this.$imageSlider.trigger(event);
}

// step #05
// 오토 플레이 시작
ImageSlider.prototype.startAutoPlay=function(){
    /*
    if(this.timerID==0){
        this.timerID= setInterval($.proxy(function(){
            this.nextImage();
        }, this), this.autoPlayDelayTime);              
    }
    */
    //step #06
    if(this.options.autoPlay==true){
        if(this.timerID==0){
            this.timerID= setInterval($.proxy(function(){
                this.nextImage();
            }, this), this.options.autoPlayDelayTime);              
        }
    }
}

// step #05
// 오토 플레이 멈춤
ImageSlider.prototype.stopAutoPlay=function(){
    /*
    if(this.timerID!=0){
        clearInterval(this.timerID);
        this.timerID=0;
    }
    */
    //step #06
    if(this.options.autoPlay==true){
        if(this.timerID!=0){
            clearInterval(this.timerID);
            this.timerID=0;
        }
    }
}






