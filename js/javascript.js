
let draggedObject;
let hoveredObject;
let draggedCarouselItem;
let hoveredCarouselItem;
let gallery;
let carousel;
let toLeft = 0;
let order = [0,1,2,3,4,5,6,7,8,9,10,11,12];
let filteredOrder = [0,1,2,3,4,5,6,7,8,9,10,11,12];

document.addEventListener("DOMContentLoaded", ()=>{
    gallery = document.getElementById("gallery");

    const searchInput = document.getElementById("search-text");
    const cookieValue = getCookie("search");
    const cookieOrder = getCookie("order");

    if(cookieOrder){
        order = cookieOrder.split(',').map(Number);
    }

    if(!cookieOrder && !cookieValue) {
        $('#cookieModal').modal('show');
    }

    if(cookieValue){
        searchInput.value = cookieValue;
    }


    searchInput.addEventListener("input", (evt) => {
        setCookie("search", evt.target.value , 2);

    });

    searchInput.addEventListener("input", () => {
        filter();
    });

    carousel = document.getElementById("carouselContent");

    fetch('resources/photos.json')
        .then(response => response.json())
        .then(json => {
            order.forEach((item) => {
                let galleryItem = document.createElement("img");
                let galleryItem2 = document.createElement("img");

                galleryItem.setAttribute("src", "resources/images/" + json.photos[item].src);
                galleryItem.setAttribute("alt", json.photos[item].title);
                galleryItem.setAttribute("description", json.photos[item].description);
                galleryItem2.setAttribute("src", "resources/images/" + json.photos[item].src);
                galleryItem2.setAttribute("alt", json.photos[item].title);
                galleryItem2.setAttribute("description", json.photos[item].description);

                galleryItem.classList = "thumbnail";
                galleryItem2.classList = "d-block sliderImg";
                galleryItem.id = item;
                galleryItem2.id = item;


                let carouselItem = document.createElement("div");
                carouselItem.classList = "carousel-item";
                carouselItem.setAttribute("data-interval", "2000");
                carouselItem.appendChild(galleryItem2);


                let caption = document.createElement("div");
                caption.classList = "container text-center mt-2";
                let title = document.createElement("h5");
                let describtion = document.createElement("p");
                title.innerHTML = json.photos[item].title;
                describtion.innerHTML = json.photos[item].description;
                caption.appendChild(title);
                caption.appendChild(describtion);
                carouselItem.appendChild(caption);
                carousel.appendChild(carouselItem);


                galleryItem.addEventListener("click", ()=>{
                    $('#carouselContent .carousel-item').each(function (){
                        if (parseInt($(this).find('img').attr('id')) === parseInt(galleryItem.id)){
                            $(this).addClass( "active" );
                        }
                    });
                    $('#presentationModal').modal('show');
                })
                gallery.appendChild(galleryItem);
                galleryItem.ondragstart = dragStart;
                galleryItem.ondragover = dragOver;
                filter();
            });

        });
});


$('#presentationModal').on('hide.bs.modal', function (e) {
    console.log("hide modal launched");
    $('#carouselContent .carousel-item').each(function (){
        $(this).removeClass( "active" );
    });
});


function dragStart(evt){
    draggedObject = evt.target; //img
    $('#carouselContent .carousel-item').each(function (){
        if(parseInt($(this).find('img').attr('id')) === parseInt(draggedObject.id))
            draggedCarouselItem = this;
    });
}


function dragOver(evt){
    hoveredObject = evt.target;  //img
    $('#carouselContent .carousel-item').each(function (){
        if(parseInt($(this).find('img').attr('id')) === parseInt(hoveredObject.id))
            hoveredCarouselItem = this;
    });
    carousel.insertBefore(draggedCarouselItem, hoveredCarouselItem.nextSibling);
    gallery.insertBefore(draggedObject, hoveredObject.nextSibling);
    updateOrder(order);
    setCookie("order", order , 2);
}

function updateOrder(array) {
    array.splice(0, array.length)
    $('#gallery img').each(function() {
        array.push(parseInt($(this).attr('id')));
    });

}


function filter(){
    let searchText = document.getElementById("search-text").value;
    filteredOrder.splice(0, filteredOrder.length);

    $('#gallery img').each(function() {

        if ($(this).attr('alt').includes(searchText) || $(this).attr('description').includes(searchText)){
            filteredOrder.push(parseInt($(this).attr('id')));
            addBlockClass(this.id);
            $(this).css("display", "inline");

        }else {
            addNoneClass(this.id);
            $(this).css("display", "none");

        }
    });
    }

function addNoneClass(id){
    $('#carouselContent .carousel-item').each(function (){
        if(parseInt($(this).find('img').attr('id')) === parseInt(id)) {
            $(this).find('img').removeClass("d-block").addClass("d-none");
        }
    });
}

function addBlockClass(id){
    $('#carouselContent .carousel-item').each(function (){
        if(parseInt($(this).find('img').attr('id')) === parseInt(id))
            $(this).find('img').removeClass("d-none").addClass("d-block");
    });
}


$("#carouselSlider").on("slid.bs.carousel", function(event){
    if($(event.relatedTarget).find('img').hasClass("d-none")){
        $('.carousel').carousel({
            interval: 0
        });
        if (toLeft){
            $('.carousel').carousel('prev');
        }else {
            $('.carousel').carousel('next');
        }

    }else{
        toLeft=0;
    }
});

function play(){
    $('.carousel').carousel('cycle');
}

function pause(){
    $('.carousel').carousel('pause');
}

function previousSlide(){
    toLeft=1;
    $('.carousel').carousel('prev');
}

function nextSlide(){
    $('.carousel').carousel('next');
}

function setCookie(cname, cvalue, exdays) {
    var date = new Date();
    date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+date.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}