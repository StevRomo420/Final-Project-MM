/**
 * @author Esteban Taisigue B97785
 * @author Erick Vasquez 	B98334
 * @author Esteban Rosales 	B96967
 * 
 */

document.addEventListener('DOMContentLoaded',function(){

	//PARAM
	const params 			= new URLSearchParams(window.location.search);

	//COMPONENT
	const posterImg 		= $('.poster-img-js');
	const bigPosterImg 		= $('.big-poster-img-js');
	const backImg 			= $('.back-img-js');
	const title				= $('.movie-title-js');
	const length			= $('.movie-length-js');
	const genre				= $('.movie-genre-js');
	const rating			= $('.movie-rating-js');
	const starRating		= $('.stars-js');
	const description		= $('.movie-description-js');
	const premiereDate		= $('.premiere-date-js')
	const movie				= $('.movie-js');
	const warning			= $('.warning-js');
	const errMsg			= $('.error-msg-js');
	const carousel			= $('.carousel-js');
	const videoIframe		= $('.video-iframe-js');

	const youtubeReplaceKey = 'YT_KEY';
	let youtubeEmbedPath 	= `https://www.youtube.com/embed/${youtubeReplaceKey}?autoplay=1`;
	let moviePath 			= masterUrl.concat('movie/').concat(replaceKey).concat('/videos').concat(apiKeyAndLanguageParameter);


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
		description.text(data.overview);
		rating.text(data.vote_average);
		premiereDate.text(data.release_date);

		showGenresTag(data.genres);
		showStarRating(data.vote_average);
		showCompanies(data.production_companies);
		findVideo(data.id);

		createEventListeners();

		$(document).attr('title', `${data.title} | Detalles de la pelicula`);

	}


	function findVideo(id){
		
		console.log(movieImages.replace(replaceKey,id));

		apiRequest({
			url:moviePath.replace(replaceKey,id),
			onSuccess:function(data){
				const result=data.results;
				if(result.length>0){
					if(result[0].site=='YouTube'){
						videoIframe.data('video',result[0].key);
						createPLayVideoEventListeners(result[0].key);
					}
				}
			},
			onFail:function(xhr,status,error){
				//Pass
			}
		})

	}



	function showGenresTag(genres){
		
		let genresTag ='';
		genres.forEach(function(genreItem){
			genresTag = genresTag.concat(genreItem.name).concat(',');
		});
		genresTag=genresTag.slice(0,-1);
		genre.text(genresTag);
	
	}

	function showStarRating(vote_average){

		const maxStars = 5;
		let voteStars = (Math.round(vote_average)/2);

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

	}


	function showCompanies(production_companies){
		
		production_companies.forEach(function(company){
		
			if(company.logo_path!=null){
				
				let image = $('<img/>',{
					src:imagePath.replace(replaceImageSizeKey,'w200').replace(replaceImagePathKey,company.logo_path),
					class:'w-[100px] h-[100px] m-3 object-center object-contain shadow-2xl'
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

	}

	function createPLayVideoEventListeners(key){

		$('.play-btn-js').click(function(){	
			videoIframe.attr('src',youtubeEmbedPath.replace(youtubeReplaceKey,videoIframe.data('video')));
			$('.video-box-js').toggleClass('hidden');
		});

		$('.close-video-box-btn-js').click(function(){
			$('.video-box-js').toggleClass('hidden');
			videoIframe.attr('src','');
		});

	}

	function createEventListeners(){
		
		posterImg.hover(function(){
			$('.big-poster-js').toggleClass('hidden');
		});


		$('.play-btn-js').hover(function(){
			$('.background-box-js').toggleClass('md:blur-sm');
			backImg.toggleClass('scale-medium');
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