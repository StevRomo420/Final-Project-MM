document.addEventListener('DOMContentLoaded',function(){

	//PARAM
	const params = new URLSearchParams(window.location.search);

	//COMPONENT
	const posterImg 	= $('.poster-img-js');
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


	//Initial Check
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
	
	function showMovie(data){

		movie.toggleClass('hidden');
		posterImg.attr('src',imagePath.replace(replaceImageSizeKey,'w300').replace(replaceImagePathKey,data.poster_path));
		backImg.attr('src',imagePath.replace(replaceImageSizeKey,'original').replace(replaceImagePathKey,data.backdrop_path));
		title.text(data.title);
		length.text(data.runtime);

		let genresTag ='';
		data.genres.forEach(function(genreItem){
			genresTag = genresTag.concat(genreItem.name).concat(',');
		});

		genre.text(genresTag);
		description.text(data.overview);
		rating.text(data.vote_average);

		let stars = starRating.toArray();

	}

	function onFail(xhr,status,error){
	
		if(xhr.responseJSON!=undefined){
			showWarning('No se ha encontrado el recurso solicitado...')
		}else{
			showWarning('Error inesperado...')
		}

	}

	function showWarning(msg){
		warning.toggleClass('hidden');
		errMsg.text(msg);
	}

	findMovie();

});