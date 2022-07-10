document.addEventListener('DOMContentLoaded',function(){

	//PARAM
	const params 		= new URLSearchParams(window.location.search);

	//COMPONENT
	const posterImg 	= $('.poster-img-js');
	const bigPosterImg 	= $('.big-poster-img-js');
	const backImg 		= $('.back-img-js');
	const title			= $('.movie-title-js');
	const length		= $('.movie-length-js');
	const genre			= $('.movie-genre-js');
	const rating		= $('.movie-rating-js');
	const starRating	= $('.stars-js');
	const description	= $('.movie-description-js');
	const movie			= $('.movie-js');
	const warning		= $('.warning-js');
	const errMsg		= $('.error-msg-js');
	const carousel		= $('.carousel-js');


	//INITAL MOVIE FIND CALL
	function findMovie(){

		if(params.has('movie')){

			let movieId=params.get('movie');
			
			if(movieId.length>0){
				apiRequest({
					url:movieDetails.replace(replaceKey,movieId),
					onSuccess:showMovie,
					onFail:onFail
				});
			}else{
				showWarning('Peticion de recurso incorrecta...');
			}

		}else{
			showWarning('No se ha solicitado ningun recurso...');
		}

	}
	
	//SHOW MOVIE DETAILS
	function showMovie(data){

		movie.toggleClass('hidden');
		posterImg.attr('src',imagePath.replace(replaceImageSizeKey,'w200').replace(replaceImagePathKey,data.poster_path));
		posterImg.attr('alt',data.original_title);
		bigPosterImg.attr('src',imagePath.replace(replaceImageSizeKey,'w500').replace(replaceImagePathKey,data.poster_path));
		backImg.attr('src',imagePath.replace(replaceImageSizeKey,'original').replace(replaceImagePathKey,data.backdrop_path));
		title.text(data.title);
		length.text(data.runtime);

		let genresTag ='';
		data.genres.forEach(function(genreItem){
			genresTag = genresTag.concat(genreItem.name).concat(',');
		});
		genresTag=genresTag.slice(0,-1);
		genre.text(genresTag);

		description.text(data.overview);
		rating.text(data.vote_average);

		data.production_companies.forEach(function(company){
		
			if(company.logo_path!=null){
				
				let image = $('<img/>',{
					src:imagePath.replace(replaceImageSizeKey,'w200').replace(replaceImagePathKey,company.logo_path),
					class:'w-[100px] h-[100px] m-3 object-center object-cover shadow-2xl'
				});

				let div = $('<div>',{
					class:'flex border-2 md:border-0 md:inline-block',
				});

				image.appendTo(div);
				div.append(`<div class='md:hidden'>
								<span class='font-bold'>Nombre: </span><span>${company.name}</span><br>
								<span class='font-bold'>Pais: </span><span>${company.origin_country}</span>
							</div>`);

				div.appendTo(carousel);

			}

		});

		const maxStars = 5;
		let voteStars = (Math.round(data.vote_average)/2);

		for (let i = 0; i<maxStars; i++) {

			let classTag='';
			
			if(voteStars>=1){
				classTag='fa fa-star';
			}else if((voteStars<1) && (voteStars>0)){
				classTag='fa fa-star-half-o';
			}else{
				classTag='fa fa-star-o';
			}

			voteStars--;

			$('<span>',{class:classTag}).appendTo(starRating);
		}

		creteEventeListeners();

	}


	function creteEventeListeners(){
		
		posterImg.hover(function(){
			$('.big-poster-js').toggleClass('hidden');
		});


		$('.play-btn-js').hover(function(){
			$('.background-box-js').toggleClass('md:blur-sm');
			backImg.toggleClass('scale-medium');
		});

		$('.play-btn-js').click(function(){
			$('.video-box-js').toggleClass('hidden');
			$(window).scrollTop($('.video-box-js').position().top);
		});

		$('.close-video-box-btn-js').click(function(){
			$('.video-box-js').toggleClass('hidden');
		});

	}


	//ON FAIL REQUEST
	function onFail(xhr,status,error){
	
		if(xhr.responseJSON!=undefined){
			showWarning('No se ha encontrado el recurso solicitado...')
		}else{
			showWarning('Error inesperado...')
		}

	}

	//SHOW WARNING
	function showWarning(msg){
		warning.toggleClass('hidden');
		errMsg.text(msg);
	}

	findMovie();

});